'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageCard } from '@/components/image-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageData {
  id: number;
  src: string;
  alt: string;
  metadata?: {
    size: string;
    dimensions: string;
    type: string;
  };
}

interface GalleryTab {
  id: string;
  label: string;
}

const galleryTabs: GalleryTab[] = [
  { id: 'zoe', label: 'Zoe' },
  { id: 'mozart', label: 'Mozart' },
  { id: 'izzy', label: 'Izzy' },
];

const getImages = async (category: string): Promise<ImageData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  switch (category) {
    case 'zoe':
      return [
        {
          id: 1,
          src: '/zoe/image1.png',
          alt: 'Zoe Image 1',
          metadata: { size: '643 KB', dimensions: '979x540', type: 'PNG' },
        },
        {
          id: 2,
          src: '/zoe/image2.png',
          alt: 'Zoe Image 2',
          metadata: { size: '5.3 MB', dimensions: '2160x3840', type: 'PNG' },
        },
        {
          id: 3,
          src: '/zoe/image3.png',
          alt: 'Zoe Image 3',
          metadata: { size: '6.4 MB', dimensions: '2944x2208', type: 'PNG' },
        },
        {
          id: 4,
          src: '/zoe/image4.png',
          alt: 'Zoe Image 4',
          metadata: { size: '1.3 MB', dimensions: '1080x1916', type: 'PNG' },
        },
        {
          id: 5,
          src: '/zoe/image5.jpg',
          alt: 'Zoe Image 5',
          metadata: { size: '1 MB', dimensions: '3024x4032', type: 'JPEG' },
        },
        {
          id: 6,
          src: '/zoe/image6.jpg',
          alt: 'Zoe Image 6',
          metadata: { size: '484 KB', dimensions: '4000x3000', type: 'JPEG' },
        },
        {
          id: 7,
          src: '/zoe/image7.jpg',
          alt: 'Zoe Image 7',
          metadata: { size: '208 KB', dimensions: '3000x4000', type: 'JPEG' },
        },
        {
          id: 8,
          src: '/zoe/image8.jpg',
          alt: 'Zoe Image 8',
          metadata: { size: '482 KB', dimensions: '4000x3000', type: 'JPEG' },
        },
        {
          id: 9,
          src: '/zoe/image9.jpg',
          alt: 'Zoe Image 9',
          metadata: { size: '166 KB', dimensions: '4000x3000', type: 'JPEG' },
        },
        {
          id: 10,
          src: '/zoe/image10.jpg',
          alt: 'Zoe Image 10',
          metadata: { size: '40 KB', dimensions: '1000x750', type: 'JPEG' },
        },
        {
          id: 11,
          src: '/zoe/image11.jpg',
          alt: 'Zoe Image 11',
          metadata: { size: '288 KB', dimensions: '4000x3000', type: 'JPEG' },
        },
        {
          id: 12,
          src: '/zoe/image12.jpg',
          alt: 'Zoe Image 12',
          metadata: { size: '23.6 KB', dimensions: '1079x823', type: 'JPEG' },
        },
        {
          id: 13,
          src: '/zoe/image13.jpg',
          alt: 'Zoe Image 13',
          metadata: { size: '493 KB', dimensions: '2944x2208', type: 'JPEG' },
        },
        {
          id: 14,
          src: '/zoe/image14.jpg',
          alt: 'Zoe Image 14',
          metadata: { size: '24 KB', dimensions: '720x960', type: 'JPEG' },
        },
        {
          id: 15,
          src: '/zoe/image15.jpg',
          alt: 'Zoe Image 15',
          metadata: { size: '39 KB', dimensions: '900x900', type: 'JPEG' },
        },
      ];
    case 'mozart':
      return [
        {
          id: 1,
          src: '/mozart/image1.jpg',
          alt: 'Mozart Image 1',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 2,
          src: '/mozart/image2.jpg',
          alt: 'Mozart Image 2',
          metadata: { size: '200 KB', dimensions: '1811x2415', type: 'JPEG' },
        },
        {
          id: 3,
          src: '/mozart/image3.jpg',
          alt: 'Mozart Image 3',
          metadata: { size: '3.3 MB', dimensions: '3024x4032', type: 'JPEG' },
        },
        {
          id: 4,
          src: '/mozart/image4.jpg',
          alt: 'Mozart Image 4',
          metadata: { size: '822 KB', dimensions: '4032x3024', type: 'JPEG' },
        },
        {
          id: 5,
          src: '/mozart/image5.png',
          alt: 'Mozart Image 5',
          metadata: { size: '493 KB', dimensions: '704x782', type: 'PNG' },
        },
        {
          id: 6,
          src: '/mozart/image6.png',
          alt: 'Mozart Image 6',
          metadata: { size: '281 KB', dimensions: '581x671', type: 'PNG' },
        },
        {
          id: 7,
          src: '/mozart/image7.jpg',
          alt: 'Mozart Image 7',
          metadata: { size: '3.1 MB', dimensions: '3024x4032', type: 'JPEG' },
        },
        {
          id: 8,
          src: '/mozart/image8.jpg',
          alt: 'Mozart Image 8',
          metadata: { size: '214 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 9,
          src: '/mozart/image9.jpg',
          alt: 'Mozart Image 9',
          metadata: { size: '3.6 MB', dimensions: '3024x4032', type: 'JPEG' },
        },
        {
          id: 10,
          src: '/mozart/image10.jpg',
          alt: 'Mozart Image 10',
          metadata: { size: '2.8 MB', dimensions: '3024x4032', type: 'JPEG' },
        },
        {
          id: 11,
          src: '/mozart/image11.jpg',
          alt: 'Mozart Image 11',
          metadata: { size: '3.1 MB', dimensions: '3024x4032', type: 'JPEG' },
        },
        {
          id: 12,
          src: '/mozart/image12.jpg',
          alt: 'Mozart Image 12',
          metadata: { size: '2.1 MB', dimensions: '2448x3264', type: 'JPEG' },
        },
        {
          id: 13,
          src: '/mozart/image13.jpg',
          alt: 'Mozart Image 13',
          metadata: { size: '1.6 MB', dimensions: '2448x2448', type: 'JPEG' },
        },
        {
          id: 14,
          src: '/mozart/image14.jpg',
          alt: 'Mozart Image 14',
          metadata: { size: '2.9 MB', dimensions: '2448x3264', type: 'JPEG' },
        },
        {
          id: 15,
          src: '/mozart/image15.jpg',
          alt: 'Mozart Image 15',
          metadata: { size: '3.1 MB', dimensions: '3024x4032', type: 'JPEG' },
        },
        {
          id: 16,
          src: '/mozart/image16.jpg',
          alt: 'Mozart Image 16',
          metadata: { size: '37 KB', dimensions: '720x540', type: 'JPEG' },
        },
      ];
    case 'izzy':
      return [
        {
          id: 1,
          src: '/izzy/image1.jpg',
          alt: 'Izzy Image 1',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 2,
          src: '/izzy/image2.jpg',
          alt: 'Izzy Image 2',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 3,
          src: '/izzy/image3.jpg',
          alt: 'Izzy Image 3',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 4,
          src: '/izzy/image4.jpg',
          alt: 'Izzy Image 4',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 5,
          src: '/izzy/image5.jpg',
          alt: 'Izzy Image 5',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 6,
          src: '/izzy/image6.jpg',
          alt: 'Izzy Image 6',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 7,
          src: '/izzy/image7.jpg',
          alt: 'Izzy Image 7',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 8,
          src: '/izzy/image8.jpg',
          alt: 'Izzy Image 8',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 9,
          src: '/izzy/image9.jpg',
          alt: 'Izzy Image 9',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 10,
          src: '/izzy/image10.jpg',
          alt: 'Izzy Image 10',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 11,
          src: '/izzy/image11.jpg',
          alt: 'Izzy Image 11',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 12,
          src: '/izzy/image12.jpg',
          alt: 'Izzy Image 12',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 13,
          src: '/izzy/image13.jpg',
          alt: 'Izzy Image 13',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 14,
          src: '/izzy/image14.jpg',
          alt: 'Izzy Image 14',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 15,
          src: '/izzy/image15.jpg',
          alt: 'Izzy Image 15',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 16,
          src: '/izzy/image16.jpg',
          alt: 'Izzy Image 16',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 17,
          src: '/izzy/image17.jpg',
          alt: 'Izzy Image 17',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 18,
          src: '/izzy/image18.jpg',
          alt: 'Izzy Image 18',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 19,
          src: '/izzy/image19.jpg',
          alt: 'Izzy Image 19',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 20,
          src: '/izzy/image20.jpg',
          alt: 'Izzy Image 20',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 21,
          src: '/izzy/image21.jpg',
          alt: 'Izzy Image 21',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 22,
          src: '/izzy/image22.jpg',
          alt: 'Izzy Image 22',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 23,
          src: '/izzy/image23.jpg',
          alt: 'Izzy Image 23',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 24,
          src: '/izzy/image24.jpg',
          alt: 'Izzy Image 24',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 25,
          src: '/izzy/image25.jpg',
          alt: 'Izzy Image 25',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 26,
          src: '/izzy/image26.jpg',
          alt: 'Izzy Image 26',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 27,
          src: '/izzy/image27.jpg',
          alt: 'Izzy Image 27',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
        {
          id: 28,
          src: '/izzy/image28.jpg',
          alt: 'Izzy Image 28',
          metadata: { size: '167 KB', dimensions: '1008x1792', type: 'JPEG' },
        },
      ];
    default:
      return [];
  }
};

const GalleryContent = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(galleryTabs[0].id);
  const [page, setPage] = useState(1);
  const imagesPerPage = 12;

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      const imageData = await getImages(activeTab);
      setImages(imageData);
      setIsLoading(false);
      setPage(1);
    };
    loadImages();
  }, [activeTab]);

  const paginatedImages = images.slice(0, page * imagesPerPage);

  return (
    <Card className="container mx-auto px-4 py-8 overflow-y-auto">
      <CardContent>
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-foreground"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Image Gallery
        </motion.h1>
        <Tabs
          defaultValue={galleryTabs[0].id}
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="flex justify-center mb-8 bg-transparent">
            {galleryTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="px-6 py-3 text-center font-medium transition-all duration-200 rounded-full"
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: activeTab === tab.id ? 1.05 : 1,
                    color:
                      activeTab === tab.id
                        ? 'var(--primary)'
                        : 'var(--muted-foreground)',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {tab.label}
                </motion.div>
              </TabsTrigger>
            ))}
          </TabsList>

          {galleryTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab.id}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLoading
                    ? Array.from({ length: 8 }).map((_, index) => (
                        <Skeleton
                          key={index}
                          className="aspect-square rounded-lg"
                        />
                      ))
                    : paginatedImages.map((image) => (
                        <motion.div
                          key={image.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: image.id * 0.05 }}
                        >
                          <ImageCard
                            image={{ ...image, id: image.id.toString() }}
                          />
                        </motion.div>
                      ))}
                </motion.div>
              </AnimatePresence>
              {!isLoading && paginatedImages.length < images.length && (
                <motion.div
                  className="mt-8 flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    onClick={() => setPage((prev) => prev + 1)}
                    variant="outline"
                    className="px-6 py-2 rounded-full"
                  >
                    Load More
                  </Button>
                </motion.div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

const Gallery = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-2xl font-semibold text-primary flex items-center"
          >
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Loading Gallery...
          </motion.div>
        </div>
      }
    >
      <GalleryContent />
    </Suspense>
  );
};

export default Gallery;
