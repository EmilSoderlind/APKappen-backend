# Documentation APKappen_v1
All returned products is sorted by APK.

## BaseURL: http://skruvdragarn.duckdns.org:1337

## Endpoint: /APKappen_v1
### Query options
Several query parameters can be used simultaneously.
#### Filter by category
Example: http://skruvdragarn.duckdns.org:1337/APKappen_v1?category=sprit
#### Pagination
You must provide both postsPerPage AND pageIndex do use pagination.
Example: http://skruvdragarn.duckdns.org:1337/APKappen_v1?postsPerPage=4&pageIndex=333
#### Search
Return products (ProductNameBold/ProductNameThin) that contains the given string.
Example: http://skruvdragarn.duckdns.org:1337/APKappen_v1?search="pripps%20blå"

### Other
#### This documentation page
http://skruvdragarn.duckdns.org:1337/
#### Last parse date
http://skruvdragarn.duckdns.org:1337/lastParse
#### Names + size of each category
http://skruvdragarn.duckdns.org:1337/categories

## Example
```javascript
[{"ProductId":"508323","ProductNumber":"156812","ProductNameBold":"Sju komma tvåan","ProductNameThin":null,"Category":"beer","ProductNumberShort":"1568","ProducerName":"Åbro Bryggeri","SupplierName":"Åbro Bryggeri","IsKosher":false,"BottleTextShort":"Burk","Seal":null,"RestrictedParcelQuantity":0,"IsOrganic":false,"IsEthical":false,"EthicalLabel":null,"IsWebLaunch":false,"SellStartDate":"2011-10-19T00:00:00","IsCompletelyOutOfStock":false,"IsTemporaryOutOfStock":false,"AlcoholPercentage":7.2,"Volume":500,"Price":13.9,"Country":"Sverige","OriginLevel1":"Kalmar län","OriginLevel2":"Vimmerby kommun","Vintage":0,"SubCategory":"Öl","Type":"Ljus lager","Style":"Starkare lager","AssortmentText":"Ordinarie sortiment","BeverageDescriptionShort":"Öl, Ljus lager, Starkare lager","Usage":"Serveras vid cirka 8°C till husmanskost.","Taste":"Maltig smak med sötma, inslag av honung, apelsin och ljust bröd.","Assortment":"FS","RecycleFee":1,"IsManufacturingCountry":true,"IsRegionalRestricted":false,"IsInStoreSearchAssortment":null,"IsNews":false,"URL":"https://www.systembolaget.se/dryck/ol/sju-komma-tvaan-156812","APK":2.589928057553957,"APKWithPant":2.416107382550336,"APKScore":71}]
```
