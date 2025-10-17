'use client';
import { useState } from 'react';
import { testFirebaseConnection } from '@/lib/test-firebase';

export default function TestFirebase() {
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleTest = async () => {
    setIsTesting(true);
    setResult(null);
    
    try {
      const success = await testFirebaseConnection();
      setResult(success ? '✅ Conexión exitosa con Firebase!' : '❌ Error de conexión');
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Prueba de Firebase</h1>
        
        <div className="space-y-4">
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isTesting ? 'Probando...' : 'Probar Conexión'}
          </button>
          
          {result && (
            <div className={`p-4 rounded-lg ${
              result.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {result}
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <p><strong>Instrucciones:</strong></p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Copia las credenciales de Firebase</li>
              <li>Pega las credenciales en .env.local</li>
              <li>Reinicia el servidor (npm run dev)</li>
              <li>Haz clic en "Probar Conexión"</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
