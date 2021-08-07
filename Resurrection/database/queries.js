const createStores = `CREATE TABLE store (id TEXT PRIMARY KEY, address TEXT, city TEXT, name TEXT, latitude REAL, longitude REAL )`
const createStock = `CREATE TABLE stock (id TEXT PRIMARY KEY, storeId TEXT, productId TEXT, stocked INTEGER, updated INTEGER)`
const createProducts = `CREATE TABLE product (
	id TEXT PRIMARY KEY, 
	name TEXT, 
	subName TEXT, 
	country TEXT, 
	categoryLevel1 TEXT, 
	categoryLevel2 TEXT, 
	originLevel1 TEXT,
	originLevel2 TEXT,
	percentage REAL, 
	volume INTEGER,
	price REAL,
	apk REAL,
	url TEXT,
	producer TEXT,
	usage TEXT,
	taste TEXT,
	outOfStock INTEGER,
	temporarilyOutOfStock INTEGER
)`

const insertStore = `INSERT OR REPLACE INTO store (id, address, city, name, latitude, longitude) VALUES (?,?,?,?,?,?)`
const insertStock = `INSERT OR REPLACE INTO stock (id, storeId, productId, stocked, updated) VALUES (?,?,?,?,?)`
const insertProduct = `INSERT OR REPLACE INTO product (
	id, 
	name, 
	subName, 
	country, 
	categoryLevel1, 
	categoryLevel2, 
	originLevel1, 
	originLevel2, 
	percentage, 
	volume, 
	price, 
	apk,
	url,
	producer,
	usage,
	taste,
	outOfStock,
	temporarilyOutOfStock
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

const UPDATE_INTERVAL = 86400 * 14
const DEFAULT_PRODUCT_PER_PAGE_LIMIT = 50
const ensureOnlyDigits = (param, fallback) => RegExp("^[0-9]*$").test(param) ? param : fallback

const getStores = "select * from store"
const getStock = "select * from stock"
const searchableColumns = ['name', 'subName', 'categoryLevel1', 'categoryLevel2', 'usage', 'taste', 'country', 'producer']
const categoryColumns = ['categoryLevel1', 'categoryLevel2']
const getProducts = ({ page, productsPerPage, category, search }) => {
	productsPerPage = ensureOnlyDigits(productsPerPage, DEFAULT_PRODUCT_PER_PAGE_LIMIT)
	page = ensureOnlyDigits(page, 1)
	const from = (productsPerPage * (page - 1))
	const to = (productsPerPage * (page))

	const categoryFilter = category && `( ${categoryColumns.map((column) => `${column} = "${category}"`).join(' or ') } )`
	const searchFilter = search && `( ${searchableColumns.map((column) => `${column} like "%${search}%"`).join(' or ')} )`
	const filter = (categoryFilter || searchFilter) && `where ${[categoryFilter, searchFilter].filter(Boolean).join(' and ')}`
	return `select * from product ${filter || ''} order by apk desc limit ${from}, ${to}`
}

const getStockInStore = ({ store, products }) => {
	const productIds = products.map(product => `"${product.id}"`).join(',')
	const updateThreshold = new Date() - UPDATE_INTERVAL
	return `select * from stock where storeId="${store}" and productId in (${productIds}) and updated > ${updateThreshold}`
}

module.exports = {
	createStores,
	createStock,
	createProducts,
	insertStore,
	insertProduct,
	insertStock,
	getStores,
	getProducts,
	getStock,
	getStockInStore
}