const fs = require("fs");
const axios = require("axios");

module.exports = {
  key: "STJWWX6PCMUT17M",
  companyOverview(ticker) {
    return axios.get(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${this.key}`
    );
  },

  balanceSheet(ticker) {
    return axios.get(
      `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${ticker}&apikey=${this.key}`
    );
  },

  cashFlow(ticker) {
    return axios.get(
      `https://www.alphavantage.co/query?function=CASH_FLOW&symbol=${ticker}&apikey=${this.key}`
    );
  },

  incomeStatement(ticker) {
    return axios.get(
      `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${ticker}&apikey=${this.key}`
    );
  },
};
