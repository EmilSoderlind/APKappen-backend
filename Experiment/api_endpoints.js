let Datastore = require('nedb')
const express = require('express');
const geolib = require('geolib');
const category_mapping = require('./category_mapping')['category_mapping']

const sortByGPSDistance = (referenceGPSLocation) => {
    return (storeObjectA, storeObjectB) => {
        if(verifyGPSLocation(storeObjectA.position) && verifyGPSLocation(storeObjectB.position)){
            console.log('\nwurks')
            console.log('storeObjectA.position = ' + JSON.stringify(storeObjectA.position))
            console.log('storeObjectB.position = ' + JSON.stringify(storeObjectB.position))

            const distanceToA = geolib.getDistance(referenceGPSLocation, storeObjectA.position)
            const distanceToB = geolib.getDistance(referenceGPSLocation, storeObjectB.position)

            return distanceToA > distanceToB ? 1 : -1
        } else {
            console.log('\n no wurks')
            console.log('storeObjectA.position = ' + JSON.stringify(storeObjectA.position))
            console.log('storeObjectB.position = ' + JSON.stringify(storeObjectB.position))
            return -1
        }
    }
}

const verifyGPSLocation = (locationObject) => {
    return locationObject.longitude && locationObject.latitude
}

let store_DB = new Datastore({ filename: 'store_DB', autoload: true });
let product_DB = new Datastore({ filename: 'product_DB', autoload: true });

const PORT = 7000 
const app = express()

app.get('/products', (req, res) => {

    let store = (req.query.store) || null
    let category = (req.query.category) || undefined
    let postsPerPage = Number(req.query.postsPerPage) || 5 // If you send postsPerPage=5 you get 5 hehe
    let pageIndex = Number(req.query.pageIndex) || 0
    let searchTerm = req.query.search || ''

    let oldThreshold = (new Date().getTime() / 1000) - (60 * 60 * 24)*3 // 3 days
    let baseQuery = { lastSeen: { $gt: oldThreshold }}  
    
    if (searchTerm) {
        baseQuery['$or'] = [
            {
                "productNameBold": {
                    "$regex": searchRegex,
                },
            },
            {
                "productNameThin": {
                    "$regex": searchRegex,
                },
            }
        ]
    }
    
    if (category && category_mapping[category] && category_mapping[category][0] === 1) baseQuery['categoryLevel1'] = category_mapping[category][1]
    if (category && category_mapping[category] && category_mapping[category][0] === 2) baseQuery['categoryLevel2'] = category_mapping[category][1]

    product_DB.find(baseQuery).sort({ APK: -1 }).skip(pageIndex * postsPerPage).limit(postsPerPage).exec((err, docs) => {
        return res.send(docs)
    })
})

app.get('/stores', (req, res) => {

    let postsPerPage = Number(req.query.postsPerPage) || Infinity // If you send postsPerPage=5 you get 5 hehe
    let pageIndex = Number(req.query.pageIndex) || 0
    // let latitude = Number(req.query.latitude) || null
    // let longitude = Number(req.query.longitude) || null

    store_DB.find({isAgent: false}).skip(pageIndex * postsPerPage).limit(postsPerPage).exec((err, docs) => {
        
        // let referenceGPSLocation = {latitude: 64.92830833289035, longitude: 17.42345440348815}
        // return res.send(docs.sort(sortByGPSDistance(referenceGPSLocation)))
        return res.send(docs)

    })

})

app.listen(PORT, () => console.log(`Listening on port ${PORT}!\n`))
