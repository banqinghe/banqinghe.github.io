import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import gfm from 'remark-gfm';
import remarkMath from 'remark-math';

const DemoText = `
不错

阿哲
我觉得还**可以**
\`\`\`javascript
console.log('Hello World');
\`\`\`
`;

interface NoteItem {
  title: string;
  date: string;
  tags: string[];
  content: string;
}

const tagCls = 'bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md ';

export default function Note() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    fetch('/note/note.md')
      .then(res => res.text())
      .then(text => {
        const notes = text.split('\n---\n\n');
        const noteStateList: NoteItem[] = [];
        const tagSet = new Set<string>();
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
              tags.forEach(tag => tagSet.add(tag));
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
        setTags(Array.from(tagSet));
      });
  }, []);

  return (
    <div className="relative">
      {/* TODO: tags filter */}
      {/* <aside className="absolute">
        {tags.map(tag => (
          <span className={tagCls}>{tag}</span>
        ))}
      </aside> */}
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
