import { Routes, Route, Navigate } from 'react-router-dom';
import PostList from './PostList';
import PostPage from './PostPage';
import About from './About';
import NoContent from '../view/NoContent';
import BackToTop from '../components/BackToTop';

function MainPage() {
  return (
    <main className="flex-1 pt-6 pb-3">
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/about" element={<About />} />
        <Route path="/post/:pathname" element={<PostPage />}></Route>
        <Route path="/404" element={<NoContent />}></Route>
        <Route path="*" element={<Navigate to="/404" replace />}></Route>
      </Routes>
      <BackToTop bottom={64} />
    </main>
  );
}

export default MainPage;
