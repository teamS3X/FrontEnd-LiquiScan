import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// Importamos los nuevos tipos y funciones renombradas
import { saveBartenderSession, BartenderSession } from '@/utils/session'; 
import API_URL from '@/constants/Api'; 

export default function BartenderLoginScreen() {
    const [nombre, setNombre] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBartenderLogin = async () => {
        if (loading) return;
        setLoading(true);
        setError('');  

        

        try {
            const response = await fetch(`${API_URL}/auth/bartender/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, pin }),
            });

            const apiData = await response.json();

            if (!response.ok) {
                throw new Error(apiData.error || 'Error al iniciar sesión.');
            }

            // Usamos el tipo renombrado BartenderSession
            const sessionToSave: BartenderSession = {
                token: apiData.token,
                user: apiData.user,
                bars: apiData.bars,
                role: 'bartender',
            };
            
            // Llamamos a la función renombrada saveBartenderSession
            await saveBartenderSession(sessionToSave);

            router.replace('/(bartender)/barsBartender');

        } catch (e: any) {
            setError(e.message);
            Alert.alert('Error de Login', e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Acceso Bartender</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre de Usuario"
                placeholderTextColor="#999"
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="PIN del Administrador"
                placeholderTextColor="#999"
                value={pin}
                onChangeText={setPin}
                secureTextEntry
                keyboardType="numeric"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleBartenderLogin} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Ingresando...' : 'Ingresar'}</Text>
            </TouchableOpacity>
        </View>
    );
}

// ... (los estilos se mantienen igual)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    input: {
        height: 50,
        backgroundColor: '#2C2C2C',
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#444',
    },
    button: {
        backgroundColor: '#007AFF',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        color: '#007AFF',
        textAlign: 'center',
        marginTop: 20,
    },
    errorText: {
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: 10,
    }
});
