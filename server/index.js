let request = require('request');
let fs = require('fs')
let slugify = require('slugify')
let marked = require('marked')
let schedule = require('node-schedule');

const express = require('express')
const app = express()
const port = 1337
const systembolagetAPIEndpoint = "https://api-extern.systembolaget.se/product/v1/product";

let secret = require('./secret');

let lastParseDate = new Date()
let startedParseDate = new Date()

let processedProductsList = "";

// categoiesList
// |---> "Öl" |
// |          | ---> product
// |          | ---> product
let categoryList = {
  "röda_viner": new Array(),
  "cider_och_blanddrycker": new Array(),
  "vita_viner": new Array(),
  "sprit": new Array(),
  "mousserande_viner": new Array(),
  "öl": new Array(),
  "roséviner": new Array(),
  "presentartiklar": new Array(),
  "aperitif_dessert": new Array(),
  "alkoholfritt": new Array(),
  "viner": new Array(), // Added as extra!

  // Filteret out standard assortment (BS)
  // TODO Fill below arrays
  "röda_viner_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "cider_och_blanddrycker_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "vita_viner_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "sprit_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "mousserande_viner_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "öl_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "roséviner_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "presentartiklar_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "aperitif_dessert_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "alkoholfritt_standard_assortment": new Array(), // Added as extra! - Standard assortment
  "viner_standard_assortment": new Array()  // Added as extra! - Standard assortment
}

// Maybe remove?
let categoryNames = {
  röda_viner: "Röda viner",
  cider_och_blanddrycker: "Cider och blanddrycker",
  vita_viner: "Vita viner",
  sprit: "Sprit",
  mousserande_viner: "Mousserande viner",
  öl: "Öl",
  roséviner: "Roséviner",
  presentartiklar: "Presentartiklar",
  aperitif_dessert: "Aperitif & dessert",
  alkoholfritt: "Alkoholfritt"
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
    currentCategory = currentCategory.replaceAll("\"","").toLowerCase();

    if(categoryList[currentCategory] === undefined){
      //console.log("Found currentCategory=null!")
    }else{
      categoryList[currentCategory].push(productList[i])

      if(currentCategory == "röda_viner" || currentCategory == "mousserande_viner" || currentCategory == "vita_viner" || currentCategory == "roséviner"){
        allWines.push(productList[i])
      }
    }
  }

  allWines.sort(function(a, b) {
    return parseFloat(b.APK) - parseFloat(a.APK);
  });

  categoryList["viner"] = allWines;
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
    "röda_viner": new Array(),
    "cider_och_blanddrycker": new Array(),
    "vita_viner": new Array(),
    "sprit": new Array(),
    "mousserande_viner": new Array(),
    "öl": new Array(),
    "roséviner": new Array(),
    "presentartiklar": new Array(),
    "aperitif_dessert": new Array(),
    "alkoholfritt": new Array(),
    "viner": new Array(), // Added as extra!

    // Filteret out standard assortment (BS)
    "röda_viner_standard_assortment": new Array(),
    "cider_och_blanddrycker_standard_assortment": new Array(),
    "vita_viner_standard_assortment": new Array(),
    "sprit_standard_assortment": new Array(),
    "mousserande_viner_standard_assortment": new Array(),
    "öl_standard_assortment": new Array(),
    "roséviner_standard_assortment": new Array(),
    "presentartiklar_standard_assortment": new Array(),
    "aperitif_dessert_standard_assortment": new Array(),
    "alkoholfritt_standard_assortment": new Array(),
    "viner_standard_assortment": new Array()
  }
}

// Called every 24h
function reparseSystembolagetAPI(){
  console.log("Reparsing Systembolagets API")
  parseSystembolagetsAPI()
  updateDynamicDns()
  lastParseDate = new Date()
}

function updateDynamicDns(){
  console.log("Updating dns.")

  let dnsToken = secret.duckdnsToken;

  request("https://www.duckdns.org/update?domains=skruvdragarn&token=" + dnsToken, function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
}

function parseSystembolagetsAPI(){
  console.log("Parsing from systembolagets API")

  // Reparsing everyday at 03:00
  var s = schedule.scheduleJob('0 3 * * *', function(){
    console.log("03:00 - Reparsing.")
    reparseSystembolagetAPI()
  });

  headers = {
   "Ocp-Apim-Subscription-Key" : secret.Ocp_Apim_Subscription_Key
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

// category == null (ALL)
function getProductsNeatly(req, res){

  if(processedProductsList == undefined){
    res.sendStatus(204)
  }else{

    let category = (req.query.category)
    let postsPerPage = Number(req.query.postsPerPage);
    let pageIndex = Number(req.query.pageIndex);

    let selectedArray = processedProductsList;

    // Selecting category
    if(category != undefined){
      selectedArray = categoryList[category.toLowerCase()]
    }

    // Pagination
    if(isInteger(postsPerPage) && isInteger(pageIndex)){
      var startSliceIndex = (pageIndex*postsPerPage);
      var endSliceIndex = (pageIndex*postsPerPage)+(postsPerPage);

      console.log("From " + startSliceIndex + " to " + endSliceIndex)

      if(startSliceIndex == endSliceIndex){
        selectedArray = selectedArray[startSliceIndex]
      }else{
        selectedArray = selectedArray.slice(startSliceIndex,endSliceIndex)
      }
    }

    res.json(selectedArray)
    return;
  }
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
  app.get('/APKappen_v1', (req, res) => {
    getProductsNeatly(req,res)
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

  reparseSystembolagetAPI()

}

main();
