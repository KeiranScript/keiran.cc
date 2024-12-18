'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cat,
  Send,
  X,
  Loader2,
  Volume2,
  VolumeX,
  Palette,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_CHAR_LIMIT = 150;

export function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [colorChanges, setColorChanges] = useState<Record<
    string,
    string
  > | null>(null);
  const [pendingColorChanges, setPendingColorChanges] = useState<Record<
    string,
    string
  > | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newMessage],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch response');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message },
      ]);

      if (data.colorChanges) {
        setPendingColorChanges(data.colorChanges);
        toast.info('The site colors have been temporarily changed.');
      }
    } catch (error) {
      toast.error('Failed to fetch response');
    } finally {
      setIsLoading(false);
    }
  };

  const speakMessage = (message: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.includes('Female') || voice.name.includes('female'),
      );

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech is not supported in this browser.');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const applyColorChanges = () => {
    if (pendingColorChanges) {
      Object.entries(pendingColorChanges).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
      setColorChanges(pendingColorChanges);
      setPendingColorChanges(null);
      toast.success('The site colors have been updated.');
    }
  };

  const resetColors = () => {
    if (colorChanges) {
      Object.keys(colorChanges).forEach((key) => {
        document.documentElement.style.removeProperty(key);
      });
      setColorChanges(null);
      setPendingColorChanges(null);
      toast.success('The site colors have been reset.');
    }
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          size="icon"
          className="rounded-full w-12 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Cat className="h-6 w-6" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-20 right-4 z-50 w-80 sm:w-96"
          >
            <Card className="border-primary/10 bg-background/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Chat with MeowAI
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {pendingColorChanges && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                            onClick={applyColorChanges}
                          >
                            <Palette className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Apply color changes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {colorChanges && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                            onClick={resetColors}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reset colors</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] mb-4 pr-4" ref={scrollAreaRef}>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      <div className="flex items-center justify-end">
                        {message.role === 'assistant' && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 mr-2"
                                  onClick={() => speakMessage(message.content)}
                                >
                                  <Volume2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Read aloud</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        <span
                          className={`inline-block p-2 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center"
                    >
                      <span className="inline-block p-2 rounded-lg bg-muted text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </span>
                    </motion.div>
                  )}
                </ScrollArea>
                <form onSubmit={handleSubmit} className="flex items-center">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) =>
                      setInput(e.target.value.slice(0, MAX_CHAR_LIMIT))
                    }
                    className="flex-grow mr-2 bg-background/50"
                    maxLength={MAX_CHAR_LIMIT}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <div className="mt-2 text-xs text-muted-foreground">
                  {input.length}/{MAX_CHAR_LIMIT} characters
                </div>
                {isSpeaking && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={stopSpeaking}
                  >
                    <VolumeX className="h-4 w-4 mr-2" /> Stop Speaking
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
