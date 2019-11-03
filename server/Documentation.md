# Documentation APKappen_v2
All returned products is sorted by APK.

## BaseURL: http://skruvdragarn.duckdns.org
## PORT: 1337/1338

## Endpoint: /APKappen_v2/products
### Query options
Several query parameters can be used simultaneously.
#### Store (SiteId)
Get products in a certain store with SiteId. Example: http://skruvdragarn.duckdns.org:1337/APKappen_v2/products?store=0120
#### Filter by category
Example: http://skruvdragarn.duckdns.org:1337/APKappen_v2/products?category=sprit
#### Pagination
You must provide both postsPerPage AND pageIndex do use pagination.
Example: http://skruvdragarn.duckdns.org:1337/APKappen_v2/products?postsPerPage=4&pageIndex=333
#### Search
Return products (ProductNameBold/ProductNameThin) that contains the given string.
Example: http://skruvdragarn.duckdns.org:1337/APKappen_v2/products?search="pripps%20blå"

## Endpoint: /APKappen_v2/stores
### Query options
Several query parameters can be used simultaneously.
#### Get n nearest stores (Require lat/long)


### Other
#### This documentation page
http://skruvdragarn.duckdns.org:1337/
#### Last parse date
http://skruvdragarn.duckdns.org:1337/lastParse
#### Names + size of each category
http://skruvdragarn.duckdns.org:1337/categories
#### Status of API (Health monitor)
http://skruvdragarn.duckdns.org:1337/status

## Example product
```javascript
[{"ProductId":"508323","ProductNumber":"156812","ProductNameBold":"Sju komma tvåan","ProductNameThin":null,"Category":"beer","ProductNumberShort":"1568","ProducerName":"Åbro Bryggeri","SupplierName":"Åbro Bryggeri","IsKosher":false,"BottleTextShort":"Burk","Seal":null,"RestrictedParcelQuantity":0,"IsOrganic":false,"IsEthical":false,"EthicalLabel":null,"IsWebLaunch":false,"SellStartDate":"2011-10-19T00:00:00","IsCompletelyOutOfStock":false,"IsTemporaryOutOfStock":false,"AlcoholPercentage":7.2,"Volume":500,"Price":13.9,"Country":"Sverige","OriginLevel1":"Kalmar län","OriginLevel2":"Vimmerby kommun","Vintage":0,"SubCategory":"Öl","Type":"Ljus lager","Style":"Starkare lager","AssortmentText":"Ordinarie sortiment","BeverageDescriptionShort":"Öl, Ljus lager, Starkare lager","Usage":"Serveras vid cirka 8°C till husmanskost.","Taste":"Maltig smak med sötma, inslag av honung, apelsin och ljust bröd.","Assortment":"FS","RecycleFee":1,"IsManufacturingCountry":true,"IsRegionalRestricted":false,"IsInStoreSearchAssortment":null,"IsNews":false,"URL":"https://www.systembolaget.se/dryck/ol/sju-komma-tvaan-156812","APK":2.589928057553957,"APKWithPant":2.416107382550336,"APKScore":71}]
```
## Example store
```javascript
[{"ProductId":"508323","ProductNumber":"156812","ProductNameBold":"Sju komma tvåan","ProductNameThin":null,"Category":"beer","ProductNumberShort":"1568","ProducerName":"Åbro Bryggeri","SupplierName":"Åbro Bryggeri","IsKosher":false,"BottleTextShort":"Burk","Seal":null,"RestrictedParcelQuantity":0,"IsOrganic":false,"IsEthical":false,"EthicalLabel":null,"IsWebLaunch":false,"SellStartDate":"2011-10-19T00:00:00","IsCompletelyOutOfStock":false,"IsTemporaryOutOfStock":false,"AlcoholPercentage":7.2,"Volume":500,"Price":13.9,"Country":"Sverige","OriginLevel1":"Kalmar län","OriginLevel2":"Vimmerby kommun","Vintage":0,"SubCategory":"Öl","Type":"Ljus lager","Style":"Starkare lager","AssortmentText":"Ordinarie sortiment","BeverageDescriptionShort":"Öl, Ljus lager, Starkare lager","Usage":"Serveras vid cirka 8°C till husmanskost.","Taste":"Maltig smak med sötma, inslag av honung, apelsin och ljust bröd.","Assortment":"FS","RecycleFee":1,"IsManufacturingCountry":true,"IsRegionalRestricted":false,"IsInStoreSearchAssortment":null,"IsNews":false,"URL":"https://www.systembolaget.se/dryck/ol/sju-komma-tvaan-156812","APK":2.589928057553957,"APKWithPant":2.416107382550336,"APKScore":71}]
```