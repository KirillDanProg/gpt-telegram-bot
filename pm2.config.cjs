require('dotenv').config();

module.exports = {
    apps: [
        {
            name: 'gpt-tg-bot',
            script: 'src/main.js',
            env: {
                NODE_ENV: 'production',
                TELEGRAM_API_KEY: process.env.TELEGRAM_API_KEY,
                OPENAI_API_KEY: process.env.OPENAI_API_KEY
            },
        },
    ],
};
