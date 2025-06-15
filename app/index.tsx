import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '@/components/Button'
import { Input } from '@/components/Input';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import { loginUser } from '@/utils/auth';
import { router } from 'expo-router';
import { getSession, saveSession } from '@/utils/session';

export default function Index() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(false);
    const [error, setError] = useState(false);

    const handleLogin = async () => {
        if (username === '' || password === '') {
            setError(true);
            return;
        }
        setLoading(true);
        try {
            console.log('1. Starting login process...');
            console.log('2. Attempting login with:', { username, password });
            
            const { token, user } = await loginUser({ 
                correoelectronico: username, 
                contrasena: password 
            });
            
            console.log('3. Login response received:', { token, user });
            
            if (!token) {
                console.log('4. No token received, aborting');
                setLoading(false);
                return;
            }

            console.log('5. Saving session...');
            await saveSession({ token, user });
            console.log('6. Session saved successfully');

            console.log('7. User role:', user.role);
            if (user.role === 'admin') {
                console.log('8. Attempting to navigate to admin view: /(main)/lists');
                router.replace('/(main)/lists');
            } else if (user.role === 'bar') {
                console.log('8. Attempting to navigate to bar view: /(bartender)/barsBartender');
                router.replace('/(bartender)/barsBartender');
            } else {
                console.log('8. Invalid user role:', user.role);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading || checkingSession) {
        return (
            <View style={styles.container}>
                <Text style={{ color: Colors.dark.text }}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={{ color: '#777777', marginBottom: 20 }}>
                username: admin o bar
            </Text>
            <View style={styles.inputContainer}>
                <Input placeholder='Nombre de usuario' value={username} onChange={setUsername} />
                <Input placeholder='Contraseña' variant='password' value={password} onChange={setPassword} />
            </View>
            {error &&
                <Text style={styles.textError}>Error en los datos</Text>
            }
            <View style={{ marginTop: 50, display:'flex', alignItems:'center' }}>
                <Button title="Ingresar" onPress={handleLogin} size='big' />
                <TouchableOpacity>
                    <Text style={styles.textForgot}>Olvidé mi contraseña</Text>
                </TouchableOpacity>
            </View>
            {/* --- Este es el enlace que debe aparecer --- */}
                        <TouchableOpacity onPress={() => router.push('/bartenderLogin')}>
                            <Text style={styles.link}>¿Eres Bartender? Ingresa aquí</Text>
                        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.background,
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        height: 80,
        display: 'flex',
        justifyContent: 'space-between',
    },
    textForgot: {
        color: Colors.dark.text,
        fontSize: 15,
        marginTop: 13,
    },
    textError: {
        color: Colors.dark.error,
        textTransform: 'uppercase',
        paddingBlock: 10,
        fontWeight: 600,
    },
    link: {
        color: '#4CAF50',
        textAlign: 'center',
        marginTop: 15,
    }
});

