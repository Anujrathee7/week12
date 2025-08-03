import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Book {
  _id: string;
  name: string;
  author: string;
  pages: number;
}

const BookDetail: React.FC = () => {
  const { bookName } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/book/${bookName}`);
        if (response.ok) {
          const bookData = await response.json();
          setBook(bookData);
        } else {
          setError('Book not found');
        }
      } catch (err) {
        setError('Failed to fetch book');
      } finally {
        setLoading(false);
      }
    };

    if (bookName) {
      fetchBook();
    }
  }, [bookName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div>
      <h1>{book.name}</h1>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Pages:</strong> {book.pages}</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default BookDetail;