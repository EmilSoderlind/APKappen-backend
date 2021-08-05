module.exports = {
	endpoints: { stores: "https://api-extern.systembolaget.se/sb-api-ecommerce/v1/sitesearch/site?q=&includePredictions=true",
		store: (storeId) => `https://api-extern.systembolaget.se/sb-api-ecommerce/v1/site/store/${storeId}`,
		products: "https://api-extern.systembolaget.se/sb-api-ecommerce/v1/productsearch/search?size=30&page=",
		stock: (productIds, storeId) => `https://api-extern.systembolaget.se/sb-api-ecommerce/v1/stockbalance/store?ProductId=${productIds}&StoreId=${storeId}`
	},
	APIHeaders: {
		headers: {
			"Ocp-Apim-Subscription-Key": "cfc702aed3094c86b92d6d4ff7a54c84"
		}
	}
}