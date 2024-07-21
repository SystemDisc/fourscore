import { useEffect, useState } from 'react';

export default function usePageTitle() {
  const [title, setTitle] = useState('');

  useEffect(() => {
    const handleTitleChange = () => {
      setTitle(document.title);
    };
    handleTitleChange();

    const observer = new MutationObserver(() => {
      handleTitleChange();
    });
    observer.observe(document.querySelector('title')!, { childList: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return title;
}
