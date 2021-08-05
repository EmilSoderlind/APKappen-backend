const axios = require('axios')
const { endpoints, APIHeaders } = require('./endpoints')

const getStores = async () => {
	const { data } = await axios.get(endpoints.stores, APIHeaders)
	return data.siteSearchResults
}

const getOpeningHours = async (storeId) => {
	const { data } = await axios.get(endpoints.store(storeId), APIHeaders)
	return data && {
		isOpen: data.isOpen,
		openFrom: data.openingHours[0].openFrom,
		openTo: data.openingHours[0].openTo,
	}
}

module.exports = {
	getStores,
	getOpeningHours
}