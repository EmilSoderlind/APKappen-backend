const axios = require('axios')
const pMap = require('p-map');
const { country_list } = require('./country_list');
let Datastore = require('nedb')
let slugify = require('slugify')
const category_mapping = require('./category_mapping')['category_mapping'];
const { connectedClient, getProductWithId, upsertProductToDB } = require('./mongoDB_handler');
let DB = new Datastore({ filename: 'product_DB', autoload: true });

DB.ensureIndex({ fieldName: 'APK' }, (err) => {
    if (err) console.log(err)
});

DB.ensureIndex({ fieldName: 'lastSeen' }, (err) => {
    if (err) console.log(err)
});

// AssortmentText=Fast sortiment&
const endpoint = "https://api-extern.systembolaget.se/sb-api-ecommerce/v1/productsearch/search?size=15&page=";
let APIHeaders = {  
    headers: {
        "Ocp-Apim-Subscription-Key": "cfc702aed3094c86b92d6d4ff7a54c84"
    }
}// old: 874f1ddde97d43f79d8a1b161a77ad31

parsedProductIDs = []

const buildPriceHistoryObj = (price) => {
    let date = Date.now()
    return {price, date}
}

// Recursive function that calls next page in current category. Done when next page in response is -1
const getProductsFromCategoryRequestPage = async (page, current_category, DB_client) => {
    try {
        current_url = endpoint + page + "&Country=" + current_category
        const resp = await axios.get(current_url, APIHeaders)
        
        await pMap(resp.data.products, (async (newProduct) => {

            newProduct['lastSeen'] = Date.now()
            newProduct['_id'] = newProduct.productId
            newProduct['systemBolagetURL'] = buildSBURL(newProduct)

            parsedProductIDs.push(newProduct.productId)
            addApkToProduct(newProduct)
            const oldProduct = await getProductWithId(DB_client, newProduct.productId)
            
            newProduct['priceHistory'] = [buildPriceHistoryObj(newProduct.price)]
            if (oldProduct.length === 1) {
                let priceHistory = oldProduct[0]['priceHistory']
                let lastPrice = priceHistory[priceHistory.length - 1].price
                if (lastPrice !== newProduct.price) newProduct['priceHistory'].push(priceHistory)
            }            

            await upsertProductToDB(DB_client, newProduct)        
        }), {concurrency: 15})
        
        if(resp.data.metadata.nextPage == -1) return console.log("Prod count: " + parsedProductIDs.length + " Last page parsed for category: " + current_category)
        
        next_page = page + 1
        await getProductsFromCategoryRequestPage(next_page, current_category, DB_client)
    } catch (err) {
        console.log("error inside: " + err)
    }
}

var start = new Date().getTime();


const parse_sb_products = async () => {

    const DB_client = await connectedClient()
    let countries_done = 0
    await pMap(country_list, (async (country) => {
        country_name = country['value']        
        await getProductsFromCategoryRequestPage(1, country_name, DB_client).then(async () => {   
            countries_done += 1    
            if(countries_done === country_list.length){
                console.log("Done with all countries.")
                doneWithParse()
                await DB_client.close()
            }
        })

    }), {concurrency: country_list.length})
}

const doneWithParse = () => {
    var end = new Date().getTime();
    var time = end - start;
    console.log('Parse took: ' + time/1000 + ' sec');
}

const addApkToProduct = (product) => {

    const price = product.price
    const volume = product.volume
    const alcohol = product.alcoholPercentage
    const pant = product.recycleFee;
  
    product.APK = ((alcohol / 100) * volume) / price;
    product.APKWithPant = pant ? ((alcohol / 100) * volume) / (price + parseFloat(pant)) : product.APK
}

function removeUnnecessaryFields(newProduct) {
    delete newProduct['supplierName'];
    delete newProduct['isKosher'];
    delete newProduct['restrictedParcelQuantity'];
    delete newProduct['isOrganic'];
    delete newProduct['isEthical'];
    delete newProduct['ethicalLabel'];
    delete newProduct['isWebLaunch'];
    delete newProduct['productLaunchDate'];
    delete newProduct['originLevel1'];
    delete newProduct['originLevel2'];
    delete newProduct['categoryLevel3'];
    delete newProduct['categoryLevel4'];
    delete newProduct['usage'];
    delete newProduct['taste'];
    delete newProduct['tasteSymbols'];
    delete newProduct['tasteClockGroupBitter'];
    delete newProduct['tasteClockGroupSmokiness'];
    delete newProduct['tasteClockBitter'];
    delete newProduct['tasteClockFruitacid'];
    delete newProduct['tasteClockBody'];
    delete newProduct['tasteClockRoughness'];
    delete newProduct['tasteClockSweetness'];
    delete newProduct['tasteClockSmokiness'];
    delete newProduct['tasteClockCasque'];
    delete newProduct['isManufacturingCountry'];
    delete newProduct['isRegionalRestricted'];
    delete newProduct['isNews'];
    delete newProduct['sugarContent'];
    delete newProduct['seal'];
    delete newProduct['vintage'];
    delete newProduct['grapes'];
    delete newProduct['otherSelections'];
    delete newProduct['tasteClocks'];
    delete newProduct['color'];
}

const buildSBURL = (product) => {
    const basePart = "https:\//www.systembolaget.se/produkt"
    const categoryPart = product.categoryLevel1 || 'vara'
    const numberPart = product.productNumber
  
    let namePart = product.productNameBold.toString().toLowerCase()
    namePart = namePart.replace(" & ", "-")
    namePart = slugify(namePart)
  
    return createdURL = basePart + "/" + categoryPart + "/" + namePart + "-" + numberPart
}


module.exports.parse_sb_products = parse_sb_products

parse_sb_products()