let request = require('request');
let fs = require('fs')
let slugify = require('slugify')
let marked = require('marked')
let schedule = require('node-schedule');

const express = require('express')
const app = express()
const port = 1337
const systembolagetAPIEndpoint = "https://api-extern.systembolaget.se/product/v1/product";

let config = require('./config');
let lastParseDate = new Date()
let startedParseDate = new Date()

let processedProductsList = "";

// categoiesList
// |---> "Öl" |
// |          | ---> product
// |          | ---> product
let categoryList = {
  "Röda_viner": new Array(),
  "Cider_och_blanddrycker": new Array(),
  "Vita_viner": new Array(),
  "Sprit": new Array(),
  "Mousserande_viner": new Array(),
  "Öl": new Array(),
  "Roséviner": new Array(),
  "Presentartiklar": new Array(),
  "Aperitif_dessert": new Array(),
  "Alkoholfritt": new Array(),
  "Viner": new Array(), // Added as extra!

  // Filteret out standard assortment (BS)
  // TODO Fill below arrays
  "Röda_viner_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "Cider_och_blanddrycker_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "Vita_viner_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "Sprit_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "Mousserande_viner_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "Öl_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "Roséviner_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "Presentartiklar_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "Aperitif_dessert_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "Alkoholfritt_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "Viner_standard_assortment": new Array()  // Added as extra! - Standard assortment
}

// Maybe remove?
let categoryNames = {
  Röda_viner: "Röda viner",
  Cider_och_blanddrycker: "Cider och blanddrycker",
  Vita_viner: "Vita viner",
  Sprit: "Sprit",
  Mousserande_viner: "Mousserande viner",
  Öl: "Öl",
  Roséviner: "Roséviner",
  Presentartiklar: "Presentartiklar",
  Aperitif_dessert: "Aperitif & dessert",
  Alkoholfritt: "Alkoholfritt"
}


// Given ""-string gives all categories
// TODO
function getStandardAssortmentWithCategory(category){



}

function createCategoryLists(productList){

  resetProductArrays()

  var allWines = [];

  for (var i = 0; i < productList.length; i++) {

    let currentCategory = JSON.stringify(productList[i]["Category"]).replaceAll(" ","_")
    currentCategory = currentCategory.replaceAll("&","").replaceAll("__","_")
    currentCategory = currentCategory.replaceAll("\"","")

    if(categoryList[currentCategory] === undefined){
      //console.log("Found currentCategory=null!")
    }else{
      categoryList[currentCategory].push(productList[i])

      if(currentCategory == "Röda_viner" || currentCategory == "Mousserande_viner" || currentCategory == "Vita_viner" || currentCategory == "Roséviner"){
        allWines.push(productList[i])
      }

    }
  }

  allWines.sort(function(a, b) {
    return parseFloat(b.APK) - parseFloat(a.APK);
  });

  categoryList["Viner"] = allWines;
}

// Create and set .URL attribute in article JSON-objects
// URL leads to the articles www.systembolaget.se/... page
function addURLtoProduct(product){
  let baseURL = "https:\//www.systembolaget.se/dryck";
  let categoryURL = "";
  let nameURL = "";
  let numberURL = product.ProductNumber;

  if(product.Category == null){
    return;
  }

  // Get category-url-text
  switch(String(product.Category)) {
  case "Röda viner":
    categoryURL = "roda-viner"
    break;
  case "Cider och blanddrycker":
    categoryURL = "cider-och-blanddrycker"
    break;
  case "Vita viner":
    categoryURL = "vita-viner"
    break;
  case "Sprit":
    categoryURL = "sprit";
    break;
  case "Mousserande viner":
    categoryURL = "mousserande-viner";
    break;
  case "Öl":
    categoryURL = "ol";
    break;
  case "Roséviner":
    categoryURL = "roseviner";
    break;
  case "Presentartiklar":
    categoryURL = "presentartiklar"
    break;
  case "Aperitif & dessert":
    categoryURL = "aperitif-dessert"
    break;
  case "Alkoholfritt":
    categoryURL = "alkoholfritt"
    break;
  default:
    console.log("Found new category: " + product.Category)
    console.log(product)
    // code block
}

  // Get name-url-text
  nameURL = product.ProductNameBold.toString().toLowerCase();
  nameURL = nameURL.replaceAll("\'","")
  nameURL = nameURL.replaceAll("!","")
  nameURL = slugify(nameURL);
  nameURL = nameURL.replaceAll("-and-","-")

  let createdURL = baseURL+"/"+categoryURL+"/"+nameURL+"-"+numberURL;
  product.URL = createdURL;
  return createdURL;
}

