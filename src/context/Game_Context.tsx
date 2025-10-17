'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameRoom, Player, Question } from '@/types/game';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, onSnapshot, collection, addDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

interface GameContextType {
  currentRoom: GameRoom | null;
  currentPlayer: Player | null;
  isLoading: boolean;
  error: string | null;
  joinRoom: (roomId: string, playerName: string) => Promise<void>;
  createRoom: (roomName: string, adminName: string) => Promise<string>;
  addQuestion: (question: Question) => void;
  startGame: () => Promise<void>;
  leaveRoom: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = async (roomName: string, adminName: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const roomId = uuidv4();
      const adminPlayer: Player = {
        id: uuidv4(),
        name: adminName,
        isAdmin: true,
        isReady: true,
        score: 0,
        joinedAt: new Date()
      };

      const newRoom: GameRoom = {
        id: roomId,
        name: roomName,
        admin: adminPlayer.id,
        players: [adminPlayer],
        questions: [],
        status: 'waiting',
        createdAt: new Date(),
        settings: {
          maxPlayers: 10,
          questionTimeLimit: 30,
          showCorrectAnswer: true
        }
      };

      await setDoc(doc(db, 'rooms', roomId), newRoom);
      
      setCurrentRoom(newRoom);
      setCurrentPlayer(adminPlayer);
      
      return roomId;
    } catch (err) {
      setError('Error al crear la sala');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async (roomId: string, playerName: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const roomRef = doc(db, 'rooms', roomId);
      const roomSnap = await getDoc(roomRef);
      
      if (!roomSnap.exists()) {
        throw new Error('La sala no existe');
      }

      const roomData = roomSnap.data() as GameRoom;
      
      if (roomData.players.length >= roomData.settings.maxPlayers) {
        throw new Error('La sala está llena');
      }

      if (roomData.status !== 'waiting') {
        throw new Error('La sala ya está en juego');
      }

      const newPlayer: Player = {
        id: uuidv4(),
        name: playerName,
        isAdmin: false,
        isReady: false,
        score: 0,
        joinedAt: new Date()
      };

      const updatedPlayers = [...roomData.players, newPlayer];
      
      await updateDoc(roomRef, {
        players: updatedPlayers
      });

      setCurrentPlayer(newPlayer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al unirse a la sala');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = (question: Question) => {
    if (!currentRoom || !currentPlayer?.isAdmin) return;
    
    const updatedQuestions = [...currentRoom.questions, question];
    setCurrentRoom({ ...currentRoom, questions: updatedQuestions });
  };

  const startGame = async () => {
    if (!currentRoom || !currentPlayer?.isAdmin) return;
    
    try {
      const roomRef = doc(db, 'rooms', currentRoom.id);
      await updateDoc(roomRef, {
        status: 'active',
        currentQuestion: 0
      });
    } catch (err) {
      setError('Error al iniciar el juego');
    }
  };

  const leaveRoom = () => {
    setCurrentRoom(null);
    setCurrentPlayer(null);
    setError(null);
  };

  useEffect(() => {
    if (!currentRoom) return;

    const roomRef = doc(db, 'rooms', currentRoom.id);
    const unsubscribe = onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        const roomData = doc.data() as GameRoom;
        setCurrentRoom(roomData);
      }
    });

    return () => unsubscribe();
  }, [currentRoom?.id]);

  return (
    <GameContext.Provider value={{
      currentRoom,
      currentPlayer,
      isLoading,
      error,
      joinRoom,
      createRoom,
      addQuestion,
      startGame,
      leaveRoom
    }}>
      {children}
    </GameContext.Provider>
  );
};
