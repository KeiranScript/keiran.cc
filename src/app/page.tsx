import FileUpload from '@/components/file-upload'

export default function Home() {
  return (
    <div className="bg-background flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-foreground transition-transform duration-300 transform hover:scale-105">
        Upload Your Files
      </h1>
      <p className="text-lg md:text-xl text-center text-muted-foreground mb-8 max-w-2xl transition-opacity duration-300">
        Unlimited uploads for free, forever.
      </p>
      <div className="flex items-center justify-center w-full max-w-3xl py-8">
        <FileUpload />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'AnonHost',
  description: 'Upload your files anonymously. Free, forever.',
  openGraph: {
    type: 'website',
    url: 'https://keiran.cc',
    title: 'AnonHost',
    description: 'Upload your files anonymously. Free, forever.',
    images: [
      {
        url: 'https://keiran.cc/profile.gif', // Replace with your image URL
        alt: 'Gif',
      },
    ],
  },
};

