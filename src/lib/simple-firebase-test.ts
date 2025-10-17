// Prueba simple de Firebase sin escribir a Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const simpleFirebaseTest = async () => {
  try {
    console.log('🔥 Iniciando prueba simple de Firebase...');
    
    // Verificar variables de entorno
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      throw new Error('Variables de entorno no configuradas');
    }
    
    console.log('✅ Variables de entorno OK');
    
    // Inicializar Firebase
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    };
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase inicializado correctamente');
    console.log('✅ Firestore configurado');
    
    return true;
  } catch (error) {
    console.error('❌ Error en prueba simple:', error);
    throw error;
  }
};
