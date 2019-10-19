import http from "k6/http";
import { check, group, sleep } from "k6";



export default function() {

  function checkingJSON(body){

    try {
      var JSONContent = JSON.parse(body);

      if(JSONContent.length == 0){
        return true;
      }else{
        // Taking the last product in array
        var productToTest = JSONContent[0]

        if(productToTest.ProductNameBold == ""){
          console.log("productToTest.ProductNameBold is empty")
          return false;
        }

        if(productToTest.ProductNameThin == ""){
          console.log("productToTest.ProductNameThin is empty")
          return false;
        }

        if(!productToTest.Price){
          console.log("Missing Price")
          return false;
        }

        if(!productToTest.URL){
          console.log("Missing URL")
          return false;
        }

      }

    } catch (e) {
      console.log("Error in checkingJSON")
      console.log(queryURL)
      return false;
    }

    return true;
  }

  // Missing å ä ö é since k6 n' stuff is ruuude
  let categories = ["all","all_sa","red_wine","white_wine","cider_and_mixed_drink","aperitif_and_dessert","rose_wine","sparkling_wine","rose_wine","beer","alcohol_free","wine","wine_sa","white_wine_sa","spirits_sa","sparkling_wine_sa","gifts_sa","aperitif_and_dessert_sa","alcohol_free","red_wine_sa"]

  var categoryNumber = Math.floor((Math.random() * categories.length) + 0);

  var randomCategory = categories[categoryNumber]

  var postsPerPage = Math.floor((Math.random() * 100) + 0);
  var pageIndex = Math.floor((Math.random() * 4) + 0);

  var localURL = "http://localhost"
  var hostedURL = "http://skruvdragarn.duckdns.org"

  var queryURL = localURL + ":1337/APKappen_v1?category="+randomCategory+"\&postsPerPage="+postsPerPage+"\&pageIndex=" + pageIndex;

  //console.log(queryURL)
  let response = http.get(queryURL);

  // check() returns false if any of the specified conditions fail
      let checkRes = check(response, {
          "Status is 200": (r) => r.status === 200,
          "Returning JSON": (r) => {
            try {
              JSON.parse(r.body);
            } catch (e) {
              console.log("not JSON");
              console.log(queryURL)
              return false;
            }
            return true;
          },
          "Returning correct JSON": (r) => checkingJSON(r.body)
        });
};
