import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { useState } from 'react';

function MainForm() {
  const [book, setBook] = useState({ name: '', author: '', pages: 0 });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book)
    });
    setBook({ name: '', author: '', pages: 0 });
  };

  return (
    <form onSubmit={submit}>
      <input id="name" type="text" value={book.name} onChange={e => setBook({ ...book, name: e.target.value })} />
      <input id="author" type="text" value={book.author} onChange={e => setBook({ ...book, author: e.target.value })} />
      <input id="pages" type="number" value={book.pages} onChange={e => setBook({ ...book, pages: Number(e.target.value) })} />
      <input id="submit" type="submit" />
    </form>
  );
}

function BookPage() {
  const { bookName } = useParams();
  return <div><h1>Book: {bookName}</h1></div>;
}

function NotFound() {
  return <div>404 - this is not the webpage you are looking for</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainForm />} />
        <Route path="/book/:bookName" element={<BookPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
