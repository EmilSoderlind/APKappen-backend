let Datastore = require('nedb')
const express = require('express');

let db = new Datastore({ filename: 'test_neDB', autoload: true });

const PORT = 7000 
const app = express()

app.get('/', (req, res) => {
    db.find({}).sort({ APK: -1 }).limit(30).exec(function (err, docs) {
        res.send(docs)
    });
})
app.listen(PORT, () => console.log(`Listening on port ${PORT}!\n`))
