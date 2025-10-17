'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGame } from '@/context/Game_Context';
import { Question } from '@/types/game';
import Link from 'next/link';

export default function AdminPanel() {
  const params = useParams();
  const router = useRouter();
  const { currentRoom, currentPlayer, startGame, isLoading } = useGame();
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    timeLimit: 30,
    points: 10
  });

  const handleAddQuestion = () => {
    if (!newQuestion.text || newQuestion.options.some(opt => !opt.trim())) {
      alert('Por favor completa todos los campos');
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      text: newQuestion.text,
      options: newQuestion.options,
      correctAnswer: newQuestion.correctAnswer,
      timeLimit: newQuestion.timeLimit,
      points: newQuestion.points
    };

    // Aquí implementarías la lógica para agregar la pregunta
    console.log('Nueva pregunta:', question);
    
    // Reset form
    setNewQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      timeLimit: 30,
      points: 10
    });
  };

  const handleStartGame = async () => {
    try {
      await startGame();
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  if (!currentRoom || !currentPlayer?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">Solo los administradores pueden acceder a este panel.</p>
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
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
              <p className="text-gray-600">{currentRoom.name}</p>
            </div>
            <div className="flex gap-2">
              <Link 
                href={`/game/${params.roomId}`}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Ver Sala
              </Link>
              <Link 
                href="/"
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Salir
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Jugadores Conectados</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {currentRoom.players.map((player) => (
                  <div 
                    key={player.id} 
                    className="p-3 rounded-lg border bg-gray-50 border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{player.name}</span>
                      <span className="text-sm text-gray-500">
                        {player.score} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Estado del Juego</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
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
                <p className="text-sm text-gray-600">
                  Preguntas: {currentRoom.questions.length}
                </p>
              </div>

              {currentRoom.status === 'waiting' && (
                <button 
                  onClick={handleStartGame}
                  disabled={currentRoom.questions.length === 0 || isLoading}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Iniciando...' : 
                   currentRoom.questions.length === 0 ? 'Agrega preguntas primero' : 
                   'Iniciar Juego'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Agregar Pregunta</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pregunta
              </label>
              <textarea
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Escribe tu pregunta aquí..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opciones de Respuesta
              </label>
              <div className="space-y-2">
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={newQuestion.correctAnswer === index}
                      onChange={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                      className="text-blue-500"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[index] = e.target.value;
                        setNewQuestion({...newQuestion, options: newOptions});
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Opción ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo (segundos)
                </label>
                <input
                  type="number"
                  value={newQuestion.timeLimit}
                  onChange={(e) => setNewQuestion({...newQuestion, timeLimit: parseInt(e.target.value) || 30})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="10"
                  max="120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntos
                </label>
                <input
                  type="number"
                  value={newQuestion.points}
                  onChange={(e) => setNewQuestion({...newQuestion, points: parseInt(e.target.value) || 10})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="100"
                />
              </div>
            </div>

            <button
              onClick={handleAddQuestion}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Agregar Pregunta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
