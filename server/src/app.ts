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
mongoose.connect('mongodb://localhost:27017/booksdb', {
  // These options help ensure the database and collection are created
})
  .then(async () => {
    console.log('Connected to MongoDB');
    // Ensure the books collection exists
    try {
      await mongoose.connection.db.createCollection('books');
      console.log('Books collection created/verified');
    } catch (error: any) {
      // Collection might already exist, that's ok
      console.log('Books collection already exists or error creating:', error.message);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Book schema
const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  pages: { type: Number, required: true }
});

const Book = mongoose.model('Book', bookSchema, 'books');

// API Routes

// Health check route to ensure collection exists
app.get('/api/health', async (req, res) => {
  try {
    await Book.findOne(); // This will create the collection if it doesn't exist
    res.json({ status: 'ok', message: 'Database and collection ready' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/book/', async (req, res) => {
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