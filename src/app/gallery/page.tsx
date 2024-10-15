'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";

interface ImageData {
  id: number;
  src: string;
  alt: string;
}

const getImages = async (): Promise<ImageData[]> => {
  return [
    { id: 1, src: '/zoe/image1.png', alt: 'Zoe Image 1' },
    { id: 2, src: '/zoe/image2.png', alt: 'Zoe Image 2' },
    { id: 3, src: '/zoe/image3.png', alt: 'Zoe Image 3' },
    { id: 4, src: '/zoe/image4.png', alt: 'Zoe Image 4' },
    { id: 5, src: '/zoe/image5.jpg', alt: 'Zoe Image 5' },
    { id: 6, src: '/zoe/image6.jpg', alt: 'Zoe Image 6' },
    { id: 7, src: '/zoe/image7.jpg', alt: 'Zoe Image 7' },
    { id: 8, src: '/zoe/image8.jpg', alt: 'Zoe Image 8' },
    { id: 9, src: '/zoe/image9.jpg', alt: 'Zoe Image 9' },
    { id: 10, src: '/zoe/image10.jpg', alt: 'Zoe Image 10' },
    { id: 11, src: '/zoe/image11.jpg', alt: 'Zoe Image 11' },
  ];
};

const GalleryContent = () => {
  const [images, setImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const imageData = await getImages();
      setImages(imageData);
    };
    loadImages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-foreground"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Zoe Gallery
      </motion.h1>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 ease-in-out transform hover:scale-105"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <style jsx>{`
        .glow {
          position: relative;
          color: white;
          text-shadow: 
            0 0 10px rgba(255, 255, 255, 0.5), 
            0 0 20px rgba(255, 255, 255, 0.4), 
            0 0 30px rgba(255, 255, 255, 0.3);
          transition: text-shadow 0.3s ease;
        }

        .glow:hover {
          text-shadow: 
            0 0 15px rgba(255, 255, 255, 1), 
            0 0 25px rgba(255, 255, 255, 0.8), 
            0 0 35px rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

const Gallery = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GalleryContent />
    </Suspense>
  );
};

export default Gallery;