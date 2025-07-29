const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { customerId, password } = req.body;

  const sapUrl = 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zpc_sd_login_customer?sap-client=100';

  const soapRequest = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZPC_LOGIN_FM>
          <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
          <IV_PASSWORD>${password}</IV_PASSWORD>
        </urn:ZPC_LOGIN_FM>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  try {
    const response = await axios.post(sapUrl, soapRequest, {
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic ' + Buffer.from('K901564:06-Aug-030').toString('base64'),
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions'
      }
    });

    xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('XML Parse Error:', err);
        return res.status(500).json({ error: 'Invalid XML response' });
      }

      try {
        const soapBody = result['soap-env:Envelope']['soap-env:Body'];
        const loginResponse = soapBody['n0:ZPC_LOGIN_FMResponse'];
        const flag = loginResponse['EV_FLAG'];
        const message = loginResponse['EV_MESSAGE'];

        return res.json({ flag, message });
      } catch (e) {
        console.error('Unexpected XML structure:', e);
        return res.status(500).json({ error: 'Could not parse SAP response' });
      }
    });

  } catch (error) {
    console.error('SAP Error:', error.message);
    return res.status(500).json({ error: 'SAP login failed' });
  }
});

module.exports = router;
