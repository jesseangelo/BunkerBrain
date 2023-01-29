let Company = class {
  watchList = false;
  portfolio = false;
  costBasis = null;
  shares = 0;
  marketcap = null;
  isSP500 = null;
  notes = [];
  
  constructor(ticker) {
    this.ticker = ticker;
  }
  
}

module.exports = Company;