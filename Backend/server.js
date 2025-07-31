const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const customerLoginRoute = require('./Login');
const customerProfileRoute = require('./CustomerProfile');
const inquiryRoute = require('./Inquiry');
const salesorder = require('./SalesOrder');
const delivery = require('./Delivery');
const invoice = require('./Invoice');
const aging = require('./PaymentAndAging');
const memo = require('./Memo');
const overallsales = require('./Overallsales');
const forms = require('./Forms');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/customer', customerLoginRoute);
app.use('/api/customer', customerProfileRoute);
app.use('/api/customer', inquiryRoute);
app.use('/api/customer', salesorder);
app.use('/api/customer', delivery);
app.use('/api/customer', invoice);
app.use('/api/customer', aging);
app.use('/api/customer', memo);
app.use('/api/customer', overallsales);
app.use('/api/customer', forms);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
