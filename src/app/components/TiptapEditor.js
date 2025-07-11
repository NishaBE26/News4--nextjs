'use client';

import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import '../Styles/TiptapEditor.css';
import {
  FaAlignRight, FaAlignLeft, FaAlignJustify, FaAlignCenter,
  FaListUl, FaListOl, FaBold, FaItalic, FaQuoteLeft
} from "react-icons/fa";
import { IoIosLink, IoMdArrowDropdown } from "react-icons/io";

export default function TiptapEditor({ content, onChange }) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState('Paragraph');
  const [showDropdown, setShowDropdown] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        blockquote: true,
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
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      onChange && onChange(editor.getHTML());
    }
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!editor) return;

      const key = event.key.toLowerCase();

      // BOLD (Ctrl + B)
      if (event.ctrlKey && key === 'b') {
        editor.chain().focus().toggleBold().run();
        event.preventDefault();
        return;
      }

      // ITALIC (Ctrl + I)
      if (event.ctrlKey && key === 'i') {
        editor.chain().focus().toggleItalic().run();
        event.preventDefault();
        return;
      }

      // BULLET LIST (Shift + Alt + U)
      if (event.altKey && event.shiftKey && key === 'u') {
        editor.chain().focus().toggleBulletList().run();
        event.preventDefault();
        return;
      }

      // ORDERED LIST (Shift + Alt + O)
      if (event.altKey && event.shiftKey && key === 'o') {
        editor.chain().focus().toggleOrderedList().run();
        event.preventDefault();
        return;
      }

      // ALIGNMENT SHORTCUTS
      if (event.altKey && event.shiftKey) {
        switch (key) {
          case 'l':
            editor.chain().focus().setTextAlign('left').run();
            event.preventDefault();
            break;
          case 'r':
            editor.chain().focus().setTextAlign('right').run();
            event.preventDefault();
            break;
          case 'c':
            editor.chain().focus().setTextAlign('center').run();
            event.preventDefault();
            break;
          case 'j':
            editor.chain().focus().setTextAlign('justify').run();
            event.preventDefault();
            break;
        }
      }

      // HEADINGS (Ctrl + 1 to 6), Paragraph (Ctrl + 7)
      if (event.ctrlKey) {
        switch (event.code) {
          case 'Digit1':
          case 'Digit2':
          case 'Digit3':
          case 'Digit4':
          case 'Digit5':
          case 'Digit6':
            editor.chain().focus().toggleHeading({ level: parseInt(event.code.replace('Digit', '')) }).run();
            event.preventDefault();
            break;
          case 'Digit7':
            editor.chain().focus().setParagraph().run();
            event.preventDefault();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor]);

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
    <div className='editor-box'>
      <div className="toolbar">
        <div className="format-dropdown-wrapper">
          <div className="format-dropdown-toggle" onClick={() => setShowDropdown(!showDropdown)}>
            <span>{selectedFormat}</span>
            <IoMdArrowDropdown className="format-dropdown-icon" />
          </div>

          {showDropdown && (
            <div className="format-dropdown-menu">
              <div className="format-dropdown-item" onClick={() => {
                editor.chain().focus().setParagraph().run();
                setSelectedFormat('Paragraph');
                setShowDropdown(false);
              }}>
                <span className="format-option-text" style={{ fontSize: '16px', fontWeight: 400 }}>Paragraph</span>
                <span className="format-shortcut">Ctrl+7</span>
              </div>

              <div className="format-dropdown-item" onClick={() => {
                editor.chain().focus().toggleHeading({ level: 1 }).run();
                setSelectedFormat('Heading 1');
                setShowDropdown(false);
              }}>
                <span className="format-option-text" style={{ fontSize: '32px', fontWeight: 700 }}>Heading 1</span>
                <span className="format-shortcut">Ctrl+1</span>
              </div>

              <div className="format-dropdown-item" onClick={() => {
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                setSelectedFormat('Heading 2');
                setShowDropdown(false);
              }}>
                <span className="format-option-text" style={{ fontSize: '24px', fontWeight: 700 }}>Heading 2</span>
                <span className="format-shortcut">Ctrl+2</span>
              </div>
              <div className="format-dropdown-item" onClick={() => {
                editor.chain().focus().toggleHeading({ level: 3 }).run();
                setSelectedFormat('Heading 3');
                setShowDropdown(false);
              }}>
                <span className="format-option-text" style={{ fontSize: '20.8px', fontWeight: 700 }}>Heading 3</span>
                <span className="format-shortcut">Ctrl+3</span>
              </div>
              <div className="format-dropdown-item" onClick={() => {
                editor.chain().focus().toggleHeading({ level: 4 }).run();
                setSelectedFormat('Heading 4');
                setShowDropdown(false);
              }}>
                <span className="format-option-text" style={{ fontSize: '16px', fontWeight: 700 }}>Heading 4</span>
                <span className="format-shortcut">Ctrl+4</span>
              </div>
              <div className="format-dropdown-item" onClick={() => {
                editor.chain().focus().toggleHeading({ level: 5 }).run();
                setSelectedFormat('Heading 5');
                setShowDropdown(false);
              }}>
                <span className="format-option-text" style={{ fontSize: '13.8px', fontWeight: 700 }}>Heading 5</span>
                <span className="format-shortcut">Ctrl+5</span>
              </div>
              <div className="format-dropdown-item" onClick={() => {
                editor.chain().focus().toggleHeading({ level: 6}).run();
                setSelectedFormat('Heading 6');
                setShowDropdown(false);
              }}>
                <span className="format-option-text" style={{ fontSize: '10.72px', fontWeight: 700 }}>Heading 6</span>
                <span className="format-shortcut">Ctrl+6</span>
              </div>
            </div>
          )}
        </div>

        <button onClick={() => editor.chain().focus().toggleBold().run()} data-tooltip='Bold (Ctrl+B)'><FaBold /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} data-tooltip='Italic (Ctrl+I)'><FaItalic /></button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} data-tooltip='Bulleted List (Shift+Alt+U)'><FaListUl /></button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} data-tooltip='Numbered List (Shift+Alt+O)'><FaListOl /></button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} data-tooltip='Blockquote'><FaQuoteLeft /></button>
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} data-tooltip='Align Left (Shift+Alt+L)'><FaAlignLeft /></button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} data-tooltip='Align Center (Shift+Alt+C)'><FaAlignCenter /></button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} data-tooltip='Align Right (Shift+Alt+R)'><FaAlignRight /></button>
        <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} data-tooltip='Align Justify (Shift+Alt+J)'><FaAlignJustify /></button>
        <button onClick={() => setShowLinkInput(true)} data-tooltip='Add Link'><IoIosLink style={{ strokeWidth: "5%", fontSize: "20px" }} /></button>
      </div>
      <div className='editor-content-area'>
        <EditorContent editor={editor} />
        <div />
        {showLinkInput && (
          <div className="link-input-box">
            <div className="link-input-inner">
              <input
                type="text"
                placeholder="Paste URL or type to search"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                data-tooltip="Enter URL for the link" // Changed to data-tooltip
              />
              <div className="link-actions">
                <button className="apply-link" onClick={handleSetLink} data-tooltip="Apply Link">
                  ↩
                </button>
                <button className="cancel-link" onClick={() => setShowLinkInput(false)} data-tooltip="Cancel Link">
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="editor-footer">
        <small>Word Count:{wordCount}</small>
      </div>
    </div>
  );
}