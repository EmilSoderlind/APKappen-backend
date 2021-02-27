let      = require('request');
const axios = require('axios')
const { country_list } = require('./country_list');

let Datastore = require('nedb')
let db = new Datastore({ filename: 'test_neDB', autoload: true });

db.ensureIndex({ fieldName: 'APK' }, (err) => {
    if (err) console.log(err)
});

db.ensureIndex({ fieldName: 'lastSeen' }, (err) => {
    if (err) console.log(err)
});

// AssortmentText=Fast sortiment&
const endpoint = "https://api-extern.systembolaget.se/sb-api-ecommerce/v1/productsearch/search?size=15&page=";
let APIHeaders = {  
    headers: {
        "Ocp-Apim-Subscription-Key": "874f1ddde97d43f79d8a1b161a77ad31"
    }
}

parsedProductIDs = []

// Recursive function that calls next page in current category. Done when next page in response is -1
const getProductsFromCategoryRequestPage = async (page, current_category) => {
    try {
        current_url = endpoint + page + "&Country=" + current_category
        const resp = await axios.get(current_url, APIHeaders)

        resp.data.products.forEach(newElement => { 
            removeUnnecessaryFields(newElement);
            
            newElement['lastSeen'] = Date.now()
            newElement['_id'] = newElement.productId
            parsedProductIDs.push(newElement.productId)
            
            add_apk_to(newElement)

            db.update({ _id: newElement['_id'] }, newElement, { upsert: true }, function (err, numReplaced, upsert) {
                if (err) console.log(err)
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

const startSBParse = () => {
    // Since API only can provide max 666 pages with maximum 15 products each. 
    // We must query based on a filter (category) with maximum 666*15=9990 products
    
    countries_done = 0
    country_list.forEach(full_category_entry => {
        category_name = full_category_entry['value']
            
        getProductsFromCategoryRequestPage(1, category_name).then(() => {   
            countries_done += 1    
            if(countries_done == country_list.length){
                console.log("Done with all countries.")
            }
        })
    })
}

const add_apk_to = (product) => {

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

function removeUnnecessaryFields(newElement) {
    delete newElement['supplierName'];
    delete newElement['isKosher'];
    delete newElement['restrictedParcelQuantity'];
    delete newElement['isOrganic'];
    delete newElement['isEthical'];
    delete newElement['ethicalLabel'];
    delete newElement['isWebLaunch'];
    delete newElement['productLaunchDate'];
    delete newElement['originLevel1'];
    delete newElement['originLevel2'];
    delete newElement['categoryLevel3'];
    delete newElement['categoryLevel4'];
    delete newElement['usage'];
    delete newElement['taste'];
    delete newElement['tasteSymbols'];
    delete newElement['tasteClockGroupBitter'];
    delete newElement['tasteClockGroupSmokiness'];
    delete newElement['tasteClockBitter'];
    delete newElement['tasteClockFruitacid'];
    delete newElement['tasteClockBody'];
    delete newElement['tasteClockRoughness'];
    delete newElement['tasteClockSweetness'];
    delete newElement['tasteClockSmokiness'];
    delete newElement['tasteClockCasque'];
    delete newElement['isManufacturingCountry'];
    delete newElement['isRegionalRestricted'];
    delete newElement['isNews'];
    delete newElement['sugarContent'];
    delete newElement['seal'];
    delete newElement['vintage'];
    delete newElement['grapes'];
    delete newElement['otherSelections'];
    delete newElement['tasteClocks'];
    delete newElement['color'];
}

// function sort_products_on_spk( a, b ) {
//     return a.APK < b.APK ? 1 : -1
// }


// function basic_verifying_product_dict(product_dict){

//     if(product_dict.length < 1000){
//         console.log("Less than 1000 products. Weird.")
//         return false
//     }

//     if(typeof product_dict[0].APK != 'number'){
//         console.log("APK value is not a number.")
//         console.log("product_dict[0]: " + product_dict[0])
//         return false
//     }

//     return true
// }

const main = () => {
    startSBParse()

}

main()