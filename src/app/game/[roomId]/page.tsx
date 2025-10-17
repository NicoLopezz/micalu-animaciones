'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGame } from '@/context/Game_Context';
import Link from 'next/link';

export default function GameRoom() {
  const params = useParams();
  const router = useRouter();
  const { currentRoom, currentPlayer, isLoading, error } = useGame();
  const roomId = params.roomId as string;

  useEffect(() => {
    if (!currentRoom && !isLoading) {
      router.push('/join');
    }
  }, [currentRoom, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando sala...</p>
        </div>
      </div>
    );
  }

  if (!currentRoom || !currentPlayer) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sala no encontrada</h2>
          <p className="text-gray-600 mb-6">La sala no existe o no tienes acceso a ella.</p>
          <Link 
            href="/"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{currentRoom.name}</h1>
              <p className="text-gray-600">ID: {currentRoom.id}</p>
            </div>
            <Link 
              href="/"
              className="text-gray-500 hover:text-gray-700"
            >
              ← Salir
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Jugadores ({currentRoom.players.length}/{currentRoom.settings.maxPlayers})</h3>
              <div className="space-y-2">
                {currentRoom.players.map((player) => (
                  <div 
                    key={player.id} 
                    className={`p-3 rounded-lg border ${
                      player.isAdmin 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {player.name}
                        {player.isAdmin && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">Admin</span>}
                      </span>
                      <span className="text-sm text-gray-500">
                        {player.score} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Estado de la Sala</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Estado: <span className={`font-medium ${
                    currentRoom.status === 'waiting' ? 'text-yellow-600' :
                    currentRoom.status === 'active' ? 'text-green-600' :
                    'text-red-600'
                  }`}>
                    {currentRoom.status === 'waiting' ? 'Esperando' :
                     currentRoom.status === 'active' ? 'En juego' :
                     'Finalizado'}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Preguntas: {currentRoom.questions.length}
                </p>
                <p className="text-sm text-gray-600">
                  Tiempo por pregunta: {currentRoom.settings.questionTimeLimit}s
                </p>
              </div>

              {currentPlayer.isAdmin && currentRoom.status === 'waiting' && (
                <div className="mt-4">
                  <button 
                    onClick={() => {/* Implementar startGame */}}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                    disabled={currentRoom.questions.length === 0}
                  >
                    {currentRoom.questions.length === 0 
                      ? 'Agrega preguntas primero' 
                      : 'Iniciar Juego'
                    }
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
