import { Stack } from 'expo-router';
import { AuthProvider } from '../utils/AuthContext';

/**
 * Este es el Layout raíz de toda la aplicación.
 * Su función es declarar los principales grupos de rutas (las carpetas con paréntesis)
 * para que Expo Router sepa que existen y pueda navegar entre ellos.
 */
export default function RootLayout() {
  return (
    // Este Stack define la estructura de navegación principal.
    // Cada <Stack.Screen> representa un grupo de rutas.
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(bartender)" />
      <Stack.Screen name="(main)" />
      
      {/* Opcional: Esto define la ruta para páginas no encontradas (404). */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}