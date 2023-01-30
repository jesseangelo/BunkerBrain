const fs = require("fs");

module.exports = {
  loaded_companies: [],
  
  init: function() {
    this.loadData();
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
      loaded_companies = JSON.parse(data);
      // companies = loaded_companies;
      console.log("Successfully read data from file");
      // return JSON.parse(data)
    });
  },

  saveData: function() {
    fs.writeFile('companies.json',
      JSON.stringify(companies, null, 2), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Successfully written data to file");
      });
  }
}


