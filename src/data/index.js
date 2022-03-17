let csvToJson = require("csvtojson");
let fs = require("fs");

async function convert() {
  const jsonArray = await csvToJson({
    delimiter: ";",
    flatKeys: true
  }).fromFile("data.csv");

  fs.writeFile("data.json", JSON.stringify(jsonArray), function (err) {
    if (err) return console.log(err);
    console.log("Success");
  });
}

convert();
