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
} as any).then(() => console.log('Mongo connected'));

const bookSchema = new mongoose.Schema({
  name: String,
  author: String,
  pages: Number
});

const Book = mongoose.model('Book', bookSchema);

app.post('/api/book', async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.status(201).json(book);
});

// Serve React build in production
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
