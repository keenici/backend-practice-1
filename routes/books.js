const router = require('express').Router();
const { Op } = require('sequelize');
const Book = require('../models/Book');

// Если id не число (например /books/abc) — сразу 400
router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'id должен быть числом' });
  }
  next();
});

// Проверка года: пусто — можно, иначе только целое число
function yearIsBad(year) {
  return year !== undefined && year !== null && year !== '' && !Number.isInteger(Number(year));
}

// GET /books — список (и поиск: /books?author=Абай)
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.author) {
      where.author = { [Op.iLike]: `%${req.query.author}%` };
    }
    const books = await Book.findAll({ where, order: [['id', 'ASC']] });
    res.json(books);
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /books/:id — одна книга
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Книга не найдена' });
    res.json(book);
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /books — добавить книгу
router.post('/', async (req, res) => {
  try {
    const { title, author, year } = req.body || {};
    if (!title || !author) {
      return res.status(400).json({ error: 'Поля title и author обязательны' });
    }
    if (yearIsBad(year)) {
      return res.status(400).json({ error: 'Поле year должно быть целым числом' });
    }
    const book = await Book.create({ title, author, year: year === '' ? null : year });
    res.status(201).json(book);
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PUT /books/:id — обновить книгу
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Книга не найдена' });

    const { title, author, year } = req.body || {};
    if (!title || !author) {
      return res.status(400).json({ error: 'Поля title и author обязательны' });
    }
    if (yearIsBad(year)) {
      return res.status(400).json({ error: 'Поле year должно быть целым числом' });
    }
    await book.update({ title, author, year: year === '' ? null : year });
    res.json(book);
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// DELETE /books/:id — удалить книгу
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Книга не найдена' });

    await book.destroy();
    res.json({ message: 'Книга удалена' });
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;