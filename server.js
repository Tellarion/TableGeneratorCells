const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Получить конфигурацию
app.get('/api/config', (req, res) => {
  try {
    const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка чтения конфигурации' });
  }
});

// Обновить конфигурацию
app.post('/api/config', (req, res) => {
  try {
    fs.writeFileSync('config.json', JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сохранения конфигурации' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
  console.log(`📝 Откройте браузер и перейдите по адресу выше`);
});

