import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 1234;

// Middleware
app.use(express.json());

// CORS setup for development
if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: 'http://localhost:3000'
  }));
}

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/booksdb')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Book schema
const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  pages: { type: Number, required: true }
});

const Book = mongoose.model('Book', bookSchema);

// API Routes
app.post('/api/book', async (req, res) => {
  try {
    const { name, author, pages } = req.body;
    
    const book = new Book({
      name,
      author,
      pages: Number(pages)
    });
    
    await book.save();
    res.status(201).json({ message: 'Book saved successfully', book });
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({ error: 'Failed to save book' });
  }
});

app.get('/api/book/:name', async (req, res) => {
  try {
    const bookName = decodeURIComponent(req.params.name);
    const book = await Book.findOne({ name: bookName });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Production: Serve React static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});