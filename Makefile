build:
    docker build -t tbot .
run:
    docker run -d -p 3000:3000 --name tbot --rm tbot
docker run -d --restart=always -p 3000:3000 --name tbot -e OPENAI_API_KEY="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"
 -e TELEGRAM_API_KEY="6053708681:AAFIsQ2oQhNPpgne1QphDN5hU_LOl-8mEuc" tbot
