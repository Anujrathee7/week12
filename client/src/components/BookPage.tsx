import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Book {
  _id: string;
  name: string;
  author: string;
  pages: number;
}

const BookPage: React.FC = () => {
  const { bookName } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookName) return;
      
      try {
        const response = await fetch(`/api/book/${encodeURIComponent(bookName)}`);
        
        if (response.ok) {
          const bookData = await response.json();
          setBook(bookData);
        } else if (response.status === 404) {
          setError('Book not found');
        } else {
          setError('Failed to fetch book');
        }
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Error fetching book');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookName]);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Book not found</h2>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        ← Back to Home
      </Link>
      
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>{book.name}</h1>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Author:</strong> {book.author}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Pages:</strong> {book.pages}
        </div>
        
        <div style={{ marginTop: '20px', fontSize: '0.9em', color: '#666' }}>
          Book ID: {book._id}
        </div>
      </div>
    </div>
  );
};

export default BookPage;