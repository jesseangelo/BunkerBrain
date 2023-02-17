const fs = require("fs");

module.exports = {
  loaded_companies: [],

  init: function() {
    this.loadData()
    // console.log(tc)
    // loaded_companies = tc;
  },

  getCompanies() {
    return loaded_companies;
  },

  loadData: function() {
    fs.readFile('companies.json', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Successfully read data from file");
      loaded_companies = JSON.parse(data)
    });
  },

  saveData: function(companies) {
    this.backUp();
    fs.writeFile('companies.json',
      JSON.stringify(companies, null, 2), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Successfully written data to file");
        // We should then load here
      });
  },

  backUp: function() {
    fs.writeFile('companies_backup.json',
      JSON.stringify(loaded_companies, null, 2), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Successfully backed up data to file");
        // We should then load here
      });
  }
}


