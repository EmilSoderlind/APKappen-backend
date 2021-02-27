# APK-backend

## Systembolaget API-key
Note that you will need a API-key from https://api-portal.systembolaget.se to retrieve assortment data. The key must be written in the secret.js in the 'server/' directory.

## Running with Node.JS
```console
foo@bar:~$ node server/index.js 
```

## Docker image
### Building
```console
foo@bar:~$ docker build -t <name> .
```

#### Example
```console
docker build -t skruvdragarn/apk-v1 .
```

### Running
```console
docker run -p 1337:1337 --restart always -d <name>
```

#### Example
```console
docker run -p 1337:1337 --restart always -d skruvdragarn/apk-v1
```
