import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { CameraView } from 'expo-camera';
type stockItemType = {
    id: number, title: string, image: string, manualStock: number, aiStock: number
}
interface ScanProps {
    drinkId: number | null;
    closeCamera: () => void;
    stock: { id: number, title: string, image: string, manualStock: number, aiStock: number }[];
    setStock: (newStock: { id: number, title: string, image: string, manualStock: number, aiStock: number }[]) => void;
}
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
                quality: 0.5,
                base64: true,
            });
            console.log('Photo uri:', photo.uri);
            return photo;
        }
    }
    const obtainRemaining = async () => {
        if (!drinkId) { return };
        const photo = await takePicture();
        if (!photo?.base64) {
            Alert.alert('Error', 'No se pudo capturar la imagen');
            return;
        }
        try {
            // const response = await fetch('url', {

            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         image: photo.base64,
            //         drinkId,
            //     }),
            // });
            // const data = await response.json();
            // const predictedStock = parseFloat(data.remaining);
            const predictedStock = 0.3;
            if (isNaN(predictedStock)) throw new Error('Respuesta inválida');

            const updatedStock = stock.map((drink) => {
                if (drink.id === drinkId) {
                    return {
                        ...drink,
                        aiStock: drink.aiStock + predictedStock
                    };
                }
                return drink;
            });

            setStock(updatedStock);
            closeCamera();
        }
        catch (err) {
            Alert.alert('Error', 'Problema con el servidor');
            console.log(err);
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
        transform: 'translateX(-30px)',
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
        marginInlineEnd: 3,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});
