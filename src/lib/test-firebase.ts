// Script de prueba para verificar la conexión con Firebase
import { db } from './firebase';
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Probando conexión con Firebase...');
    
    // Verificar que las variables de entorno estén configuradas
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      throw new Error('Variables de entorno de Firebase no configuradas');
    }
    
    console.log('✅ Variables de entorno configuradas');
    
    // Intentar escribir un documento de prueba
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Conexión exitosa con Firebase',
      timestamp: new Date(),
      test: true
    });
    
    console.log('✅ Documento de prueba creado con ID:', testDoc.id);
    
    // Intentar leer documentos
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('✅ Documentos leídos:', querySnapshot.size);
    
    return true;
  } catch (error) {
    console.error('❌ Error de conexión con Firebase:', error);
    throw error;
  }
};
