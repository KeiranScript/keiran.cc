'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Music, Clock, BarChart2 } from 'lucide-react'
import Image from 'next/image'

const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY || ''
const USERNAME = process.env.NEXT_PUBLIC_LASTFM_USERNAME || ''

interface TrackInfo {
  name: string
  artist: string
  album: string
  image: string
}

interface UserInfo {
  playcount: string
  trackCount: string
}

export function LastFmNowPlaying() {
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trackResponse, userResponse] = await Promise.all([
          fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`),
          fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${USERNAME}&api_key=${API_KEY}&format=json`)
        ])

        if (!trackResponse.ok || !userResponse.ok) {
          throw new Error('Failed to fetch data from Last.fm')
        }

        const trackData = await trackResponse.json()
        const userData = await userResponse.json()

        const latestTrack = trackData.recenttracks.track[0]
        setCurrentTrack({
          name: latestTrack.name,
          artist: latestTrack.artist['#text'],
          album: latestTrack.album['#text'],
          image: latestTrack.image[2]['#text'] // Medium size image
        })

        setUserInfo({
          playcount: userData.user.playcount,
          trackCount: userData.user.track_count
        })

        setLoading(false)
      } catch (err) {
        console.error('Error fetching Last.fm data:', err)
        setError('Failed to load Last.fm data')
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Now Playing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Now Playing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Music className="mr-2" />
          Now Playing
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentTrack && (
          <div className="flex items-center space-x-4">
            <Image
              src={currentTrack.image || '/placeholder.svg'}
              alt={`${currentTrack.name} album cover`}
              width={64}
              height={64}
              className="rounded"
            />
            <div>
              <h3 className="font-semibold">{currentTrack.name}</h3>
              <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
              <p className="text-xs text-muted-foreground">{currentTrack.album}</p>
            </div>
          </div>
        )}
        {userInfo && (
          <div className="mt-4 flex justify-between">
            <Badge variant="secondary" className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {userInfo.playcount} scrobbles
            </Badge>
            <Badge variant="secondary" className="flex items-center">
              <BarChart2 className="mr-1 h-3 w-3" />
              {userInfo.trackCount} unique tracks
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
