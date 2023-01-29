const fs = require("fs");

module.exports = {
  init: function ()  {
  console.log('hello from init')
},
  
 loadData: function() {
  fs.readFile('companies.json', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    loaded_companies = JSON.parse(data);
    companies = loaded_companies;
    console.log("Successfully read data from file", companies[0]);
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


