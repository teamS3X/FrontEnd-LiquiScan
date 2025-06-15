import { Stack } from 'expo-router';
import { AuthProvider } from '../utils/AuthContext';

export default function Layout() {
    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen
                    name="(auth)"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="(main)"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen name="(bartender)"/>
                <Stack.Screen name="index"/>
                <Stack.Screen name="+not-found" />
            </Stack>
        </AuthProvider>
    );
}
