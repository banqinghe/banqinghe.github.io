import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BackToTop from '@/components/BackToTop';
import PostList from '@/view/PostList';
import About from '@/view/About';
import NoContent from '@/view/NoContent';
import Note from '@/view/Note';
import Box from '@/view/Box';
import Essay from '@/view/Essay';

const PostPage = React.lazy(() => import('@/view/PostPage'));

function MainPage() {
  return (
    <main className="flex-1 flex flex-col pt-6 pb-3 relative">
      <Suspense
        fallback={
          <div className="flex-1 flex justify-center items-center animate-pulse">
            如果你的网络不太行，那你就能看到这句话。
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/page/:pageNumber" element={<PostList />} />
          <Route path="/about" element={<About />} />
          <Route path="/post/:pathname" element={<PostPage />} />
          <Route path="/essay">
            <Route index element={<Essay />} />
            <Route path=":pathname" element={<Essay />} />
          </Route>
          <Route path="/box" element={<Box />} />
          <Route path="/note" element={<Note />} />
          <Route path="/404" element={<NoContent />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
      <BackToTop bottom={64} />
    </main>
  );
}

export default MainPage;
