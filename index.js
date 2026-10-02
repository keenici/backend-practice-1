const express = require('express');

const app = express();
const PORT = 3000;

// Позволяет серверу понимать JSON
app.use(express.json());

// Временный список книг
let books = [
    {
        id: 1,
        title: 'Война и мир',
        author: 'Лев Толстой'
    },
    {
        id: 2,
        title: 'Преступление и наказание',
        author: 'Фёдор Достоевский'
    }
];

// Главная страница
app.get('/', (req, res) => {
    res.send('Сервер работает!');
});

// 1. Получить все книги
app.get('/books', (req, res) => {
    res.status(200).json(books);
});

// 2. Получить одну книгу по ID
app.get('/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: 'Книга не найдена'
        });
    }

    res.status(200).json(book);
});

// 3. Добавить новую книгу
app.post('/books', (req, res) => {
    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({
            message: 'Поля title и author обязательны'
        });
    }

    const newBook = {
        id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
        title: title,
        author: author
    };

    books.push(newBook);

    res.status(201).json(newBook);
});

// 4. Изменить книгу
app.put('/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: 'Книга не найдена'
        });
    }

    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({
            message: 'Поля title и author обязательны'
        });
    }

    book.title = title;
    book.author = author;

    res.status(200).json(book);
});

// 5. Удалить книгу
app.delete('/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({
            message: 'Книга не найдена'
        });
    }

    const deletedBook = books.splice(bookIndex, 1);

    res.status(200).json({
        message: 'Книга удалена',
        book: deletedBook[0]
    });
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});