import { getBartenderSession } from '@/utils/session';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

/**
 * Este Layout protege las rutas dentro del grupo (bartender).
 * Verifica que haya una sesión de bartender activa antes de mostrar el contenido.
 */
export default function BartenderLayout() {
    // Inicia en 'true' para mostrar "Cargando..." mientras se verifica la sesión.
    const [isSessionChecking, setSessionChecking] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const session = await getBartenderSession();
            
            // Si no hay sesión o el rol no es 'bartender', redirige a la pantalla de login.
            if (!session || session.role !== 'bartender') {
                router.replace('/bartenderLogin');
            } else {
                 // Si la sesión es válida, permite el acceso.
                 setSessionChecking(false);
            }
        };

        checkSession();
    }, []);

    // Muestra una pantalla de carga mientras se completa la verificación.
    if (isSessionChecking) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Verificando sesión...</Text>
            </View>
        );
    }

    // Si la sesión es válida, muestra las pantallas protegidas del bartender.
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="barsBartender" />
            <Stack.Screen name="stock" />
        </Stack>
    );
}
