'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/Game_Context';
import Link from 'next/link';

export default function JoinRoom() {
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const { joinRoom, isLoading, error } = useGame();
  const router = useRouter();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || !playerName) return;
    
    try {
      await joinRoom(roomId, playerName);
      router.push(`/game/${roomId}`);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Unirse a Sala</h2>
          <Link 
            href="/"
            className="text-gray-500 hover:text-gray-700"
          >
            ← Volver
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              ID de la Sala
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 placeholder-gray-500"
              placeholder="Ingresa el ID de la sala"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Tu Nombre
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 placeholder-gray-500"
              placeholder="Tu nombre de jugador"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Uniéndose...' : 'Unirse a la Sala'}
          </button>
        </form>
      </div>
    </div>
  );
}
