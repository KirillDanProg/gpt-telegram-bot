require('dotenv').config();

module.exports = {
    apps: [
        {
            name: 'gpt-tg-bot',
            script: './src/main.js',
            env: {
                NODE_ENV: 'production',
                TELEGRAM_API_KEY: '6053708681:AAFIsQ2oQhNPpgne1QphDN5hU_LOl-8mEuc',
                OPENAI_API_KEY: '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'
            },
        },
    ],
};
