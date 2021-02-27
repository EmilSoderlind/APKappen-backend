# To start dev-able backend

```console
foo@bar:~$ git clone https://github.com/EmilSoderlind/APKappen-backend
foo@bar:~$ cd APKappen-backend/experiment/
foo@bar:~$ npm ci
foo@bar:~$ node sb_api_parser.js
foo@bar:~$ node api_endpoints.js 
```


# API endpoints

base: https://api-extern.systembolaget.se/sb-api-ecommerce/v1/

## search stores: 
sitesearch/store?q=<xxx>

ex: sitesearch/store?q=ersboda
ex: sitesearch/store?q=2


## information about a product in a store:
ProductId=<xxx>&StoreId=<xxx>

ex: ProductId=24529131&StoreId=2416

