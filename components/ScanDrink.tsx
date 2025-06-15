import { Colors } from '@/constants/Colors';
import { CameraView } from 'expo-camera';
import React, { useRef } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

type stockItemType = {
    id: number, title: string, image: string, manualStock: number, aiStock: number
}

interface ScanProps {
    drinkId: number | null;
    closeCamera: () => void;
    stock: { id: number, title: string, image: string, manualStock: number, aiStock: number }[];
    setStock: (newStock: { id: number, title: string, image: string, manualStock: number, aiStock: number }[]) => void;
}

// URL de tu servidor backend Django.
// Si estás probando en un emulador Android, '10.0.2.2' es el alias para tu localhost.
// En un dispositivo físico, usa la IP de tu máquina local (ej: 'http://192.168.1.5:8000/api/estimate_liquid/').
const BACKEND_URL = 'http://10.0.2.2:8000/api/estimate_liquid/'; // Para emulador Android
// const BACKEND_URL = 'http://localhost:8000/api/estimate_liquid/'; // Para iOS simulator o Expo Go en web
// const BACKEND_URL = 'http://TU_IP_LOCAL:8000/api/estimate_liquid/'; // Para dispositivo físico

export const ScanDrink = ({
    drinkId,
    closeCamera,
    stock,
    setStock,
}: ScanProps) => {
    const camRef = useRef<CameraView>(null);

    const takePicture = async () => {
        if (camRef.current) {
            const photo = await camRef.current.takePictureAsync({
                quality: 0.7, // Aumentar calidad para mejor análisis de IA
                base64: true,
            });
            console.log('Photo uri:', photo.uri);
            return photo;
        }
        return null;
    }

    const obtainRemaining = async () => {
        if (!drinkId) {
            Alert.alert('Error', 'No se ha seleccionado una bebida.');
            return;
        }

        const photo = await takePicture();
        if (!photo?.base64) {
            Alert.alert('Error', 'No se pudo capturar la imagen. Asegúrate de dar permisos a la cámara.');
            return;
        }

        try {
            console.log('Enviando imagen al servidor Django...');
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: photo.base64,
                    drinkId: drinkId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error del servidor: ${response.status} - ${errorData.error || 'Mensaje desconocido'}`);
            }

            const data = await response.json();
            const predictedStock = parseFloat(data.fraccion);

            if (isNaN(predictedStock) || predictedStock < 0.05 || predictedStock > 0.95) {
                throw new Error('Respuesta de predicción inválida del servidor. La fracción debe estar entre 0.05 y 0.95.');
            }

            const updatedStock = stock.map((drink) => {
                if (drink.id === drinkId) {
                    return {
                        ...drink,
                        aiStock: predictedStock // Reemplaza aiStock con la fracción predicha
                    };
                }
                return drink;
            });

            setStock(updatedStock);
            Alert.alert('Éxito', `Stock actualizado: ${Math.round(predictedStock * 100)}%`);
            closeCamera();

        } catch (err: any) {
            console.error('Error al obtener el stock:', err);
            Alert.alert('Error', `Problema con el servidor o la respuesta: ${err.message || 'Error desconocido'}`);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={'back'}
                ref={camRef}
            >
            </CameraView>
            <TouchableOpacity
                style={styles.takeButton}
                onPress={obtainRemaining}
            >
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.backButton}
                onPress={closeCamera}
            >
                <Image
                    source={require('@/assets/images/icon-back.png')}
                    style={styles.backIcon}
                />
            </TouchableOpacity>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: Colors.dark.background,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    camera: {
        flex: 1,
    },
    takeButton: {
        position: 'absolute',
        backgroundColor: Colors.dark.text,
        borderRadius: 60,
        bottom: 100,
        left: '50%',
        width: 60,
        height: 60,
        transform: [{ translateX: -30 }],
    },
    backButton: {
        position: 'absolute',
        borderColor: Colors.dark.text,
        borderWidth: 2,
        borderRadius: 60,
        bottom: 100,
        left: 25,
        width: 50,
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        width: 30,
        height: 30,
        marginRight: 3,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});