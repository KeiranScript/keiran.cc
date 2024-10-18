"use client";

import { useEffect, useState } from 'react';
import FileUpload from '@/components/file-upload';
import Updates from '@/components/updates';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import FileUrlDisplay from '@/components/file-url-display';
import { motion } from 'framer-motion';

export default function UploadPage() {
  const [animateClass, setAnimateClass] = useState('opacity-0 translate-y-10');
  const [paragraphClass, setParagraphClass] = useState('opacity-0 translate-y-10');
  const [updatesClass, setUpdatesClass] = useState('opacity-0 translate-y-10');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const setToast = (message: string, description: string) => {
    toast({ title: message, description });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateClass('opacity-100 translate-y-0 transition-transform duration-500');
    }, 100);

    const paragraphTimer = setTimeout(() => {
      setParagraphClass('opacity-100 translate-y-0 transition-transform duration-500');
    }, 600);

    const updatesTimer = setTimeout(() => {
      setUpdatesClass('opacity-100 translate-y-0 transition-transform duration-500');
    }, 1100);

    return () => {
      clearTimeout(timer);
      clearTimeout(paragraphTimer);
      clearTimeout(updatesTimer);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-4xl md:text-5xl font-extrabold mb-8 text-center text-foreground`}>
          Upload Your Files
        </h1>
        <p className={`text-lg md:text-xl text-center text-muted-foreground mb-8 max-w-2xl mx-auto`}>
          Unlimited uploads for free, forever.
        </p>
        <div className={`flex items-center justify-center w-full max-w-3xl mx-auto`}>
          <FileUpload setToast={setToast} />
        </div>
        {uploadedFileUrl && (
          <div className="mt-6">
            <FileUrlDisplay url={uploadedFileUrl} />
          </div>
        )}
        <div className={`mt-12 max-w-3xl mx-auto`}>
          <Updates />
        </div>
      </div>
      <Toaster />
    </motion.div>
  );
}