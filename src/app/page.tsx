"use client";

import { useEffect, useState } from 'react';
import FileUpload from '@/components/file-upload';

export default function Home() {
  const [animateClass, setAnimateClass] = useState('opacity-0 translate-y-10');
  const [paragraphClass, setParagraphClass] = useState('opacity-0 translate-y-10');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateClass('opacity-100 translate-y-0 transition-transform duration-500');
    }, 100);

    const paragraphTimer = setTimeout(() => {
      setParagraphClass('opacity-100 translate-y-0 transition-transform duration-500');
    }, 600);

    return () => {
      clearTimeout(timer);
      clearTimeout(paragraphTimer);
    };
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-4xl md:text-5xl font-extrabold mb-8 text-center text-foreground transition-all duration-300 ease-in-out transform hover:scale-105 ${animateClass}`}>
          Upload Your Files
        </h1>
        <p className={`text-lg md:text-xl text-center text-muted-foreground mb-8 max-w-2xl mx-auto transition-opacity duration-300 hover:opacity-80 ${paragraphClass}`}>
          Unlimited uploads for free, forever.
        </p>
        <div className={`flex items-center justify-center w-full max-w-3xl mx-auto transition-transform duration-300 ease-in-out transform hover:scale-102 ${animateClass}`}>
          <FileUpload />
        </div>
      </div>
    </>
  );
}
