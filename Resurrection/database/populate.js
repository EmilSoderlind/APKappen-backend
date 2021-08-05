const axios = require('axios')
const { insertStock, getStockInStore } = require('./queries')
const { endpoints, APIHeaders } = require('./endpoints')

const getStores = async () => {
	const { data } = await axios.get(endpoints.stores, APIHeaders)
	return data.siteSearchResults
}

const getProducts = async () => {
	let products = []
	for (let i = 1; i < 667; i++) {
		const { data } = await axios.get(endpoints.products + i, APIHeaders)
		const progress = Number((data.metadata.nextPage / 667) * 100)
		console.log(`${progress}% done`)
		products = [...products, ...data.products]
	}
	return products
}

const MAX_STOCK_PER_REQUEST = 130
const findAndUpdateMissingStock = (db) => async ({ store, products }) => {
	if (!store || !products || products.length === 0) return []
	const productIds = products.slice(0, MAX_STOCK_PER_REQUEST).map(product => product.id)
	const stock = await axios.get(endpoints.stock(productIds, store), APIHeaders)
	if (stock.length > 0) populateStock(db)({ stock: stock.data, products, store })
	return stock.data
}

const populateStock = (db) => ({ store, products, stock }) => {
	console.log('updating missing stock')
	products.forEach((product => {
		const stockEntry = stock.find((item) => item.productId === product.id)
		const stocked = stockEntry ? stockEntry.stock : 0
		const updated = new Date()
		db.run(insertStock, [store + product.id, store, product.id, stocked, updated], (err) => err && console.log(err))
	}))
}

const findUntrackedProducts = ({ stock, products }) => {
	const idsInStockCache = stock.map((item) => item.productId)
	return products.filter((product) => !idsInStockCache.includes(product.id))
}

const findStockedProducts = ({ products, stock, retreivedStock }) => {
	const idsInCachedStock = stock.filter((item) => item.stocked > 0).map((item) => item.productId)
	const idsInRetrievedStock = retreivedStock.map((item) => item.productId)
	const idsInStock = [ ...idsInCachedStock, ...idsInRetrievedStock ]
	return products.filter((product) => idsInStock.includes(product.id))
}

const getProductsInStore = (db) => async ({ store, products, onSuccess }) => {
	db.all(getStockInStore({ store, products }), [], async (err, stock) => {
		if (err) {
			res.status(400).json({ "error": err.message });
			return;
		}

		const untrackedProducts = findUntrackedProducts({ stock, products })
		const retreivedStock = await findAndUpdateMissingStock(db)({ store, products: untrackedProducts })
		const stockedProducts = findStockedProducts({ products, stock, retreivedStock })

		onSuccess(stockedProducts)
	})
}

module.exports = {
	getStores,
	getProducts,
	findAndUpdateMissingStock,
	getProductsInStore
}