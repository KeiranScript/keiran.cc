'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Link, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const getImages = async (): Promise<ImageData[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return [
    { id: 1, src: '/zoe/image1.png', alt: 'Zoe Image 1', metadata: { size: '643 KB', dimensions: '979x540', type: 'PNG' } },
    { id: 2, src: '/zoe/image2.png', alt: 'Zoe Image 2', metadata: { size: '5.3 MB', dimensions: '2160x3840', type: 'PNG' } },
    { id: 3, src: '/zoe/image3.png', alt: 'Zoe Image 3', metadata: { size: '6.4 MB', dimensions: '2944x2208', type: 'PNG' } },
    { id: 4, src: '/zoe/image4.png', alt: 'Zoe Image 4', metadata: { size: '1.3 MB', dimensions: '1080x1916', type: 'PNG' } },
    { id: 5, src: '/zoe/image5.jpg', alt: 'Zoe Image 5', metadata: { size: '1 MB', dimensions: '3024x4032', type: 'JPEG' } },
    { id: 6, src: '/zoe/image6.jpg', alt: 'Zoe Image 6', metadata: { size: '484 KB', dimensions: '4000x3000', type: 'JPEG' } },
    { id: 7, src: '/zoe/image7.jpg', alt: 'Zoe Image 7', metadata: { size: '208 KB', dimensions: '3000x4000', type: 'JPEG' } },
    { id: 8, src: '/zoe/image8.jpg', alt: 'Zoe Image 8', metadata: { size: '482 KB', dimensions: '4000x3000', type: 'JPEG' } },
    { id: 9, src: '/zoe/image9.jpg', alt: 'Zoe Image 9', metadata: { size: '166 KB', dimensions: '4000x3000', type: 'JPEG' } },
    { id: 10, src: '/zoe/image10.jpg', alt: 'Zoe Image 10', metadata: { size: '40 KB', dimensions: '1000x750', type: 'JPEG' } },
    { id: 11, src: '/zoe/image11.jpg', alt: 'Zoe Image 11', metadata: { size: '288 KB', dimensions: '4000x3000', type: 'JPEG' } },
  ];
};

const ImageCard = ({ image }: { image: ImageData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `zoe-image-${image.id}.${image.metadata?.type.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Image Saved",
      description: `${image.alt} has been saved to your device.`,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}${image.src}`);
    toast({
      title: "Link Copied",
      description: "Image link has been copied to your clipboard.",
    });
  };

  return (
    <>
      <Card className="overflow-hidden shadow-lg cursor-pointer" onClick={() => setIsDialogOpen(true)}>
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{image.alt}</DialogTitle>
            <DialogDescription>Image details and actions</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <Image src={image.src} alt={image.alt} width={400} height={400} objectFit="contain" />
            <div className="flex justify-between">
              <Button onClick={handleSave}><Download className="mr-2 h-4 w-4" /> Save</Button>
              <Button onClick={handleCopyLink}><Link className="mr-2 h-4 w-4" /> Copy Link</Button>
              <Button onClick={() => toast({ title: "Metadata", description: `Size: ${image.metadata?.size}, Dimensions: ${image.metadata?.dimensions}, Type: ${image.metadata?.type}` })}>
                <Info className="mr-2 h-4 w-4" /> View Metadata
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const GalleryContent = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      const imageData = await getImages();
      setImages(imageData);
      setIsLoading(false);
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
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-lg" />
            ))
          : images.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: image.id * 0.1 }}
              >
                <ImageCard image={image} />
              </motion.div>
            ))}
      </motion.div>
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