# APKappen-backend

docker build -t skruvdragarn/apk-v1 .
viola@viola:~/APKappen-backend/server$ docker run -p 1337:1337 -d skruvdragarn/apk-v1
3d65d35a1179d3a3daa21b3d104485b6612e127009443a9a3e465f15861dd5a5
viola@viola:~/APKappen-backend/server$ docker stop 3d
viola@viola:~/APKappen-backend/server$ docker run -p 1337:1337 --restart always -d skruvdragarn/apk-v1
