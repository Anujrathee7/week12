import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookForm: React.FC = () => {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/book/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          author,
          pages: parseInt(pages),
        }),
      });

      if (response.ok) {
        navigate(`/book/${encodeURIComponent(name)}`);
      } else {
        alert('Failed to create book');
      }
    } catch (error) {
      alert('Error creating book');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          id="name"
          type="text"
          placeholder="Book Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          id="author"
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          id="pages"
          type="number"
          placeholder="Pages"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          required
        />
      </div>
      <div>
        <input id="submit" type="submit" value="Submit Book" />
      </div>
    </form>
  );
};

export default BookForm;