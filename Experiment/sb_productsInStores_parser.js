const axios = require('axios')
const pMap = require('p-map');
let Datastore = require('nedb')

const productStockEndpoint = "https://api-extern.systembolaget.se/sb-api-ecommerce/v1/sitesearch/site?q=&includePredictions=true";
let APIHeaders = {  
    headers: {
        "Ocp-Apim-Subscription-Key": "cfc702aed3094c86b92d6d4ff7a54c84"
    }
}// old: 874f1ddde97d43f79d8a1b161a77ad31

let store_DB = new Datastore({ filename: 'store_DB', autoload: true });
let product_DB = new Datastore({ filename: 'product_DB', autoload: true });

const parse_sb_productsInStores = async () => {



    store_DB.find({isAgent: false}, async (err, docs) => {
        let storeIdList = docs.map((store) => store._id)
        product_DB.find({}, async (err, docs) => {
            let productIdList = docs.map((product) => product._id)
            
            
            const result = await pMap(storeIdList, (async (storeId) => {
                let currentStoreDB = new Datastore({ filename: 'storesDB/' + storeId + '_DB', autoload: true })
                await checkIfProductInStore(storeId, productIdList, currentStoreDB)

            }), {concurrency: 2})
            console.log('Done!')

        })
    })
}

module.exports.parse_sb_productsInStores = parse_sb_productsInStores

let doneWithStore = 0

const checkIfProductInStore = async (storeId, productIdList, currentStoreDB) => {

    if(!productIdList.length) {
        doneWithStore++
        console.log('Done with store ' + storeId + ' tot: #' + doneWithStore + ' stores') 
        return
    }
    
    const topTenIds = productIdList.slice(0, 100)
    const stockbalanceEndpoint = 'https://api-extern.systembolaget.se/sb-api-ecommerce/v1/stockbalance/store?ProductId='+ topTenIds +'&StoreId='+ storeId
    const resp = await axios.get(stockbalanceEndpoint, APIHeaders)
    
    resp.data.forEach((stockDetail) => {
        product_DB.find({_id: stockDetail.productId}).exec((err, docs) => {
            const product = docs[0]
            currentStoreDB.update({ _id: stockDetail.productId }, product, { upsert: true }, function (err, numReplaced, upsert) {
                if (err) console.log(err)
            });
        })
    })
    
    
    productIdsLeft = productIdList.filter((id) => !topTenIds.includes(id))
    checkIfProductInStore(storeId, productIdsLeft, currentStoreDB)    
} 

parse_sb_productsInStores()