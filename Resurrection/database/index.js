const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')
const { getStores, getProducts, getStockedProducts } = require('./populate')
const DBSOURCE = "db.sqlite"
const { insertStore, insertProduct, insertStock, createStores, createProducts, createStock } = require('./queries')
const slugify = require('slugify')

const populateStores = async (db) => {
	const stores = await getStores()
	console.log('POPULATING STORES WITH', stores.length, 'STORES')
	stores.forEach(store => {
		db.run(insertStore, [store.siteId, store.streetAddress, store.city, store.displayName, store.position.latitude, store.position.longitude], (error) => error && console.log(error))
	})
}

const createStoresTable = async (db) => {
	console.log('CREATING TABLE STORES')
	db.run(createStores, (err) => err && console.log('TABLE STORES ALREADY EXISTS'))
}

const populateProducts = async (db) => {
	const products = await getProducts()
	console.log('POPULATING PRODUCTS WITH', products.length, 'PRODUCTS')
	products.forEach(product => {
		db.run(insertProduct, parseProduct(product), (err) => err && console.log(err))
	})
}

const createProductsTable = async (db) => {
	console.log('CREATING TABLE PRODUCTS')
	db.run(createProducts, (err) => err && console.log('TABLE PRODUCTS ALREADY EXISTS'))
}


const createStockTable = async (db) => {
	console.log('CREATING TABLE STOCK')
	db.run(createStock, (err) => err && console.log('TABLE STOCK ALREADY EXISTS'))
}

let db = new sqlite3.Database(DBSOURCE, async (err) => {
	if (err) {
		// Cannot open database
		console.error(err.message)
		throw err
	} else {
		console.log('Connected to the SQLite database.')

		await createStoresTable(db)
		await createProductsTable(db)
		await createStockTable(db)

		// await populateStores(db)
		// await populateProducts(db)

	}
});

const calculateApk = (product) => {
	const { price, volume, alcoholPercentage } = product
	return ((alcoholPercentage / 100) * volume) / price
}

const buildUrl = (product) => {
	const basePart = "https:\//www.systembolaget.se/produkt"
	const categoryPart = product.categoryLevel1 || 'vara'
	const numberPart = product.productNumber

	let namePart = product.productNameBold.toString().toLowerCase()
	namePart = namePart.replace(" & ", "-")
	namePart = slugify(namePart)

	return createdURL = basePart + "/" + categoryPart + "/" + namePart + "-" + numberPart
}

const parseProduct = (product) => {
	const data =
	{
		id: product.productId,
		name: product.productNameBold,
		subName: product.productNameThin,
		country: product.country,
		categoryLevel1: product.categoryLevel1,
		categoryLevel2: product.categoryLevel2,
		originLevel1: product.originLevel1,
		originLevel2: product.originLevel2,
		percentage: product.alcoholPercentage,
		volume: product.volume,
		price: product.price,
		apk: calculateApk(product),
		url: buildUrl(product),
		producer: product.producerName,
		usage: product.usage,
		taste: product.taste,
		outOfStock: product.isCompletelyOutOfStock,
		temporarilyOutOfStock: product.isTemporaryOutOfStock
	}

	return Object.values(data)
}


module.exports = db
