import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { Download, Link, Info } from 'lucide-react';

interface ImageData {
  id: string;
  src: string;
  alt: string;
  metadata?: {
    size: string;
    dimensions: string;
    type: string;
  };
}

export const ImageCard = ({ image }: { image: ImageData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `image-${image.id}.${image.metadata?.type.toLowerCase()}`;
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
      <Card className="shadow-lg cursor-pointer overflow-hidden" onClick={() => setIsDialogOpen(true)}>
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
        <DialogContent className="overflow-hidden max-h-[90vh] flex flex-col justify-center items-center">
          <div className="flex flex-col space-y-4 justify-center items-center w-full">
            <Image 
              src={image.src} 
              alt={image.alt} 
              width={400} 
              height={400} 
              className="max-w-full h-auto object-contain mx-auto" 
            />
            <div className="flex justify-between w-full max-w-sm">
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