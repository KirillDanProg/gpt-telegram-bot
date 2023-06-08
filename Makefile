build:
    docker build -t tbot .
run:
    docker run -d -p 3000:3000 --name tbot --rm tbot
docker run -d --restart=always -p 3000:3000 --name tbot tbot
