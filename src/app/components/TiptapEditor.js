'use client';

import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import '../Styles/TiptapEditor.css';

export default function TiptapEditor({ content, onChange }) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  const handleSetLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  if (!editor) return null;

  return (
    <div>
      <div className="toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
        <button onClick={() => editor.chain().focus().setParagraph().run()}>P</button>
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <button key={level} onClick={() => editor.chain().focus().toggleHeading({ level }).run()}>
            H{level}
          </button>
        ))}
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()}>Left</button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()}>Center</button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()}>Right</button>
        <button onClick={() => editor.chain().focus().setTextAlign('justify').run()}>Justify</button>
        <button onClick={() => setShowLinkInput(true)}>Link</button>
        <button onClick={() => editor.chain().focus().unsetLink().run()}>Remove Link</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
      </div>

      {showLinkInput && (
        <div className="link-input-box">
          <input
            type="text"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
          <button onClick={handleSetLink}>Apply</button>
          <button onClick={() => setShowLinkInput(false)}>Cancel</button>
        </div>
      )}

      <div className="editor-box">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
