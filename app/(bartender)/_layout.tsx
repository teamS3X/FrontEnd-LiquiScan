import { getBartenderSession } from '@/utils/session';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

export default function RootLayout() {
        
    const [checking, setChecking] = useState(false);
    useEffect(() => {
        const checkSession = async () => {
            const session = await getBartenderSession();
            if (!session || !session.token || session.role !== 'bartender') {
                router.replace('/');
            }
            else {
                setChecking(false);
            }
        }
        checkSession(); //Comentar para testeos
    }, []);
    if (checking) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Cargando...</Text>
            </View>
        )
    }
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="barsBartender" />
            <Stack.Screen name="stock" />
        </Stack>
    );
}
