const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const Company = require("./Types/company");
const io = require("./fileIO");
const app = express();
app.use(cors());
app.use(express.json());

var jsonParser = bodyParser.json();

// VARS
let loaded_companies = [];
let companies = [];
let constituents = [];
//

function init() {
  io.init();
  populateList();
}

init();

async function getEarningsDate(ticker) {
  const { data } = await axios.get(
    "https://www.earningswhispers.com/stocks/" + ticker
  );
  const $ = cheerio.load(data);
  console.log("getting earnings date for", ticker);

  const date = $("#datebox .mainitem").text();
  console.log(date);

  return date;
}

// getEarningsDate('FND')

// ROIC - probably have to refine and make sure we're getting correct data here
async function roic() {
  console.log("roic data called");
  // try {
  // Fetch HTML of the page we want to scrape
  const { data } = await axios.get("https://roic.ai/company/EPAM");
  // Load HTML we fetched in the previous line
  const $ = cheerio.load(data);

  const ttm_roic = $(
    "div.flex:nth-child(22) > div:nth-child(2) > div:nth-child(17)"
  ).text();

  console.log(ttm_roic);
  return ttm_roic;
}

// populate SP500; get data
async function populateList() {
  const { data } = await axios.get(
    "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
  );
  const $ = cheerio.load(data);

  $("#constituents tbody tr > td:nth-child(1) > a:nth-child(1)").each(function (
    n,
    e
  ) {
    constituents.push($(this).text());
  });
  console.log("SP500 loaded");
}

function isSP500(ticker) {
  if (!constituents.length) {
    console.error("NO CONSITUENTS");
  }
  const isInSP500 = constituents.indexOf(ticker) !== -1;
  console.log(ticker + "in SP500? " + isInSP500);
  return isInSP500;
}

// ENDPOINTS
//

app.listen(8080, () => {
  console.log("server started");
});

app.get("/", (req, res) => {
  res.status(200);
  res.send({ value: "API working" });
});

app.get("/isSP500", (req, res) => {
  console.log(req.body);
  const isSP = isSP500(req.query.ticker);
  res.send(isSP);
});

app.get("/companies", (req, res) => {
  res.send(io.getCompanies());
});

app.get("/companyOverview", (req, res) => {
  console.log("Method called is -- ", req.method);

  key = "STJWWX6PCMUT17M";

  axios
    .get(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${req.query.ticker}&apikey=${this.key}`
    )
    .then((response) => {
      console.log(`Overview for: ${req.query.ticker} \n ${response.data}`);
      res.send(response.data);
    });
});

app.get("/fearGreed", (req, res) => {
  axios
    .get("https://production.dataviz.cnn.io/index/fearandgreed/graphdata", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36",
      },
    })
    .then((response) => {
      console.log(response.data.fear_and_greed);
      res.send(response.data.fear_and_greed);
    });
});

app.post("/update", (req, res) => {
  console.log("Method called is -- ", req.method);
  console.log(req.body);
  res.status(200);
  res.send("update req " + req.body);

  //
  var all = io.getCompanies();
  var allUpdated = [];
  for (var n = 0; n < all.length; n++) {
    var comp = all[n];

    if (all[n].ticker == req.body.ticker) {
      console.log("COMPARED");
      allUpdated.push(req.body);
    } else {
      allUpdated.push(comp);
    }
  }

  console.log(allUpdated);
  // const allUpdated = []
  io.saveData(allUpdated);
  init();

  // res.end()
});

app.get("/nextearnings", (req, res) => {
  getEarningsDate(req.query.ticker).then((date) => {
    // console.log('resolved')
    console.log("found date", date);
    res.send(date);
  });
});
