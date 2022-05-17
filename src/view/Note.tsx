import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import gfm from 'remark-gfm';
import remarkMath from 'remark-math';
import urls from '@/config/urls.json';

interface NoteItem {
  title: string;
  date: string;
  tags: string[];
  content: string;
}

const tagCls = 'bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md ';

// TODO: tags 侧边导航太丑，最好能有搜索的方式
export default function Note() {
  const [notes, setNotes] = useState<NoteItem[]>([]);

  useEffect(() => {
    fetch(urls['note'])
      .then(res => res.text())
      .then(text => {
        const notes = text.split('\n---\n\n');
        const noteStateList: NoteItem[] = [];
        for (const note of notes) {
          const noteState: NoteItem = {
            title: '',
            date: '',
            tags: [],
            content: '',
          };
          for (const line of note.split('\n')) {
            let match;
            if ((match = line.match(/^##\s+(.*)/))) {
              noteState.title = match[1];
            } else if ((match = line.match(/^TAG:\s+(.*)/))) {
              const tags = match[1].split(',');
              noteState.tags.push(...tags);
            } else if ((match = line.match(/^DATE:\s+(.*)/))) {
              noteState.date = match[1];
            } else {
              noteState.content += line + '\n';
            }
          }
          noteStateList.push(noteState);
        }
        setNotes(noteStateList);
      });
  }, []);

  return (
    <div className="relative">
      <article className="w-10/12 md:w-9/12 xl:w-6/12 mx-auto">
        <h1 className="mb-4 text-3xl font-bold">Notes</h1>
        <div>
          {notes.map((note, index) => (
            <div key={index} className="pt-4 py-6 border-b border-gray-100">
              <div className="mb-4 flex flex-col md:flex-row gap-2 md:gap-3">
                <h2 className="text-base font-bold">{note.title}</h2>
                <div className="flex-1 flex justify-between items-center text-xs">
                  <div className="space-x-1.5">
                    {note.tags.map((tag, index) => (
                      <span key={index} className={tagCls}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-400">{note.date}</span>
                </div>
              </div>
              <ReactMarkdown
                className="markdown-body"
                remarkPlugins={[gfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeRaw, rehypeHighlight]}
              >
                {note.content}
              </ReactMarkdown>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
