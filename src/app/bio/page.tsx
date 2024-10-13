'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from 'next/navigation';
import { LastFmNowPlaying } from '@/components/lastfm';

const BioContent = () => {
  const searchParams = useSearchParams();
  const isGuraProfilePic = searchParams.get('linqfy-stop-asking-for-the-gura-pfp') !== null;
  const profilePic = isGuraProfilePic ? '/gura.gif' : '/profile.gif';

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "keiran.cc";
  const bioName = process.env.NEXT_PUBLIC_BIO_NAME || "Skid";
  const bioTechsDesc = process.env.NEXT_PUBLIC_BIO_TECHS_DESCRIPTION || "Some technologies I use to skid";
  const bioTechs = process.env.NEXT_PUBLIC_BIO_TECHS
    ? process.env.NEXT_PUBLIC_BIO_TECHS.split(',')
    : ["Skidding"];
  const bioDescription = process.env.NEXT_PUBLIC_BIO_DESCRIPTION || "Default bio description.";

  const techs = isGuraProfilePic
    ? [...bioTechs, "Linqfy's mom"]
    : bioTechs;

  const hasLastFmCredentials = process.env.NEXT_PUBLIC_LASTFM_API_KEY && process.env.NEXT_PUBLIC_LASTFM_USERNAME;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-foreground"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About {brandName}
      </motion.h1>
      <Card className="max-w-4xl mx-auto overflow-hidden shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <motion.div
              className="w-48 h-48 rounded-full overflow-hidden shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-110"
              initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src={profilePic}
                alt="Profile GIF"
                width={192}
                height={192}
                className="w-full h-full object-cover rounded-full shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-110"
              />
            </motion.div>
            <div className="flex-1">
              <motion.h2
                className="text-3xl font-semibold mb-4 tracking-wider"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05, rotate: -2 }}
              >
                <span className="glow">{bioName}</span>
              </motion.h2>
              <motion.p
                className="text-lg text-muted-foreground mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {bioTechsDesc}
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-2 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {techs.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  >
                    <Badge className="bg-primary text-primary-foreground">{tech}</Badge>
                  </motion.div>
                ))}
              </motion.div>
              <motion.p
                className="text-sm text-muted-foreground italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <span className="text-sm font-light leading-relaxed tracking-wide">{bioDescription}</span>
              </motion.p>
            </div>
          </div>
          {hasLastFmCredentials && <LastFmNowPlaying />}
        </CardContent>
      </Card>

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

const Bio = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BioContent />
    </Suspense>
  );
};

export default Bio;