// Add APK + URL to list of article objects
function processParsedProducts(productList){
  let count = 0;

  // Find max APK to calculate APKScore
  let maxAPKFound = 0;

  for (let i = 0; i < productList.length; i++) {

    // Removing products that is "IsCompletelyOutOfStock = true"
    if(productList[i].IsCompletelyOutOfStock){
      productList.splice(i,1);
      //console.log("Removed a IsCompletelyOutOfStock=true")
    }

    addURLtoProduct(productList[i])
    addAPKtoProduct(productList[i])

    // Max APK to calculate APKScore
    if(productList[i].APK > maxAPKFound){
      maxAPKFound = productList[i].APK
    }
  }

  // Setting APKScore
  for (let i = 0; i < productList.length; i++) {
    productList[i].APKScore = Math.ceil((productList[i].APK/maxAPKFound)*100)
  }
}

function addAPKtoProduct(product) {

  let price = parseFloat(product.Price);
  let volume = parseFloat(product.Volume);
  let alcohol = parseFloat(String(product.AlcoholPercentage).replace("%",""));
  let pant = product.RecycleFee;

  if(Number.isNaN(price) || Number.isNaN(volume) || Number.isNaN(alcohol)){
    console.error("---------------------")
    console.error("Fatal error in addAPKtoProduct. A value is NaN.")
    console.error("Price: " + price);
    console.error("volume: " + volume);
    console.error("alcohol: " + alcohol);
    console.error("---------------------")
    return -1;
  }

  product.APK = ((alcohol/100)*volume)/price;

  if(pant == undefined){
    product.APKWithPant = product.APK
  }else{
    product.APKWithPant = ((alcohol/100)*volume)/(price + parseFloat(pant));
  }
}

function isFloat(n) {
    return n === +n && n !== (n|0);
}

function isInteger(n) {
    return n === +n && n === (n|0);
}

