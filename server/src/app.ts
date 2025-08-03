import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = 1234;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(express.json());

if (NODE_ENV === 'development') {
  app.use(cors({ origin: 'http://localhost:3000' }));
}

mongoose.connect('mongodb://localhost:27017/fullstack', {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as any).then(async () => {
  console.log('Mongo connected');

  // 🔧 Ensure 'books' collection exists by inserting + deleting a dummy
  const temp = new Book({ name: '__temp__', author: '__temp__', pages: 0 });
  await temp.save();
  await Book.deleteOne({ name: '__temp__' });
});

// Define schema and model
const bookSchema = new mongoose.Schema({
  name: String,
  author: String,
  pages: Number
});

// ✅ Explicit collection name: 'books'
const Book = mongoose.model('Book', bookSchema, 'books');

// POST route
app.post('/api/book', async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.status(201).json(book);
});

// Optional GET route for tests
app.get('/api/books', async (req, res) => {
  const books = await Book.find({});
  res.json(books);
});

// Production setup
if (NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
