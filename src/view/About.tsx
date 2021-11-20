import { useEffect } from 'react';
import Waline from '@waline/client';

function About() {
  useEffect(() => {
    document.title = '关于我';
    Waline({
      el: '#comments',
      serverURL: 'https://blog-api-ers1r7f2f-banqinghe.vercel.app/',
      path: 'about',
    });
  }, [])

  return (
    <div className="w-7/12 mx-auto">
      <article>
        <p className="mb-2">你好，我是一名华东师范大学的大四学生。</p>
        <p className="mb-4">Hello, I am an undergraduate student from East China Normal University.</p>
      </article>
      <div id="comments" />
    </div>
    
  )
}

export default About;
