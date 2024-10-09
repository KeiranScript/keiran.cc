'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const StatsContent = ({ stats }: { stats: any }) => {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue((stats.usedStorage / stats.totalStorage) * 100);
    }, 500);
    return () => clearTimeout(timer);
  }, [stats.usedStorage, stats.totalStorage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-foreground"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Storage Stats
      </motion.h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105">
            <CardHeader>
              <CardTitle>Total Files</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalFiles}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105">
            <CardHeader>
              <CardTitle>Used Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatBytes(stats.usedStorage)}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105">
            <CardHeader>
              <CardTitle>Available Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatBytes(stats.availableStorage)}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progressValue} className="w-full" />
            <p className="mt-2 text-sm text-muted-foreground">
              {formatBytes(stats.usedStorage)} of {formatBytes(stats.totalStorage)} used
            </p>
          </CardContent>
        </Card>
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

const Stats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then((data) => setStats(data));
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }

  return <StatsContent stats={stats} />;
};

const getStats = async () => {
  try {
    const response = await fetch('/api/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalFiles: 0,
      usedStorage: 0,
      availableStorage: TOTAL_STORAGE,
      totalStorage: TOTAL_STORAGE,
    };
  }
};

export default Stats;
