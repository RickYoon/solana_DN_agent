'use client';

import { useRef, useState } from 'react';

export default function DemoContent() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAndPlayAudio = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tts');
      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      if (audioRef.current) {
        audioRef.current.src = url;
        await audioRef.current.play();
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-8">
      <div className="w-full max-w-2xl rounded-xl bg-gray-800/50 p-8 backdrop-blur-sm">
        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          Solana DeFi Navigator Demo
        </h1>
        
        <div className="space-y-6">
          <div className="text-center">
            <button
              onClick={generateAndPlayAudio}
              disabled={loading}
              className={`rounded-lg px-8 py-4 font-semibold text-white transition-all ${
                loading
                  ? 'cursor-not-allowed bg-gray-600'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Generating Audio...' : 'Play Demo Narration'}
            </button>
          </div>

          {error && (
            <div className="rounded-lg bg-red-900/30 p-4 text-red-400">
              {error}
            </div>
          )}

          <div className="rounded-lg bg-gray-700/50 p-4">
            <audio ref={audioRef} controls className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
} 