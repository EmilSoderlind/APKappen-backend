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


let categoryList = {
  "red_wine": new Array(),
  "cider_and_mixed_drink": new Array(),
  "white_wine": new Array(),
  "spirits": new Array(),
  "sparkling_wine": new Array(),
  "beer": new Array(),
  "rose_wine": new Array(),
  "gifts": new Array(),
  "aperitif_and_dessert": new Array(),
  "alcohol_free": new Array(),

  "wine": new Array(), // Added as extra!
  "all": new Array(), // Added as extra!
  "all_sa": new Array(), // Added as extra!

  // Filteret out standard assortment (BS)
  "red_wine_sa": new Array(), // Added as extra! - Standard assortment
  "cider_and_mixed_drink_sa": new Array(), // Added as extra! - Standard assortment
  "white_wine_sa": new Array(), // Added as extra! - Standard assortment
  "spirits_sa": new Array(), // Added as extra! - Standard assortment
  "sparkling_wine_sa": new Array(), // Added as extra! - Standard assortment
  "beer_sa": new Array(), // Added as extra! - Standard assortment
  "rose_wine_sa": new Array(), // Added as extra! - Standard assortment
  "gifts_sa": new Array(), // Added as extra! - Standard assortment
  "aperitif_and_dessert_sa": new Array(), // Added as extra! - Standard assortment
  "alcohol_free_sa": new Array(), // Added as extra! - Standard assortment
  "wine_sa": new Array()  // Added as extra! - Standard assortment
}

function getEnglishCategoryName(swedishName){

  if(swedishName == null){
    return "undefined";
  }

  switch(swedishName.replaceAll("\"","")) {
    case "Röda viner":
      return "red_wine";
    case "Cider och blanddrycker":
      return "cider_and_mixed_drink";
    case "Vita viner":
      return "white_wine";
    case "Sprit":
      return "spirits";
    case "Mousserande viner":
      return "sparkling_wine";
    case "Öl":
      return "beer";
    case "Roséviner":
      return "rose_wine";
    case "Presentartiklar":
      return "gifts";
    case "Aperitif & dessert":
      return "aperitif_and_dessert"
    case "Alkoholfritt":
      return "alcohol_free"
    default:
      console.log("Found new category: " + swedishName)
  }

}

// Parse downloaded productList to category arrays
function createCategoryLists(productList){

  resetProductArrays()

  var allWines = [];

  for (var i = 0; i < productList.length; i++) {

    let currentCategory = JSON.stringify(productList[i]["Category"]).replaceAll("\"","");

    if(categoryList[currentCategory] === undefined){
      // If category == null they are weird
      //console.log("Found currentCategory=null!")
    }else{
      categoryList["all"].push(productList[i])
      categoryList[currentCategory].push(productList[i])

      if(currentCategory == "red_wine" || currentCategory == "sparkling_wine" || currentCategory == "white_wine" || currentCategory == "rose_wine"){
        allWines.push(productList[i])

        // filling viner_sa
        if(productList[i].Assortment == "FS"){
          categoryList["wine_sa"].push(productList[i])
        }
      }

      // Standard assortment --> Add to *_sa
      if(productList[i].Assortment == "FS"){
        let standardAssortmentName = currentCategory + "_sa"
        categoryList[standardAssortmentName].push(productList[i])
        categoryList["all_sa"].push(productList[i])
      }

    }
  }

  allWines.sort(function(a, b) {
    return parseFloat(b.APK) - parseFloat(a.APK);
  });

  categoryList["wine"] = allWines;
}

