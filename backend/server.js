const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data store
let items = [];
let id = 1;

// Routes
// GET all items
app.get('/items', (req, res) => {
  res.json(items);
});

// GET single item
app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).send('Item not found');
  res.json(item);
});

// POST create item
app.post('/items', (req, res) => {
  const newItem = {
    id: id++,
    name: req.body.name
  };
  items.push(newItem);
  res.json(newItem);
});

/
// PUT update item
app.put('/items/:id', (req, res) => {
  const item = items.find(i => String(i.id) === String(req.params.id));
  if (!item) return res.status(404).send('Item not found');
  item.name = req.body.name;
  res.json(item);
});

// DELETE item
app.delete('/items/:id', (req, res) => {
  const index = items.findIndex(i => String(i.id) === String(req.params.id));
  if (index === -1) return res.status(404).send('Item not found');
  const deletedItem = items.splice(index, 1);
  res.json(deletedItem[0]);
});

// ... app.listen ...

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
