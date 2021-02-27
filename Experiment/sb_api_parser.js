const axios = require('axios')
const { country_list } = require('./country_list');
let Datastore = require('nedb')
let slugify = require('slugify')
const category_mapping = require('./category_mapping')['category_mapping']
let DB = new Datastore({ filename: 'test_neDB', autoload: true });

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
const getProductsFromCategoryRequestPage = async (page, current_category) => {
    try {
        current_url = endpoint + page + "&Country=" + current_category
        const resp = await axios.get(current_url, APIHeaders)

        resp.data.products.forEach(async (newProduct) => { 
            //removeUnnecessaryFields(newProduct);
            
            newProduct['lastSeen'] = Date.now()
            newProduct['_id'] = newProduct.productId
            newProduct['systemBolagetURL'] = buildSBURL(newProduct)

            parsedProductIDs.push(newProduct.productId)
            
            addApkToProduct(newProduct)

            DB.find({ "_id": newProduct.productId }, function (err, docs) {

                newProduct['priceHistory'] = [buildPriceHistoryObj(newProduct.price)]
                
                if (docs.length === 1) {
                    let priceHistory = docs[0]['priceHistory']
                    let lastPrice = priceHistory[priceHistory.length - 1].price
                    
                    if (lastPrice !== newProduct.price){
                        newProduct['priceHistory'].push(priceHistory)
                    }
                }            

                DB.update({ _id: newProduct['_id'] }, newProduct, { upsert: true }, function (err, numReplaced, upsert) {
                    if (err) console.log(err)
                });
            });

        });
        
        if(resp.data.metadata.nextPage == -1){ // When there is no more pages in current category
            console.log("Prod count: " + parsedProductIDs.length + " Last parse for category: " + current_category)
            return current_category
        }
        
        next_page = page + 1
        await getProductsFromCategoryRequestPage(next_page, current_category)

    } catch (err) {
        // Handle Error Here
        console.log("error inside: " + err)
    }
};

var start = new Date().getTime();


const startSBParse = () => {

    // Since API only can provide max 666 pages with maximum 15 products each. 
    // We must query based on a filter (category) with maximum 666*15=9990 < products
    countries_done = 0
    country_list.forEach(full_category_entry => {
        category_name = full_category_entry['value']
            
        getProductsFromCategoryRequestPage(1, category_name).then(() => {   
            countries_done += 1    
            if(countries_done == country_list.length){
                console.log("Done with all countries.")
                doneWithParse()

            }
        })
    })
}

const doneWithParse = () => {
    var end = new Date().getTime();
    var time = end - start;
    console.log('Parse took: ' + time/1000 + ' sec');
}

const addApkToProduct = (product) => {

    let price = product.price
    let volume = product.volume
    let alcohol = product.alcoholPercentage
    let pant = product.recycleFee;
  
    product.APK = ((alcohol / 100) * volume) / price;
  
    if (pant == undefined) {
      product.APKWithPant = product.APK
    } else {
      product.APKWithPant = ((alcohol / 100) * volume) / (price + parseFloat(pant));
    }

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

    let basePart = "https:\//www.systembolaget.se/produkt"
    let categoryPart = product.categoryLevel1 || 'vara'
    let numberPart = product.productNumber
  
    let namePart = product.productNameBold.toString().toLowerCase()
    namePart = namePart.replace(" & ", "-")
    namePart = slugify(namePart)
  
    return createdURL = basePart + "/" + categoryPart + "/" + namePart + "-" + numberPart
}


const main = () => {
    startSBParse()
}

main()