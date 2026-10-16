require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const booksRouter = require('./routes/books');

const app = express();
app.use(express.json());
app.use('/app', express.static('public'));

app.get('/', (req, res) => res.send('Сервер работает!'));
app.use('/books', booksRouter);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Подключение к PostgreSQL успешно');
    await sequelize.sync();
    app.listen(PORT, () => console.log('Сервер запущен на порту ' + PORT));
  } catch (e) {
    console.error('Ошибка подключения к БД:', e.message);
  }
}

start();