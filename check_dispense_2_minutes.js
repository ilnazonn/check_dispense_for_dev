import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';
import TelegramBot from 'node-telegram-bot-api';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const USER_NAME = process.env.USER_NAME;
const PASSWORD = process.env.PASSWORD;

// Создаем экземпляр телеграмм-бота
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

// Функция для получения токена авторизации
async function getAuthToken() {
    const response = await fetch(`${process.env.BASE_URL}/auth/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            grant_type: 'password',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            scope: 'teleport',
            username: USER_NAME,
            password: PASSWORD
        })
    });

    const data = await response.json();
    return data.access_token;
}

// Функция для отправки запроса к API и проверки статуса
async function sendRequest() {
    const token = await getAuthToken();

    const response = await fetch(`${process.env.BASE_URL}/v2/vending_machines/${process.env.VM_ID}/dispense`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            number: "106",
            cup: "0",
            sugar: "0",
            discount: "0"
        })
    });

    const data = await response.json();

    // Отправка уведомления в телеграмм, если статус не равен 200
    if (response.status !== 200) {
        const message = `*Запрос завершился ошибкой:* ${response.status}\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
        bot.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: 'Markdown' });
    }
}

// Функция для запуска периодического выполнения запроса
function startInterval() {
    setInterval(sendRequest, 2 * 60 * 1000);
}

// Запускаем интервал
startInterval();