const fs = require("fs");
// local
const path = './data/';
// server
// const path = './';

module.exports = {
  loaded_companies: [],

  init: function() {
    this.loadData()
    // console.log(tc)
    // loaded_companies = tc;
  },

  getCompanies() {
    return this.loaded_companies;
  },

  loadData: function() {
    fs.readFile(path + 'companies.json', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      
      this.loaded_companies = JSON.parse(data)
      console.log("Successfully read data from file", this.loaded_companies);
    });
  },

  saveData: function(companies) {
    // console.log('comapnies', companies)
    this.backUp();
    fs.writeFile(path + 'companies.json',
      JSON.stringify(companies, null, 2), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Successfully written data to file");
        // We should then load here
        this.loaded_companies = [];
        this.loadData();
      });
  },

  backUp: function() {
    const time = Date.now();
    fs.writeFile(
      `${path}companies_${time}.json`,
      JSON.stringify(this.loaded_companies, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`Successfully backed up data to file companies_${time}.json`);
        // We should then load here
      }
    );
  }
}


