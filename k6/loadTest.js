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
        var productToTest = JSONContent[JSONContent.length-1]

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
  let categories = ["all","all_sa","cider_och_blanddrycker","vita_viner","sprit","mousserande_viner","presentartiklar","aperitif_dessert","alkoholfritt","viner","cider_och_blanddrycker_sa","vita_viner_sa","sprit_sa","mousserande_viner_sa","presentartiklar_sa","aperitif_dessert_sa","alkoholfritt_sa","viner_sa"]

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
