const express = require('express');
const cors = require('cors');
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const app = express();
app.use(cors())


app.get('/', (req, res) => {
    res.status(200);
    res.send({value: 'API working' })
})

app.get('/isSP500', (req, res) => {
  console.log(req)
  const isSP = isSP500(req.query.ticker)
  res.send(isSP)
})

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

// roic()
const constituents = [];
async function populateList() {
  const { data } = await axios.get('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies');
  const $ = cheerio.load(data);

  $("#constituents tbody tr > td:nth-child(1) > a:nth-child(1)").each(function(n, e) {
    constituents.push($(this).text())
  })
}

populateList();

function isSP500(ticker) {
  const isInSP500 = (constituents.indexOf(ticker) !== -1) 
  console.log(isInSP500)
  return isInSP500
}

// isSP500()
// fs.writeFile("coutries.json", JSON.stringify(countries, null, 2), (err) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       console.log("Successfully written data to file");
//     });
  
app.listen(3000, () => {
  console.log('server started');
});
