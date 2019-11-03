# Documentation APKappen_v2
All returned products is sorted by APK.

## BaseURL: http://skruvdragarn.duckdns.org
## PORT: 1337/1338

## Endpoint: /APKappen_v2/products
### Query options
Several query parameters can be used simultaneously.
#### Store (SiteId)
Get products in a certain store with SiteId. Example: http://skruvdragarn.duckdns.org:1337/APKappen_v2/products?store=2299
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
#### Get all stores
Example: http://skruvdragarn.duckdns.org:1337/APKappen_v2/stores
#### Get all stores sorted by distance (Require lat/long) 
Example: http://skruvdragarn.duckdns.org:1337/APKappen_v2/stores?lat=63.82&long=20.32
#### Get n nearest stores (Require lat/long)
Example: http://skruvdragarn.duckdns.org:1337/APKappen_v2/stores?lat=63.82&long=20.32&numberOfStores=3

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
[{"OpeningHours":[{"IsOpen":false,"Reason":"-","Date":"2019-11-03T00:00:00","OpenFrom":"00:00:00","OpenTo":"00:00:00"},{"IsOpen":true,"Reason":null,"Date":"2019-11-04T00:00:00","OpenFrom":"10:00:00","OpenTo":"18:00:00"},{"IsOpen":true,"Reason":null,"Date":"2019-11-05T00:00:00","OpenFrom":"10:00:00","OpenTo":"18:00:00"},{"IsOpen":true,"Reason":null,"Date":"2019-11-06T00:00:00","OpenFrom":"10:00:00","OpenTo":"18:00:00"},{"IsOpen":true,"Reason":null,"Date":"2019-11-07T00:00:00","OpenFrom":"10:00:00","OpenTo":"18:00:00"},{"IsOpen":true,"Reason":null,"Date":"2019-11-08T00:00:00","OpenFrom":"10:00:00","OpenTo":"19:00:00"},{"IsOpen":true,"Reason":null,"Date":"2019-11-09T00:00:00","OpenFrom":"10:00:00","OpenTo":"14:00:00"},{"IsOpen":false,"Reason":"-","Date":"2019-11-10T00:00:00","OpenFrom":"00:00:00","OpenTo":"00:00:00"},{"IsOpen":true,"Reason":null,"Date":"2019-11-11T00:00:00","OpenFrom":"10:00:00","OpenTo":"18:00:00"},{"IsOpen":true,"Reason":null,"Date":"2019-11-12T00:00:00","OpenFrom":"10:00:00","OpenTo":"18:00:00"},{"IsOpen":true,"Reason":null,"Date":"2019-11-13T00:00:00","OpenFrom":"10:00:00","OpenTo":"18:00:00"},{"IsOpen":true,"Reason":null,"Date":"2019-11-14T00:00:00","OpenFrom":"10:00:00","OpenTo":"18:00:00"},{"IsOpen":true,"Reason":null,"Date":"2019-11-15T00:00:00","OpenFrom":"10:00:00","OpenTo":"19:00:00"},{"IsOpen":true,"Reason":null,"Date":"2019-11-16T00:00:00","OpenFrom":"10:00:00","OpenTo":"14:00:00"},{"IsOpen":false,"Reason":"-","Date":"2019-11-17T00:00:00","OpenFrom":"00:00:00","OpenTo":"00:00:00"},{"IsOpen":true,"Reason":null,"Date":"2019-11-18T00:00:00","OpenFrom":"10:00:00","OpenTo":"18:00:00"}],"IsTastingStore":false,"SiteId":"2507","Alias":null,"Address":"Geologgatan 7 B","DisplayName":null,"PostalCode":"981 31","City":"Kiruna","County":"Norrbottens län","Country":null,"IsStore":true,"IsAgent":false,"IsActiveForAgentOrder":false,"Phone":"0980-108 58","Email":null,"Services":null,"Depot":null,"Name":"Geologgatan","Position":{"Long":20.227756,"Lat":67.854328}}]
```