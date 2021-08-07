// Create express app
const express = require("express")
const app = express()
const db = require('./database')
const { getProductsInStore } = require('./database/populate')
const qs = require('qs')
const queries = require('./database/queries')
const stores = require('./database/stores')
// Server port
var HTTP_PORT = 8008
// Start server
app.listen(HTTP_PORT, () => {
	console.log(`Server running on port ${HTTP_PORT}`)
});
// Root endpoint
app.get("/", (req, res, next) => {
	res.json({ "message": "Welcome!" })
});

app.get("/stores", (req, res, next) => {
	var sql = "select * from store"
	var params = []
	db.all(queries.getStores, params, (err, rows) => {
		if (err) {
			res.status(400).json({ "error": err.message });
			return;
		}
		res.json(rows)
	});
});

app.get("/opening-hours", async (req, res, next) => {
	const { storeIds, storeId } = qs.parse(req.url.split('?')[1])
	res.json(await stores.getOpeningHours(storeId))
})

app.get("/products", (req, res, next) => {
	const { page, store, search, productsPerPage, category } = qs.parse(req.url.split('?')[1])
	console.log({ page, store, search, category })
	db.all(queries.getProducts({ page, productsPerPage, category, search }), [], async (err, products) => {
		if (err) {
			res.status(400).json({ "error": err.message });
			return;
		}
		const onSuccess = (productsToReturn) => res.json(productsToReturn)
		if (store) {
			await getProductsInStore(db)({ store, products, onSuccess })
		} else {
			onSuccess(products)
		}
	});
});

app.get("/stock", (req, res, next) => {
	var params = []
	db.all(queries.getStock, params, (err, rows) => {
		if (err) {
			res.status(400).json({ "error": err.message });
			return;
		}
		res.json(rows)
	});
});

// Default response for any other request
app.use(function (req, res) {
	res.status(404);
});
