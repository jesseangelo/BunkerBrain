const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const axios = require("axios");
const cheerio = require("cheerio");
const Company = require('./Types/company');
const io = require('./fileIO')
const app = express();
app.use(cors())

var jsonParser = bodyParser.json()
 
// POST /api/users gets JSON bodies
// app.post('/api/users', jsonParser, function (req, res) {
//   // create user in req.body
// })

// VARS
let loaded_companies = [];
let companies = [];
let constituents = [];
//

function init() {
  io.init();
}

init()

// ROIC
async function roic() {
  console.log('roic data called')
  // try {
  // Fetch HTML of the page we want to scrape
  const { data } = await axios.get('https://roic.ai/company/EPAM');
  // Load HTML we fetched in the previous line
  const $ = cheerio.load(data);

  const ttm_roic = $("div.flex:nth-child(22) > div:nth-child(2) > div:nth-child(17)")
    .text()

  console.log(ttm_roic)
  return ttm_roic

  // } catch (err) {
  //   console.error(err);
  // }
}


async function populateList() {
  const { data } = await axios.get('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies');
  const $ = cheerio.load(data);

  $("#constituents tbody tr > td:nth-child(1) > a:nth-child(1)").each(function(n, e) {
    constituents.push($(this).text())
  })
}

// populateList();

function isSP500(ticker) {
  const isInSP500 = (constituents.indexOf(ticker) !== -1)
  console.log(isInSP500)
  return isInSP500
}


// ENDPOINTS
//

app.listen(3000, () => {
  console.log('server started');
});

app.get('/', (req, res) => {
  res.status(200);
  res.send({ value: 'API working' })
  // console.log(new Company('BOB'))
  
})

app.get('/isSP500', (req, res) => {
  console.log(req)
  const isSP = isSP500(req.query.ticker)
  res.send(isSP)
})

app.get('/companies', (req, res) => {
  res.send(io.getCompanies())
});

app.post('/update', jsonParser, (req, res) => {
  console.log("Method called is -- ", req.method)
  console.log(req.body);
  res.status(200)
  res.end()
})

// POST /api/users gets JSON bodies
// app.post('/api/users', jsonParser, function (req, res) {
  // create user in req.body
//})