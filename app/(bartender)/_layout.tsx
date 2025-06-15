import { getSession } from '@/utils/session';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

export default function RootLayout() {
        
    const [checking, setChecking] = useState(false);
    useEffect(() => {
        const checkSession = async () => {
            const { token, role } = await getSession();
            if (!token || role !== 'bar') {
                router.replace('/');
            }
            else {
                setChecking(false);
            }
        }
        checkSession();
    }, []);
    if (checking) {
        return (
            <View>
                <Text> Cargando...</Text>
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
