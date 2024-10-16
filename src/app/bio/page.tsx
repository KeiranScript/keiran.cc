'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from 'next/navigation';
import { LastFmNowPlaying } from '@/components/lastfm';
import { Loader2, Music, Clock } from 'lucide-react';

interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
  };
  discord_status: string;
  activities: Array<{
    name: string;
    type: number;
    state?: string;
    details?: string;
    timestamps?: {
      start?: number;
      end?: number;
    };
    assets?: {
      large_image?: string;
      large_text?: string;
    };
    application_id?: string; // Add this line
  }>;
  listening_to_spotify: boolean;
  spotify: {
    timestamps: {
      start: number;
      end: number;
    };
    album: string;
    album_art_url: string;
    artist: string;
    song: string;
  } | null;
}

const DiscordPresence = ({ userId }: { userId: string }) => {
  const [presenceData, setPresenceData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresence = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const data = await response.json();
        setPresenceData(data.data);
      } catch (error) {
        console.error('Error fetching Discord presence:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPresence();
    const interval = setInterval(fetchPresence, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
  }

  if (!presenceData) {
    return <p className="text-sm text-muted-foreground">Discord presence unavailable</p>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getElapsedTime = (start: number) => {
    const now = Date.now();
    const elapsed = now - start;
    const minutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
  };

  return (
    <Card className="mt-6 overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-2xl font-semibold mb-4">Discord Presence</h3>
        <div className="flex items-center space-x-4 mb-4">
          <Image
            src={`https://cdn.discordapp.com/avatars/${presenceData.discord_user.id}/${presenceData.discord_user.avatar}.png`}
            alt={presenceData.discord_user.username}
            width={64}
            height={64}
            className="rounded-full border-2 border-primary"
          />
          <div>
            <p className="font-medium text-lg">{presenceData.discord_user.username}</p>
            <div className="flex items-center mt-1">
              <span className={`w-3 h-3 rounded-full ${getStatusColor(presenceData.discord_status)} mr-2`}></span>
              <span className="text-sm capitalize">{presenceData.discord_status}</span>
            </div>
          </div>
        </div>

        {presenceData.listening_to_spotify && presenceData.spotify && (
          <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <Music className="h-5 w-5 mr-2 text-green-400" />
              <span className="font-medium text-green-400">Listening to Spotify</span>
            </div>
            <div className="flex items-center space-x-4">
              <Image
                src={presenceData.spotify.album_art_url}
                alt={presenceData.spotify.album}
                width={60}
                height={60}
                className="rounded-md"
              />
              <div>
                <p className="font-medium">{presenceData.spotify.song}</p>
                <p className="text-sm text-muted-foreground">{presenceData.spotify.artist}</p>
                <p className="text-xs text-muted-foreground">{presenceData.spotify.album}</p>
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatTime(presenceData.spotify.timestamps.start)} - {formatTime(presenceData.spotify.timestamps.end)}</span>
            </div>
          </div>
        )}

        {presenceData.activities.filter(activity => activity.type !== 2).map((activity, index) => (
          <div key={index} className="bg-primary bg-opacity-10 p-4 rounded-lg mb-2 last:mb-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{activity.name}</span>
              <Badge variant="outline">{getElapsedTime(activity.timestamps?.start || 0)} elapsed</Badge>
            </div>
            {activity.details && <p className="text-sm">{activity.details}</p>}
            {activity.state && <p className="text-sm text-muted-foreground">{activity.state}</p>}
            {activity.assets?.large_image && (
              <Image
                src={`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`}
                alt={activity.assets.large_text || activity.name}
                width={40}
                height={40}
                className="rounded-md mt-2"
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const BioContent = () => {
  const searchParams = useSearchParams();
  const isGuraProfilePic = searchParams.get('linqfy-stop-asking-for-the-gura-pfp') !== null;
  const profilePic = isGuraProfilePic ? '/gura.gif' : '/profile.gif';

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "skidderhost";
  const bioName = process.env.NEXT_PUBLIC_BIO_NAME || "Skid";
  const bioTechsDesc = process.env.NEXT_PUBLIC_BIO_TECHS_DESCRIPTION || "Some technologies I use to skid";
  const bioTechs = process.env.NEXT_PUBLIC_BIO_TECHS
    ? process.env.NEXT_PUBLIC_BIO_TECHS.split(',')
    : ["Skidding"];
  const bioDescription = process.env.NEXT_PUBLIC_BIO_DESCRIPTION || "brb skidding";
  const discordUserId = process.env.NEXT_PUBLIC_DISCORD_USER_ID || "1230319937155760131";

  const techs = isGuraProfilePic
    ? [...bioTechs, "Linqfy's mom"]
    : bioTechs;

  const hasLastFmCredentials = process.env.NEXT_PUBLIC_LASTFM_API_KEY && process.env.NEXT_PUBLIC_LASTFM_USERNAME;

  const [animateClass, setAnimateClass] = useState('opacity-0 translate-y-10');
  const [contentClass, setContentClass] = useState('opacity-0 translate-y-10');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateClass('opacity-100 translate-y-0 transition-all duration-500');
    }, 100);

    const contentTimer = setTimeout(() => {
      setContentClass('opacity-100 translate-y-0 transition-all duration-500');
    }, 600);

    return () => {
      clearTimeout(timer);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`text-4xl md:text-5xl font-extrabold mb-8 text-center text-foreground transition-all duration-300 ease-in-out transform hover:scale-105 ${animateClass}`}>
        About {brandName}
      </h1>
      <Card className={`max-w-4xl mx-auto overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${contentClass}`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-110">
              <Image
                src={profilePic}
                alt="Profile GIF"
                width={192}
                height={192}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-semibold mb-4 tracking-wider transition-all duration-300 hover:text-primary">
                <span className="glow">{bioName}</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-4 transition-opacity duration-300 hover:opacity-80">
                {bioTechsDesc}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {techs.map((tech, index) => (
                  <Badge key={index} className="bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/80">
                    {tech}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic transition-opacity duration-300 hover:opacity-80">
                <span className="text-sm font-light leading-relaxed tracking-wide">{bioDescription}</span>
              </p>
            </div>
          </div>
          <DiscordPresence userId={discordUserId} />
          {/* {hasLastFmCredentials && <LastFmNowPlaying />} */}
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