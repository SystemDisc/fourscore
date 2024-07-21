import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

export const renderMarkdown = async (content: string) => {
  const renderer = new marked.Renderer();
  renderer.link = ({ href, title, text }) => {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" title="${title || ''}">${text}</a>`;
  };

  const html = await marked(content, {
    renderer,
  });

  return DOMPurify.sanitize(html, { ADD_ATTR: ['target'] });
};
