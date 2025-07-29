const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

const router = express.Router();

const SAP_URL = 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zpc_customer_pay_and_aging_fm?sap-client=100';
const SAP_AUTH = {
  username: 'K901564',
  password: '06-Aug-030'
};

// SOAP POST Helper
async function sapPost(xmlBody) {
  try {
    const { data } = await axios.post(SAP_URL, xmlBody, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZPC_CUSTOMER_PAY_AND_AGING_FM'
      },
      auth: SAP_AUTH
    });
    return data;
  } catch (error) {
    throw new Error(`SAP Post Failed: ${error.message}`);
  }
}

// Inquiry fetch route
router.post('/aging', async (req, res) => {
  const { CUSTOMER_ID } = req.body;

  if (!CUSTOMER_ID) {
    return res.status(400).json({ success: false, message: 'Missing CUSTOMER_ID' });
  }

  const soapBody = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZPC_CUSTOMER_PAY_AND_AGING_FM>
          <IV_CUSTOMER_ID>${CUSTOMER_ID}</IV_CUSTOMER_ID>
        </urn:ZPC_CUSTOMER_PAY_AND_AGING_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await sapPost(soapBody);

    xml2js.parseString(response, { explicitArray: false }, (err, result) => {
      if (err) return res.status(500).json({ message: 'XML Parsing Error', error: err });

      try {
        const body = result['soapenv:Envelope']?.['soapenv:Body'] ||
                     result['soap-env:Envelope']?.['soap-env:Body'];

        const ageRes = Object.values(body)[0]; // <ZCP_INQUIRY577_FM.Response>

        const items = ageRes?.ET_AGING?.item;

        if (!items) {
          return res.status(404).json({ success: false, message: 'No inquiries found' });
        }

        const list = Array.isArray(items) ? items : [items]; // Ensure it's always an array

        const mappedAge = list.map(age => ({
          VBELN: age.VBELN,
          FKDAT: age.FKDAT,
          NETWR: age.NETWR,
          WAERK: age.WAERK,
          DATS : age.DATS,
          AGING: age.AGING

        }));

        res.json({
          success: true,
          data: mappedAge
        });
      } catch (e) {
        res.status(500).json({ message: 'Unexpected SAP response', error: e.message });
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Inquiry request failed', error: err.message });
  }
});

module.exports = router;