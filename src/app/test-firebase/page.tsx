'use client';
import { useState, useEffect } from 'react';

export default function TestFirebase() {
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [envVars, setEnvVars] = useState<any>(null);

  useEffect(() => {
    // Verificar variables de entorno
    setEnvVars({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Configurada' : '❌ No configurada',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Configurada' : '❌ No configurada',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Configurada' : '❌ No configurada',
    });
  }, []);

  const handleTest = async () => {
    setIsTesting(true);
    setResult(null);
    
    try {
      // Usar prueba simple primero
      const { simpleFirebaseTest } = await import('@/lib/simple-firebase-test');
      await simpleFirebaseTest();
      setResult('✅ Firebase inicializado correctamente!');
    } catch (error: any) {
      console.error('Error:', error);
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Prueba de Firebase</h1>
        
        <div className="space-y-4">
          {/* Estado de variables de entorno */}
          {envVars && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Variables de Entorno:</h3>
              <div className="text-sm space-y-1">
                <div>API Key: {envVars.apiKey}</div>
                <div>Auth Domain: {envVars.authDomain}</div>
                <div>Project ID: {envVars.projectId}</div>
              </div>
            </div>
          )}

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
              <li>Verifica que las variables estén configuradas arriba</li>
              <li>Haz clic en "Probar Conexión"</li>
              <li>Revisa la consola del navegador para más detalles</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
