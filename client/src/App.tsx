import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookForm from './components/BookForm';
import BookDetail from './components/BookDetail';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <div>
              <h1>books</h1>
              <BookForm />
            </div>
          } />
          <Route path="/book/:bookName" element={<BookDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;