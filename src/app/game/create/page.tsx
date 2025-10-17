'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/Game_Context';
import Link from 'next/link';

export default function CreateRoom() {
  const [roomName, setRoomName] = useState('');
  const [adminName, setAdminName] = useState('');
  const { createRoom, isLoading, error } = useGame();
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName || !adminName) return;
    
    try {
      const roomId = await createRoom(roomName, adminName);
      router.push(`/game/${roomId}/admin`);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Crear Sala</h2>
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

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Sala
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Sala de Trivia"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu Nombre
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu nombre como administrador"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Creando...' : 'Crear Sala'}
          </button>
        </form>
      </div>
    </div>
  );
}
