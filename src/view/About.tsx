import { useEffect } from 'react';

function About() {
  useEffect(() => {
    document.title = '关于我';
  }, [])

  return (
    <article className="w-8/12 mx-auto">
      <p className="mb-2">你好，我是一名华东师范大学的大四学生。</p>
      <p className="mb-4">Hello, I am an undergraduate student from East China Normal University.</p>
    </article>
  )
}

export default About;
