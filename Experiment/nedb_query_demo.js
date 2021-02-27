let Datastore = require('nedb')
let db = new Datastore({ filename: 'test_neDB', autoload: true });

// Count all planets in the solar system
db.count( {productId: "994173" }, function (err, count) {
    // count equals to 3

    console.log("!")
    console.log("count = " + count)
});


// No query used means all results are returned (before the Cursor modifiers)
db.find({}).sort({ APK: -1 }).limit(5).exec(function (err, docs) {
    // docs is [doc3, doc1]

    console.log(" \n docs ")
    console.log(JSON.stringify(docs[0].productNameBold))
    console.log("")
    console.log(JSON.stringify(docs[1].productNameBold))
    console.log("")
    console.log(JSON.stringify(docs[2].productNameBold))
    console.log("")
    console.log(JSON.stringify(docs[3].productNameBold))
    console.log("")
    console.log(JSON.stringify(docs[4].productNameBold))
    console.log("")
    
  });