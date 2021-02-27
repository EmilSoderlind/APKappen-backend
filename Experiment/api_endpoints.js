let Datastore = require('nedb')
const express = require('express');

let db = new Datastore({ filename: 'test_neDB', autoload: true });

const PORT = 7000 
const app = express()

app.get('/', (req, res) => {

    let store = (req.query.store) || null
    let category = (req.query.category) || undefined
    let postsPerPage = Number(req.query.postsPerPage) || 5 // If you send postsPerPage=5 you get 5 hehe
    let pageIndex = Number(req.query.pageIndex) || 0
    let search = req.query.search || null

    let queryObject = {}

    //console.log('category_mapping[category] = ' + JSON.stringify(category_mapping[category]))

    //if (category && category_mapping[category]) queryObject['categoryLevel1'] = category
    //if (search) queryObject['categoryLevel1'] = category

    db.find(queryObject).sort({ APK: -1 }).skip(pageIndex*postsPerPage).limit(postsPerPage).exec(function (err, docs) {
        res.send(docs)
    });
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}!\n`))
