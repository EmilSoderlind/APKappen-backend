var request = require('request');
var slugify = require('slugify')

const express = require('express')
const app = express()
const port = 1337
const systembolagetAPIEndpoint = "https://api-extern.systembolaget.se/product/v1/product";

var config = require('./config');

var processedProductsList = "";

// Create and set .URL attribute in article JSON-objects
// URL leads to the articles www.systembolaget.se/... page
function addURLtoProduct(product){
  var baseURL = "https:\//www.systembolaget.se/dryck";
  var categoryURL = "";
  var nameURL = "";
  var numberURL = product.ProductNumber;

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

  var createdURL = baseURL+"/"+categoryURL+"/"+nameURL+"-"+numberURL;
  product.URL = createdURL;
  return createdURL;
}

// Add APK + URL to list of article objects
function processParsedProducts(productList){
  var count = 0;

  // Find max APK to calculate APKScore
  var maxAPKFound = 0;

  for (var i = 0; i < productList.length; i++) {

    // Removing products that is "IsCompletelyOutOfStock = true"
    if(productList[i].IsCompletelyOutOfStock){
      productList.splice(i,1);
      console.log("Removed a IsCompletelyOutOfStock=true")
    }

    addURLtoProduct(productList[i])
    addAPKtoProduct(productList[i])

    // Max APK to calculate APKScore
    if(productList[i].APK > maxAPKFound){
      maxAPKFound = productList[i].APK
    }
  }

  // Setting APKScore
  for (var i = 0; i < productList.length; i++) {
    productList[i].APKScore = Math.ceil((productList[i].APK/maxAPKFound)*100)
  }

}

function addAPKtoProduct(product) {

  var price = parseFloat(product.Price);
  var volume = parseFloat(product.Volume);
  var alcohol = parseFloat(String(product.AlcoholPercentage).replace("%",""));
  var pant = product.RecycleFee;

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

function parseSystembolagetsAPI(){
  console.log("Parsing from systembolagets API")

  headers = {
   "Ocp-Apim-Subscription-Key" : config.Ocp_Apim_Subscription_Key
  };

  request({ url: systembolagetAPIEndpoint, headers: headers }, function (error, response, body) {

      if (!error && response.statusCode == 200) {

        var parsedProducts = JSON.parse(body);

        var start = new Date()
        processParsedProducts(parsedProducts)

        var start = new Date()
        parsedProducts.sort(function(a, b) {
          return parseFloat(b.APK) - parseFloat(a.APK);
        });

        console.info('Processing + sorting time: %dms', new Date() - start)
        console.log("Antal produkter: " + Object.keys(parsedProducts).length + "\n")

        processedProductsList = parsedProducts;

      }else{
        console.log("ERROR: \n" + response.statusCode + "-" + error)
      }
  })

}

function openEndPoints(){

  // HTML endpoint with top 500 from ARRAY
  app.get('/dump', (req, res) => {
    res.set('Content-Type', 'text/html');
    var listHtml = "<!DOCTYPE html><html lang=\"en\"><head><title>APK DUMP</title><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><link rel=\"stylesheet\" href=\"https:\/\/maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css\"><script src=\"https:\//ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js\"></script><script src=\"https:\//maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js\"></script></head><body>";
    for(var i = 0; i<18000; i++){ //TODO 18000 som magic number? använd nån längd av nått
      var prod = processedProductsList[i];
      listHtml = listHtml + "<li class=\"list-group-item\">"+ (i+1) +". "+ prod.ProductNameBold +" " + prod.APKScore + " APK-Score (1-100)  <a href="+addURLtoProduct(prod)+">"+addURLtoProduct(prod)+"</a></li>"
    }
    res.send('<div class=\"container\"><h2>TOP APK</h2><ul class=\"list-group\">' + listHtml + '</ul></div></body></html>');
  })

  app.get('/', (req, res) => {
    res.send("Psst, wrong endpoint!\n\nXoxo")
  })

  // Return all articles from ARRAY (memory)
  app.get('/APKappen_v1/', (req, res) => {
    if(processedProductsList == undefined){
      res.sendStatus(204)
    }else{
      var start = new Date()
      res.json(processedProductsList)
      console.info('Array | Response time: %dms', new Date() - start)
    }
  })

  // Return top :numberOfArticles from ARRAY (memory)
  app.get('/APKappen_v1/:numberOfArticles', (req, res) => {
    if(processedProductsList == undefined){
      res.sendStatus(204)
    }else{
      var start = new Date()
      res.json(processedProductsList.slice(0, req.params.numberOfArticles))
      console.info('#articles: '+ req.params.numberOfArticles +' | Response time: %dms', new Date() - start)
    }

  })
  app.listen(port, () => console.log(`Listening on port ${port}!`))
}

function main(){
  console.log("Main()")

  openEndPoints()

  parseSystembolagetsAPI()

  console.log("Main() - DONE")
}

main();
