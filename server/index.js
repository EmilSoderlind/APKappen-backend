var request = require('request');
var slugify = require('slugify')
var fs = require("fs");

var startDate = new Date()

const express = require('express')
const app = express()
const port = 1337


var articleList = "";


// Create and set .URL attribute in article JSON-objects
// URL leads to the articles www.systembolaget.se/... page
function addURLtoProduct(product){
  var baseURL = "https:\//www.systembolaget.se/dryck";
  var categoryURL = "";
  var nameURL = "";
  var numberURL = product.nr;

  // Get category-url-text
  switch(product.Varugrupp.toLowerCase()) {
  case "rött vin":
    categoryURL = "roda-viner"
    break;
  case "blanddrycker":
    categoryURL = "cider-och-blanddrycker"
    break;
  case "cider":
    categoryURL = "cider-och-blanddrycker"
    break;
  case "vitt vin":
    categoryURL = "vita-viner"
    break;
  case "glögg och glühwein":
    categoryURL = "aperitif-dessert";
    break;
  case "öl":
    categoryURL = "ol";
    break;
  case "rosévin":
    categoryURL = "roseviner";
    break;
  case "blandlådor vin":
    categoryURL = "aperitif-dessert";
    break;
  case "smaksatt sprit":
    categoryURL = "sprit";
    break;
  case "sake":
    categoryURL = "aperitif-dessert";
    break;
  case "gin och genever":
    categoryURL = "sprit";
    break;
  case "whisky":
    categoryURL = "sprit";
    break;
  case "rom":
    categoryURL = "sprit";
    break;
  case "aperitif och dessert":
    categoryURL = "aperitif-dessert";
    break;
  case "vermouth":
    categoryURL = "aperitif-dessert";
    break;
  case "likör":
    categoryURL = "sprit";
    break;
  case "mousserande vin":
    categoryURL = "mousserande-viner";
    break;
  case "armagnac och brandy":
    categoryURL = "sprit";
    break;
  case "akvavit":
    categoryURL = "sprit";
    break;
  case "punsch":
    categoryURL = "sprit";
    break;
  case "anissprit":
    categoryURL = "sprit";
    break;
  case "akvavit och kryddat brännvin":
    categoryURL = "sprit";
    break;
  case "alkoholfritt":
    categoryURL = "alkoholfritt";
    break;
  case "cognac":
    categoryURL = "sprit";
    break;
  case "tequila och mezcal":
    categoryURL = "sprit";
    break;
  case "drinkar och cocktails":
    categoryURL = "sprit";
    break;
  case "calvados":
    categoryURL = "sprit";
    break;
  case "grappa och marc":
    categoryURL = "sprit";
    break;
  case "bitter":
    categoryURL = "sprit";
    break;
  case "vodka och brännvin":
    categoryURL = "sprit";
    break;
  case "frukt och druvsprit":
    categoryURL = "sprit";
    break;
  case "blå mousserande":
    categoryURL = "aperitif-dessert";
    break;
  case "rosé - lägre alkoholhalt":
    categoryURL = "roseviner";
    break;
  case "vita - lägre alkoholhalt":
    categoryURL = "vita-viner";
    break;
  case "röda - lägre alkoholhalt":
    categoryURL = "roda-viner";
    break;
  case "sprit av flera typer":
    categoryURL = "sprit";
    break;
  case "blå stilla":
    categoryURL = "aperitif-dessert";
    break;
  case "presentförpackningar":
    categoryURL = "presentartiklar";
    break;
  case "dryckestillbehör":
    categoryURL = "presentartiklar";
    break;
  default:
    console.log("Found new category type:" + product.Varugrupp.toLowerCase())
    // code block
}

  // Get name-url-text
  nameURL = product.Namn.toString().toLowerCase();
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

  var price = parseFloat(product.Prisinklmoms);
  var volume = parseFloat(product.Volymiml);
  var alcohol = parseFloat(String(product.Alkoholhalt).replace("%",""));
  var pant = product.Pant;

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
    product.APKMedPant = product.APK
  }else{
    product.APKMedPant = ((alcohol/100)*volume)/(price + parseFloat(pant));
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
  console.log("Parsing from SB-API starting.")

  request('https://www.systembolaget.se/api/assortment/products/xml', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.info('Download time: %dms', new Date() - startDate)

        var start = new Date()
        let resultJSON = body;
        console.info('XML to JSON parse time: %dms', new Date() - start)

        articleList = resultJSON["artiklar"]["artikel"];

        // Remove ":s from number attributes

        var start = new Date()
        processParsedProducts(articleList)

        var start = new Date()
        articleList.sort(function(a, b) {
          return parseFloat(b.APK) - parseFloat(a.APK);
        });

        console.info('Sorting time: %dms', new Date() - start)
        console.info('APK + URL processing time: %dms', new Date() - start)
        console.info('Total parse time: %dms', new Date() - startDate)
        console.log("DONE\nAntal produkter: " + Object.keys(articleList).length + "\n")

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
      var prod = articleList[i];
      listHtml = listHtml + "<li class=\"list-group-item\">"+ (i+1) +". "+ prod.Namn +" " + prod.APKScore + " APK-Score (1-100)  <a href="+addURLtoProduct(prod)+">"+addURLtoProduct(prod)+"</a></li>"
    }
    res.send('<div class=\"container\"><h2>TOP APK</h2><ul class=\"list-group\">' + listHtml + '</ul></div></body></html>');
  })

  app.get('/', (req, res) => {
    res.send("Psst, wrong endpoint!\n\nXoxo")
  })

  // Return all articles from ARRAY (memory)
  app.get('/APKappen_v1/', (req, res) => {
    if(articleList == undefined){
      res.sendStatus(204)
    }else{
      var start = new Date()
      res.json(articleList)
      console.info('Array | Response time: %dms', new Date() - start)
    }
  })

  // Return top :numberOfArticles from ARRAY (memory)
  app.get('/APKappen_v1/:numberOfArticles', (req, res) => {
    if(articleList == undefined){
      res.sendStatus(204)
    }else{
      var start = new Date()
      res.json(articleList.slice(0, req.params.numberOfArticles))
      console.info('Array | #articles: '+ req.params.numberOfArticles +' | Response time: %dms', new Date() - start)
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
