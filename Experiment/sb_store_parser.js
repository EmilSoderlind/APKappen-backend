const axios = require('axios')
const pMap = require('p-map');
let Datastore = require('nedb');
const { upsertStoreToDB, connectedClient } = require('./mongoDB_handler');

const storeSearchEndpoint = "https://api-extern.systembolaget.se/sb-api-ecommerce/v1/sitesearch/site?q=&includePredictions=true";
let APIHeaders = {  
    headers: {
        "Ocp-Apim-Subscription-Key": "cfc702aed3094c86b92d6d4ff7a54c84"
    }
}// old: 874f1ddde97d43f79d8a1b161a77ad31

let store_DB = new Datastore({ filename: 'store_DB', autoload: true });

const parse_sb_stores = async () => {

    const resp = await axios.get(storeSearchEndpoint, APIHeaders)
    const DB_client = await connectedClient()

    console.log('beforreeeee')
    await pMap(resp.data.siteSearchResults, (async (storeObject) => {

        storeObject['lastSeen'] = Date.now()
        storeObject['_id'] = storeObject.siteId
        delete storeObject['siteId'];

        await upsertStoreToDB(DB_client, storeObject)

    }), {concurrency: 100})
    
    await DB_client.close()
}

module.exports.parse_sb_stores = parse_sb_stores

parse_sb_stores()