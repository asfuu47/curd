const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'items.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper: Read data from JSON file
const readData = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading data file:", err);
        return [];
    }
};

// Helper: Write data to JSON file
const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing to data file:", err);
    }
};

// --- Routes ---

// GET all items
app.get('/items', (req, res) => {
    const items = readData();
    res.json(items);
});

// POST create item
app.post('/items', (req, res) => {
    const items = readData();
    const newItem = {
        id: Date.now(), // Unique ID based on time
        name: req.body.name
    };
    items.push(newItem);
    writeData(items);
    res.json(newItem);
});

// PUT update item
app.put('/items/:id', (req, res) => {
    const items = readData();
    const item = items.find(i => String(i.id) === String(req.params.id));
    
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.name = req.body.name;
    writeData(items);
    res.json(item);
});

// DELETE item
app.delete('/items/:id', (req, res) => {
    let items = readData();
    const initialLength = items.length;
    
    // Filter out the item to delete
    items = items.filter(i => String(i.id) !== String(req.params.id));

    if (items.length === initialLength) {
        return res.status(404).json({ error: 'Item not found' });
    }

    writeData(items);
    res.json({ message: "Item deleted successfully" });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
