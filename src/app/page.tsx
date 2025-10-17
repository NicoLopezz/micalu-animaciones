'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Micalu Animaciones
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Crea y únete a salas de juego interactivas
        </p>
        <div className="space-y-4">
          <Link 
            href="/game/create"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors block text-center font-medium"
          >
            Crear Sala
          </Link>
          <Link 
            href="/join"
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors block text-center font-medium"
          >
            Unirse a Sala
          </Link>
        </div>
      </div>
    </div>
  );
}
