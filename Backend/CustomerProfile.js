// customerProfile.js
const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

const router = express.Router();

// Your SAP WSDL Endpoint and Auth
const SAP_URL = 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zpc_profile_c_sd?sap-client=100';
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
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZPC_CUSTOMER_PROFILE_FM'
      },
      auth: SAP_AUTH
    });
    return data;
  } catch (error) {
    throw new Error(`SAP Post Failed: ${error.message}`);
  }
}

// Profile route
router.post('/profile', async (req, res) => {
  const { CUSTOMER_ID } = req.body;

  if (!CUSTOMER_ID) {
    return res.status(400).json({ success: false, message: 'Missing CUSTOMER_ID' });
  }

  const soapBody = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZPC_CUSTOMER_PROFILE_FM>
          <IV_KUNNR>${CUSTOMER_ID}</IV_KUNNR>
        </urn:ZPC_CUSTOMER_PROFILE_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await sapPost(soapBody);

    xml2js.parseString(response, { explicitArray: false }, (err, result) => {
      if (err) return res.status(500).json({ message: 'XML Parsing Error', error: err });

      try {
        const body = result['soapenv:Envelope']?.['soapenv:Body'] ||
                     result['soap-env:Envelope']?.['soap-env:Body'];

        const profileRes = Object.values(body)[0]; // <ZPC_CUSTOMER_PROFILE_FM.Response>

        const profile = profileRes?.ES_PROFILE;
        const message = profileRes?.EV_MESSAGE;

        if (profile && profile.CUSTOMER_NUMBER) {
          res.json({
            success: true,
            message,
            data: {
              CUSTOMER_NUMBER: profile.CUSTOMER_NUMBER,
              NAME: profile.NAME,
              STREET: profile.STREET,
              CITY: profile.CITY,
              COUNTRY: profile.COUNTRY,
              POSTAL: profile.POSTAL
            }
          });
        } else {
          res.status(404).json({ success: false, message });
        }
      } catch (e) {
        res.status(500).json({ message: 'Unexpected SAP response', error: e.message });
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Profile request failed', error: err.message });
  }
});

module.exports = router;
