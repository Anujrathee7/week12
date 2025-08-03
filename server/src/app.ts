import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 1234;

// Middleware
app.use(express.json());

// API Routes setup
const router = express.Router();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/booksdb')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Book schema
const bookSchema = new mongoose.Schema({
  author: { type: String, required: true },
  name: { type: String, required: true },
  pages: { type: Number, required: true }
});

const Book = mongoose.model('Book', bookSchema);

// API Routes
router.post('/book/', async (req, res) => {
  try {
    const { author, name, pages } = req.body;
    const book = new Book({ author, name, pages });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(400).json({ error: 'Failed to create book' });
  }
});

router.get('/book/:name', async (req, res) => {
  try {
    const bookName = decodeURIComponent(req.params.name);
    const book = await Book.findOne({ name: bookName });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(400).json({ error: 'Failed to fetch book' });
  }
});

app.use('/api', router);

if (process.env.NODE_ENV === 'development') {
  const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
} else if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('../..', 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('../..', 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});