import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// Importamos los nuevos tipos y funciones renombradas
import { saveBartenderSession, BartenderSession } from '@/utils/session'; 
import API_URL from '@/constants/Api'; 
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/Button'
import { Input } from '@/components/Input';
        
        
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
        <View style={styles.inputContainer}>
            <Input 
                placeholder='Nombre de Usuario' 
                value={nombre} 
                onChange={setNombre}
                // autoCapitalize="none" // Esta prop estaría dentro del componente Input
            />
            <Input 
                placeholder='PIN del Administrador' 
                variant='password' // Usa la variante para ocultar el texto
                value={pin} 
                onChange={setPin}
                keyboardType="numeric" // El componente Input debería aceptar esta prop
            />
        </View>
        {error &&
            <Text style={styles.textError}>{error}</Text>
        }
        <View style={{ marginTop: 50, display: 'flex', alignItems: 'center' }}>
            <Button 
                title={loading ? 'Ingresando...' : 'Ingresar'} 
                onPress={handleBartenderLogin} 
                size='big' 
                disabled={loading}
            />
        </View>
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
        paddingHorizontal: 20, // Añadido para que los elementos no toquen los bordes
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text, // Usando color del tema
        marginBottom: 40,
        textAlign: 'center',
    },
    inputContainer: {
        height: 80, // Altura para dos inputs
        width: '100%', // Asegura que ocupe el ancho disponible
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20, // Espacio antes del mensaje de error
    },
    textError: {
        color: Colors.dark.error,
        textTransform: 'uppercase',
        paddingVertical: 10,
        fontWeight: '600',
        textAlign: 'center',
    },
});