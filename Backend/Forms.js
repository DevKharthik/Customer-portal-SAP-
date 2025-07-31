const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

const router = express.Router();

// 🔐 SAP SOAP RFC Endpoint
const SAP_URL = 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zpc_form_sd?sap-client=100';
const SAP_AUTH = {
  username: 'K901564',
  password: '06-Aug-030'
};

// 🔁 SOAP POST Utility
async function sapPost(xmlBody) {
  try {
    const { data } = await axios.post(SAP_URL, xmlBody, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions'
      },
      auth: SAP_AUTH
    });
    return data;
  } catch (error) {
    throw new Error(`SAP Post Failed: ${error.message}`);
  }
}

// 📄 Route to Get Customer Form PDF by VBELN
router.post('/form', async (req, res) => {
  const { VBELN } = req.body;

  if (!VBELN) {
    return res.status(400).json({ success: false, message: 'Missing VBELN (Sales Document Number)' });
  }

  const soapBody = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZPC_FORM_FM>
          <IV_VBELN>${VBELN}</IV_VBELN>
        </urn:ZPC_FORM_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await sapPost(soapBody);

    // Parse SOAP XML to JSON
    xml2js.parseString(response, { explicitArray: false }, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'XML Parsing Error', error: err });

      try {
        const body = result['soapenv:Envelope']?.['soapenv:Body'] || result['soap-env:Envelope']?.['soap-env:Body'];
        const formRes = Object.values(body)[0]; // <ZCP_CUSTFORM577_FM.Response>

        const pdfBase64 = formRes?.PDF_STRING;
        const vbelnRes = formRes?.IV_VBELN;

        if (!pdfBase64) {
          return res.status(404).json({ success: false, message: 'PDF data not found in response' });
        }

        res.json({
          success: true,
          vbeln: vbelnRes,
          pdfBase64
        });
      } catch (e) {
        res.status(500).json({ message: 'Unexpected SAP response structure', error: e.message });
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'SAP Request Failed', error: err.message });
  }
});

module.exports = router;