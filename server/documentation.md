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
#### Size of each category
http://skruvdragarn.duckdns.org:1337/categories

## Categories
1. röda_viner
2. cider_och_blanddrycker
3. vita_viner
4. sprit
5. mousserande_viner
6. öl
7. roséviner
8. presentartiklar
9. aperitif_dessert
10. alkoholfritt
11. viner
12. röda_viner_sa
13. cider_och_blanddrycker_sa
14. vita_viner_sa
15. sprit_sa
16. mousserande_viner_sa
17. öl_sa
18. roséviner_sa
19. presentartiklar_sa
20. aperitif_dessert_sa
21. alkoholfritt_sa
22. viner_sa
23. all
24. all_sa

## Example
```javascript
[{"ProductId":"16317","ProductNumber":"8119206","ProductNameBold":"Jever","ProductNameThin":"Fatöl","Category":"Öl","ProductNumberShort":"81192","ProducerName":"Friesisches Brauhaus","SupplierName":"TOMP Beer Wine & Spirits AB","IsKosher":false,"BottleTextShort":"Fat","Seal":null,"RestrictedParcelQuantity":0,"IsOrganic":false,"IsEthical":false,"EthicalLabel":null,"IsWebLaunch":false,"SellStartDate":"1998-09-01T00:00:00","IsCompletelyOutOfStock":false,"IsTemporaryOutOfStock":false,"AlcoholPercentage":4.9,"Volume":30000,"Price":397.9,"Country":"Tyskland","OriginLevel1":null,"OriginLevel2":null,"Vintage":0,"SubCategory":"Öl","Type":"Ljus lager","Style":"Pilsner - tysk stil","AssortmentText":"Övrigt sortiment","BeverageDescriptionShort":"Öl, Ljus lager, Pilsner - tysk stil","Usage":null,"Taste":null,"Assortment":"BS","RecycleFee":625,"IsManufacturingCountry":true,"IsRegionalRestricted":false,"IsInStoreSearchAssortment":null,"IsNews":false,"URL":"https://www.systembolaget.se/dryck/ol/jever-8119206","APK":3.694395576778085,"APKWithPant":1.437090624694496,"APKScore":100}]
```
