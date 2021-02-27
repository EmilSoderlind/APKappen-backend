let Datastore = require('nedb')
const express = require('express');
const category_mapping = require('./category_mapping')['category_mapping']

let db = new Datastore({ filename: 'test_neDB', autoload: true });

const PORT = 7000 
const app = express()

app.get('/', (req, res) => {

    let store = (req.query.store) || null
    let category = (req.query.category) || undefined
    let postsPerPage = Number(req.query.postsPerPage) || 5 // If you send postsPerPage=5 you get 5 hehe
    let pageIndex = Number(req.query.pageIndex) || 0
    let searchTerm = req.query.search || ''
    let searchRegex = new RegExp(searchTerm, 'i');

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

    db.find(baseQuery).sort({ APK: -1 }).skip(pageIndex * postsPerPage).limit(postsPerPage).exec((err, docs) => {
        return res.send(docs)
    })
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}!\n`))
