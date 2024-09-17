module.exports = {
    apps: [
        {
            name: 'checkdispensetwominutes',                // Имя приложения
            script: './check_dispense_2_minutes.js',            // Точка входа в ваше приложение
            env_production: {
                TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
                TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
                CLIENT_ID: process.env.CLIENT_ID,
                CLIENT_SECRET: process.env.CLIENT_SECRET,
                USER_NAME: process.env.USER_NAME,
                PASSWORD: process.env.PASSWORD
            }
        }
    ]
};