String.prototype.replaceAll = function(str1, str2, ignore){
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

function resetProductArrays(){

  console.log("Resetting product arrays.")

  categoryList = {
    "Röda_viner": new Array(),
    "Cider_och_blanddrycker": new Array(),
    "Vita_viner": new Array(),
    "Sprit": new Array(),
    "Mousserande_viner": new Array(),
    "Öl": new Array(),
    "Roséviner": new Array(),
    "Presentartiklar": new Array(),
    "Aperitif_dessert": new Array(),
    "Alkoholfritt": new Array(),
    "Viner": new Array(), // Added as extra!

    // Filteret out standard assortment (BS)
    "Röda_viner_standard_assortment": new Array(),
    "Cider_och_blanddrycker_standard_assortment": new Array(),
    "Vita_viner_standard_assortment": new Array(),
    "Sprit_standard_assortment": new Array(),
    "Mousserande_viner_standard_assortment": new Array(),
    "Öl_standard_assortment": new Array(),
    "Roséviner_standard_assortment": new Array(),
    "Presentartiklar_standard_assortment": new Array(),
    "Aperitif_dessert_standard_assortment": new Array(),
    "Alkoholfritt_standard_assortment": new Array(),
    "Viner_standard_assortment": new Array()
  }
}

// Called every 24h
function reparseSystembolagetAPI(){
  console.log("Reparsing Systembolagets API")
  parseSystembolagetsAPI()
  lastParseDate = new Date()
}

function parseSystembolagetsAPI(){
  console.log("Parsing from systembolagets API")

  // Reparsing everyday at 03:00
  var s = schedule.scheduleJob('0 3 * * *', function(){
    console.log("03:00 - Reparsing.")
    reparseSystembolagetAPI()
  });

  headers = {
   "Ocp-Apim-Subscription-Key" : config.Ocp_Apim_Subscription_Key
  };

  request({ url: systembolagetAPIEndpoint, headers: headers }, function (error, response, body) {
    console.info('Download time: %dms', new Date() - startedParseDate)

    if (!error && response.statusCode == 200) {

      let parsedProducts = JSON.parse(body);

      let beforeProcessAndSortDate = new Date()
      processParsedProducts(parsedProducts)
      parsedProducts.sort(function(a, b) {
        return parseFloat(b.APK) - parseFloat(a.APK);
      });

      console.info('Processing + sorting time: %dms', new Date() - beforeProcessAndSortDate)
      console.log("Antal produkter: " + Object.keys(parsedProducts).length)

      processedProductsList = parsedProducts;

      createCategoryLists(processedProductsList);

    }else{
      console.log("ERROR: \n" + response.statusCode + "-" + error)
    }
  })
}

function openEndPoints(){

  // HTML endpoint with top 500 from ARRAY
  app.get('/dump', (req, res) => {
    res.set('Content-Type', 'text/html');
    let listHtml = "<!DOCTYPE html><html lang=\"en\"><head><title>APK DUMP</title><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><link rel=\"stylesheet\" href=\"https:\/\/maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css\"><script src=\"https:\//ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js\"></script><script src=\"https:\//maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js\"></script></head><body>";
    for(let i = 0; i<18000; i++){ //TODO 18000 som magic number? använd nån längd av nått
      let prod = processedProductsList[i];
      listHtml = listHtml + "<li class=\"list-group-item\">"+ (i+1) +". "+ prod.ProductNameBold +" " + prod.APKScore + " APK-Score (1-100)  <a href="+addURLtoProduct(prod)+">"+addURLtoProduct(prod)+"</a></li>"
    }
    res.send('<div class=\"container\"><h2>TOP APK</h2><ul class=\"list-group\">' + listHtml + '</ul></div></body></html>');
  })

  app.get('/lastParse', (req, res) => {
    res.send(lastParseDate.toString());
  })

  app.get('/', (req, res) => {

    var file = fs.readFileSync('documentation.md', 'utf8');
    res.send(marked(file.toString()));
  })

  // Return all articles
  app.get('/APKappen_v1/', (req, res) => {
    if(processedProductsList == undefined){
      res.sendStatus(204)
    }else{
      let start = new Date()
      res.json(processedProductsList)
      console.info('Array | Response time: %dms', new Date() - start)
    }
  })

  // Return all articles with :category
  app.get('/APKappen_v1/category/:selectedCategory', (req, res) => {
    if(processedProductsList == undefined){
      res.sendStatus(204)
    }else{
      let start = new Date()
      let selectedCategory = req.params.selectedCategory
      res.json(categoryList[selectedCategory])
      console.info('Response time: %dms', new Date() - start)
    }
  })

  // Return all articles with :category top :numberOfArticles
  app.get('/APKappen_v1/category/:selectedCategory/:numberOfArticles', (req, res) => {
    if(processedProductsList == undefined){
      res.sendStatus(204)
    }else{
      let start = new Date()
      let selectedCategory = req.params.selectedCategory
      res.json(categoryList[selectedCategory].slice(0, req.params.numberOfArticles))
      console.info('Response time: %dms', new Date() - start)
    }
  })

  // Return top :numberOfArticles
  app.get('/APKappen_v1/:numberOfArticles', (req, res) => {
    if(processedProductsList == undefined){
      res.sendStatus(204)
    }else{
      let start = new Date()
      res.json(processedProductsList.slice(0, req.params.numberOfArticles))
      console.info('#articles: '+ req.params.numberOfArticles +' | Response time: %dms', new Date() - start)
    }

  })
  app.listen(port, () => console.log(`Listening on port ${port}!\n`))
}

function main(){

  openEndPoints()

  parseSystembolagetsAPI()

}

main();
