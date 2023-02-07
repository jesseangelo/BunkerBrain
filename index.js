const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const axios = require("axios");
const cheerio = require("cheerio");
const Company = require('./Types/company');
const io = require('./fileIO')
const app = express();
app.use(cors())
app.use(express.json());

var jsonParser = bodyParser.json()


// VARS
let loaded_companies = [];
let companies = [];
let constituents = [];
//

function init() {
  io.init();
}

init()

async function getEarningsDate(ticker) {
  const { data } = await axios.get('https://www.zacks.com/stock/research/'+ticker+'/earnings-calendar');
  const $ = cheerio.load(data);
  console.log('getting earnings date for', ticker)

  const date = $(".key-expected-earnings-data-module tbody > tr:first-child th").text().slice(0, 10);
  
 return date;
}

// getEarningsDate('FND')

// ROIC - probably have to refine and make sure we're getting correct data here
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

// populate SP500; get data
async function populateList() {
  const { data } = await axios.get('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies');
  const $ = cheerio.load(data);

  $("#constituents tbody tr > td:nth-child(1) > a:nth-child(1)").each(function(n, e) {
    constituents.push($(this).text())
  })
}

// populateList();

function isSP500(ticker) {
  if(!constituents.length) {
    console.error('NO CONSITUENTS')
  }
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
})

app.get('/isSP500', (req, res) => {
  console.log(req.body)
  const isSP = isSP500(req.query.ticker)
  res.send(isSP)
})

app.get('/companies', (req, res) => {
  res.send(io.getCompanies())
});

app.post('/update', (req, res) => {
  console.log("Method called is -- ", req.method)
  console.log(req.body);
  res.status(200)
  res.send('update req ' + req.body);

  //
  io.saveData(req.body)
  
  // res.end()
})

app.get('/nextearnings', (req, res) => {
  getEarningsDate(req.query.ticker).then((date) => {
    console.log('resolved')
    console.log('found date', date)
    res.send(date)
  })
})

