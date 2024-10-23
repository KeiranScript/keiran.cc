'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Link, Loader2, Copy, Settings, Download } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL' }),
  customAlias: z
    .string()
    .regex(/^[a-zA-Z0-9-_]*$/, {
      message:
        'Custom alias can only contain letters, numbers, hyphens, and underscores',
    })
    .max(12)
    .optional(),
  expirationTime: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: 'Invalid datetime format' },
    )
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

const DOMAINS = ['keiran.cc', 'e-z.software', 'keiran.live', 'keiran.tech'];

export default function ShortenPage() {
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(DOMAINS[0]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, domain: selectedDomain }),
      });

      const result = await response.json();

      if (response.ok) {
        setShortenedUrl(result.shortUrl);
        toast.success('URL shortened successfully');
      } else {
        toast.error('Failed to shorten URL');
      }
    } catch (error) {
      toast.error('An error occurred while shortening URL');
    } finally {
      setIsLoading(false);
    }
  };

  const generateShareXConfig = () => {
    const config = {
      Name: 'AnonHost URL Shortener',
      DestinationType: 'URLShortener',
      RequestMethod: 'POST',
      RequestURL: `https://${selectedDomain}/api/shorten`,
      Body: 'JSON',
      Data: '{"url":"$input$"}',
      URL: '$json:shortUrl$',
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AnonHost-URLShortener.sxcu';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Shorten Your URL
            </CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Configure your URL shortener settings
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="domain">Domain</Label>
                      <Select
                        onValueChange={setSelectedDomain}
                        defaultValue={selectedDomain}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOMAINS.map((domain) => (
                            <SelectItem key={domain} value={domain}>
                              {domain}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={generateShareXConfig}>
                    <Download className="mr-2 h-4 w-4" />
                    Generate ShareX Config
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="url">URL to Shorten</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  {...register('url')}
                />
                {errors.url && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.url.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="customAlias">Custom Alias (Optional)</Label>
                <Input
                  id="customAlias"
                  type="text"
                  placeholder="my-custom-url"
                  {...register('customAlias')}
                />
                {errors.customAlias && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.customAlias.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="expirationTime">
                  Expiration Time (Optional)
                </Label>
                <Input
                  id="expirationTime"
                  type="datetime-local"
                  {...register('expirationTime')}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Default: 24 hours, Max: 30 days
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Shortening...
                  </>
                ) : (
                  <>
                    <Link className="mr-2 h-4 w-4" />
                    Shorten URL
                  </>
                )}
              </Button>
            </form>
            {shortenedUrl && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Label htmlFor="shortenedUrl">Shortened URL</Label>
                <div className="flex mt-1">
                  <Input
                    id="shortenedUrl"
                    type="text"
                    value={shortenedUrl}
                    readOnly
                    className="flex-grow"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="ml-2"
                          onClick={() => {
                            navigator.clipboard.writeText(shortenedUrl);
                            toast.success('Copied to clipboard!');
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
