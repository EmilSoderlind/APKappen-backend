import http from "k6/http";
import { sleep } from "k6";

export default function() {

  // Missing å ä ö é since k6 n' stuff is ruuude
  let categories = ["all","all_sa","cider_och_blanddrycker","vita_viner","sprit","mousserande_viner","presentartiklar","aperitif_dessert","alkoholfritt","viner","cider_och_blanddrycker_sa","vita_viner_sa","sprit_sa","mousserande_viner_sa","presentartiklar_sa","aperitif_dessert_sa","alkoholfritt_sa","viner_sa"]

  var categoryNumber = Math.floor((Math.random() * categories.length) + 0);

  var randomCategory = categories[categoryNumber]

  var postsPerPage = Math.floor((Math.random() * 1000) + 0);
  var pageIndex = Math.floor((Math.random() * 4) + 0);

  var queryURL = "http://localhost:1337/APKappen_v1?category="+randomCategory+"\&postsPerPage="+postsPerPage+"\&pageIndex=" + pageIndex;

  //console.log(queryURL)
  http.get(queryURL);
  //sleep(1);
};
