const { DB_pwd } = require('./db_auth.js');
const MongoClient = require('mongodb').MongoClient;
const APK_DB = 'APK_DB'
const PRODUCT_COLLECTION = 'products'
const STORE_COLLECTION = 'stores'
const DB_URI = "mongodb+srv://admin:" + DB_pwd +  "@cluster0.vqqkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

async function main(){
    
  
    try {
        // Connect to the MongoDB cluster
        client = await connectedClient()

        const product = {"productId":"1001500","productNumber":"3065003","productNameBold":"Halmstadoo Brygghus","productNameThin":"Vallgatan Pale Ale","category":null,"productNumberShort":"30650","producerName":"Halmstad Brygghus","supplierName":"Halmstad Brygghus AB","isKosher":false,"bottleTextShort":"Flaska","restrictedParcelQuantity":0,"isOrganic":false,"isEthical":false,"ethicalLabel":null,"isWebLaunch":false,"productLaunchDate":"2015-10-01T00:00:00","isCompletelyOutOfStock":false,"isTemporaryOutOfStock":false,"alcoholPercentage":5.5,"volumeText":"330 ml","volume":330,"price":22.9,"country":"Sverige","originLevel1":"Hallands län","originLevel2":"Halmstads kommun","categoryLevel1":"Öl","categoryLevel2":"Ale","categoryLevel3":"Amerikansk pale ale (APA)","categoryLevel4":null,"customCategoryTitle":"Öl, Ale, Amerikansk pale ale (APA) ","assortmentText":"Lokalt & Småskaligt","usage":"Serveras vid 8-10°C till rätter av fläsk- eller lammkött, eller som sällskapsdryck.","taste":"Fruktig, humlearomatisk smak med tydlig beska, inslag av apelsinmarmelad, aprikos, tallbarr och grapefrukt.","tasteSymbols":["Fläsk","Lamm","Sällskapsdryck"],"tasteClockGroupBitter":null,"tasteClockGroupSmokiness":null,"tasteClockBitter":7,"tasteClockFruitacid":0,"tasteClockBody":7,"tasteClockRoughness":0,"tasteClockSweetness":1,"tasteClockSmokiness":0,"tasteClockCasque":1,"assortment":"TSLS","recycleFee":0,"isManufacturingCountry":true,"isRegionalRestricted":false,"packaging":"Flaska","isNews":false,"images":[{"imageUrl":"https://product-cdn.systembolaget.se/productimages/1001500/1001500","fileType":null,"size":null}],"isDiscontinued":false,"isSupplierTemporaryNotAvailable":false,"sugarContent":0,"seal":[],"vintage":null,"grapes":[],"otherSelections":null,"tasteClocks":[{"key":"TasteClockBitter","value":7},{"key":"TasteClockBody","value":7},{"key":"TasteClockSweetness","value":1}],"color":"Mörk, gul färg.","lastSeen":1618253131961,"_id":"1001500","systemBolagetURL":"https://www.systembolaget.se/produkt/Öl/halmstad-brygghus-3065003","inStores":[],"APK":0.7925764192139738,"APKWithPant":0.7925764192139738,"priceHistory":[{"price":22.9,"date":1618253131964}]}

        // const result = await client.db("APK_DB").collection('products').insertOne(product)
 
        await upsertProductToDB(client, product)

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

const connectedClient = async () => {
    let client = new MongoClient(DB_URI, { useUnifiedTopology: true })
    await client.connect()
    return client
}

const upsertProductToDB = async (connectedClient, productToUpsert) => {
    await connectedClient.db(APK_DB).collection(PRODUCT_COLLECTION).updateOne(
        { _id: productToUpsert._id },
        { $set: productToUpsert },
        { upsert: true }
    )
    // console.log('Added product: ' + productToUpsert._id)
}

const upsertStoreToDB = async (connectedClient, storeToUpsert) => {
    await connectedClient.db(APK_DB).collection(STORE_COLLECTION).updateOne(
        { _id: storeToUpsert._id },
        { $set: storeToUpsert },
        { upsert: true }
    )
    // console.log('Added store: ' + storeToUpsert._id)
}

const getProductWithId = async (connectedClient, productId) => {
    return connectedClient.db(APK_DB).collection(PRODUCT_COLLECTION).find({ "_id": productId })
}

module.exports.getProductWithId = getProductWithId
module.exports.connectedClient = connectedClient
module.exports.upsertProductToDB = upsertProductToDB
module.exports.upsertStoreToDB = upsertStoreToDB

main().catch(console.error);