// Create and set .URL attribute in article JSON-objects
// URL leads to the articles www.systembolaget.se/... page
function addURLtoProduct(product){
  let baseURL = "https:\//www.systembolaget.se/dryck";
  let categoryURL = "";
  let nameURL = "";
  let numberURL = product.ProductNumber;

  if(product.Category == "undefined"){
    return;
  }

  // Get category-url-text
  switch(product.Category) {
  case "red_wine":
    categoryURL = "roda-viner"
    break;
  case "cider_and_mixed_drink":
    categoryURL = "cider-och-blanddrycker"
    break;
  case "white_wine":
    categoryURL = "vita-viner"
    break;
  case "spirits":
    categoryURL = "sprit";
    break;
  case "sparkling_wine":
    categoryURL = "mousserande-viner";
    break;
  case "beer":
    categoryURL = "ol";
    break;
  case "rose_wine":
    categoryURL = "roseviner";
    break;
  case "gifts":
    categoryURL = "presentartiklar"
    break;
  case "aperitif_and_dessert":
    categoryURL = "aperitif-dessert"
    break;
  case "alcohol_free":
    categoryURL = "alkoholfritt"
    break;
  default:
    console.log("Creating URLs")
    console.log("Found new category: " + product.Category)
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

function translateSwedishCategories(product){
  product.Category = getEnglishCategoryName(product.Category);
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

    translateSwedishCategories(productList[i])

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
    "red_wine": new Array(),
    "cider_and_mixed_drink": new Array(),
    "white_wine": new Array(),
    "spirits": new Array(),
    "sparkling_wine": new Array(),
    "beer": new Array(),
    "rose_wine": new Array(),
    "gifts": new Array(),
    "aperitif_and_dessert": new Array(),
    "alcohol_free": new Array(),

    "wine": new Array(), // Added as extra!
    "all": new Array(), // Added as extra!
    "all_sa": new Array(), // Added as extra!

    // Filteret out standard assortment (BS)
    "red_wine_sa": new Array(), // Added as extra! - Standard assortment
    "cider_and_mixed_drink_sa": new Array(), // Added as extra! - Standard assortment
    "white_wine_sa": new Array(), // Added as extra! - Standard assortment
    "spirits_sa": new Array(), // Added as extra! - Standard assortment
    "sparkling_wine_sa": new Array(), // Added as extra! - Standard assortment
    "beer_sa": new Array(), // Added as extra! - Standard assortment
    "rose_wine_sa": new Array(), // Added as extra! - Standard assortment
    "gifts_sa": new Array(), // Added as extra! - Standard assortment
    "aperitif_and_dessert_sa": new Array(), // Added as extra! - Standard assortment
    "alcohol_free_sa": new Array(), // Added as extra! - Standard assortment
    "wine_sa": new Array()  // Added as extra! - Standard assortment
  }
}

// Called to update all products
function reparseSystembolagetAPI(){
  console.log("Reparsing Systembolagets API")
  parseSystembolagetsAPI()
  //updateDynamicDns()
  lastParseDate = new Date()
}

// Make call to duckdns.org to update dynamic-IP skruvdragarn.duckdns.org
function updateDynamicDns(){
  console.log("Updating dns")

  let dnsToken = secret.duckdnsToken;

  request("https://www.duckdns.org/update?domains=skruvdragarn&token=" + dnsToken, function (error, response, body) {

    if (!error && response.statusCode == 200 && body == "OK") {
      console.log("Updating dns - DONE")
    }else{
      console.log("Could not update DNS. ERROR: \n" + response.statusCode + "-" + error)
    }

});
}

// Return sub-array of search result
function searchProductArray(arrayToSearch,searchString){
  var searchResult = [];

  if(searchString == "" || searchString == undefined || searchString == null){
    return searchResult;
  }

  for (let i = 0; i < arrayToSearch.length; i++) {
      if(((arrayToSearch[i].ProductNameBold).toLowerCase()).includes(searchString.toLowerCase())){
        searchResult.push(arrayToSearch[i])
      }
  }

  searchResult = searchResult.sort(function(a, b) {
    return parseFloat(b.APK) - parseFloat(a.APK);
  });

  return searchResult;
}

function parseSystembolagetsAPI(){

  startedParseDate = new Date()

  console.log("Parsing from systembolagets API")

  // Reparsing everyday at 03:00
  var s = schedule.scheduleJob('0 3 * * *', function(){
    console.log("03:00 | Reparsing")
    reparseSystembolagetAPI()
    console.log("03:00 | Reparsing - DONE")
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
    let search = req.query.search

    let selectedArray = processedProductsList;

    // Selecting category
    if(category != undefined){
      selectedArray = categoryList[category.toLowerCase()]

      // If category is invalid -> Return empty array
      if(selectedArray == undefined){
        res.json([]);
        return;
      }
    }

    // Filter by search-string
    if(search != undefined){
      selectedArray = searchProductArray(selectedArray,search.replaceAll("\"",""));
    }

    // Pagination
    if(isInteger(postsPerPage) && isInteger(pageIndex)){
      var startSliceIndex = (pageIndex*postsPerPage);
      var endSliceIndex = (pageIndex*postsPerPage)+(postsPerPage);

      if(postsPerPage == 0){
        // Requesting 0 posts per page --> Empty array
        selectedArray = [];
      }else if(startSliceIndex == endSliceIndex){
        // request selecting 1 product
        selectedArray = selectedArray[startSliceIndex]
      }else{

        // If we are requesting a index outside category-array
        if(selectedArray.length < endSliceIndex){
          endSliceIndex = selectedArray.length;
        }

        // If we are requesting a index outside category-array
        if(selectedArray.length < startSliceIndex){
          selectedArray = []
        }else{
          selectedArray = selectedArray.slice(startSliceIndex,endSliceIndex)
        }

      }
    }
    /*
    console.log("\nRequest:");
    console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + " GMT")
    console.log("Category: " + category)
    console.log("Pagination: from index " + startSliceIndex + " to " + endSliceIndex)
    console.log("Search: " + search)
    */
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
    res.send(lastParseDate);
  })

  app.get('/categories', (req, res) => {

    var categoriesJSON = new Object();

    categoriesJSON.red_wine = categoryList.red_wine.length;
    categoriesJSON.white_wine = categoryList.white_wine.length;
    categoriesJSON.spirits = categoryList.spirits.length;
    categoriesJSON.cider_and_mixed_drink = categoryList.cider_and_mixed_drink.length;
    categoriesJSON.sparkling_wine = categoryList.sparkling_wine.length;
    categoriesJSON.beer = categoryList.beer.length;
    categoriesJSON.rose_wine = categoryList.rose_wine.length;
    categoriesJSON.gifts = categoryList.gifts.length;
    categoriesJSON.aperitif_and_dessert = categoryList.aperitif_and_dessert.length;
    categoriesJSON.alcohol_free = categoryList.alcohol_free.length;

    categoriesJSON.wine = categoryList.wine.length;
    categoriesJSON.wine_sa = categoryList.wine_sa.length;
    categoriesJSON.all = categoryList.all.length;
    categoriesJSON.all_sa = categoryList.all_sa.length;

    categoriesJSON.red_wine_sa = categoryList.red_wine_sa.length;
    categoriesJSON.white_wine_sa = categoryList.white_wine_sa.length;
    categoriesJSON.spirits_sa = categoryList.spirits_sa.length;
    categoriesJSON.cider_and_mixed_drink_sa = categoryList.cider_and_mixed_drink_sa.length;
    categoriesJSON.sparkling_wine_sa = categoryList.sparkling_wine_sa.length;
    categoriesJSON.beer_sa = categoryList.beer_sa.length;
    categoriesJSON.rose_wine_sa = categoryList.rose_wine_sa.length;
    categoriesJSON.gifts_sa = categoryList.gifts_sa.length;
    categoriesJSON.aperitif_and_dessert_sa = categoryList.aperitif_and_dessert_sa.length;
    categoriesJSON.alcohol_free_sa = categoryList.alcohol_free_sa.length;
    res.send(categoriesJSON);
  })

  // Documentation
  app.get('/', (req, res) => {
    var file = fs.readFileSync('./Documentation.md', 'utf8');
    res.send(marked(file.toString()));
  })

  // Main request endpoint
  app.get('/APKappen_v1', (req, res) => {
    getProductsNeatly(req,res)
  })

  // Return all articles with :category
  // TO BE REMOVED
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
  // TO BE REMOVED
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
  // TO BE REMOVED
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
