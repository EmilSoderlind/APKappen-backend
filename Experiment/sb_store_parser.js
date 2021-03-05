const axios = require('axios')
let Datastore = require('nedb')

const storeSearchEndpoint = "https://api-extern.systembolaget.se/sb-api-ecommerce/v1/sitesearch/site?q=&includePredictions=true";
let APIHeaders = {  
    headers: {
        "Ocp-Apim-Subscription-Key": "cfc702aed3094c86b92d6d4ff7a54c84"
    }
}// old: 874f1ddde97d43f79d8a1b161a77ad31

let store_DB = new Datastore({ filename: 'store_DB', autoload: true });

const parse_sb_stores = async () => {

    const resp = await axios.get(storeSearchEndpoint, APIHeaders)

    resp.data.siteSearchResults.forEach((storeObject) => { 
        storeObject['lastSeen'] = Date.now()
        storeObject['_id'] = storeObject.siteId
        delete storeObject['siteId'];

        store_DB.update({ _id: storeObject['_id'] }, storeObject, { upsert: true }, function (err, numReplaced, upsert) {
            if (err) console.log(err)
        });

    })
}

module.exports.parse_sb_stores = parse_sb_stores

parse_sb_stores()