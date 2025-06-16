import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Camera } from 'expo-camera';
import { ScanDrink, EstimationResult } from '@/components/ScanDrink'; // Importamos el tipo EstimationResult

export default function StockScreen() {
    // Definimos el tipo para un item del stock
    type StockItem = {
        id: number;
        title: string;
        image: string;
        manualStock: number; // Botellas llenas
        aiStock: number;     // Onzas estimadas de la botella parcial
    };
    
    const [stock, setStock] = useState<StockItem[]>([]);
    const [openCamera, setOpenCamera] = useState(false);
    const [scanDrinkId, setScanDrinkId] = useState<number | null>(null);
    const [hasPermission, setHasPermission] = useState(true);
    
    // Estados para el nuevo modal de confirmación de IA
    const [estimationResult, setEstimationResult] = useState<EstimationResult | null>(null);
    const [isEstimationModalVisible, setEstimationModalVisible] = useState(false);

    const params = useLocalSearchParams();

    useEffect(() => {
        // Lógica para cargar la lista de bebidas (puede venir de una API en el futuro)
        const mockItems = [
            { id: 1, title: 'Pisco Sour', image: '@/assets/images/trago.jpg' },
            { id: 2, title: 'Mojito', image: '@/assets/images/trago.jpg' },
            { id: 3, title: 'Old Fashioned', image: '@/assets/images/trago.jpg' },
        ];
        
        const initialStock = mockItems.map(item => ({
            ...item,
            manualStock: 0, // Inicia en 0
            aiStock: 0,       // Inicia en 0
        }));
        setStock(initialStock);

        // Pedir permisos de cámara
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleTakePicture = (id: number) => {
        if (!hasPermission) {
            alert('Se necesitan permisos de cámara para usar esta función.');
            return;
        }
        setScanDrinkId(id);
        setOpenCamera(true);
    };

    // Función que se ejecuta cuando la IA termina
    const handleEstimationComplete = (result: EstimationResult) => {
        setEstimationResult(result);
        setEstimationModalVisible(true);
    };

    // Función que se ejecuta si el usuario confirma la estimación
    const confirmAiStockUpdate = () => {
        if (!estimationResult || scanDrinkId === null) return;

        const updatedStock = stock.map((drink) => {
            if (drink.id === scanDrinkId) {
                // Actualizamos el stock con el valor en ONZAS
                return { ...drink, aiStock: estimationResult.volumen_fl_oz };
            }
            return drink;
        });

        setStock(updatedStock);
        setEstimationModalVisible(false);
        setEstimationResult(null);
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>{params.barTitle || 'Inventario'}</Text>
                <ScrollView style={styles.barsContainer}>
                    {stock.map((drink, index) => (
                        <View style={styles.itemContainer} key={drink.id}>
                            <Image source={require('@/assets/images/trago.jpg')} style={styles.image} />
                            <View style={styles.rightContainer}>
                                <Text style={styles.text}>{drink.title}</Text>
                                <View style={styles.middleContainer}>
                                    <View style={styles.manualInputContainer}>
                                        <Text>Botellas Llenas:</Text>
                                        <TextInput
                                            style={styles.textManual}
                                            keyboardType='numeric'
                                            onChangeText={(text) => {
                                                const updated = [...stock];
                                                updated[index].manualStock = parseInt(text) || 0;
                                                setStock(updated);
                                            }}
                                            value={drink.manualStock.toString()}
                                        />
                                    </View>
                                    <View style={styles.scanContainer}>
                                        <TouchableOpacity onPress={() => handleTakePicture(drink.id)}>
                                            <Image source={require('@/assets/images/icon-scan.png')} style={styles.icon} />
                                        </TouchableOpacity>
                                        <Text style={styles.textAi}>{drink.aiStock.toFixed(1)} oz</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <Button title='Volver' variant='secondary' onPress={() => router.back()} />
                    <Button title='Guardar Inventario' onPress={() => console.log(stock)} />
                </View>
            </View>

            {/* Componente de la Cámara */}
            {openCamera && scanDrinkId !== null && (
                <ScanDrink
                    drinkId={scanDrinkId}
                    closeCamera={() => setOpenCamera(false)}
                    onEstimationComplete={handleEstimationComplete}
                />
            )}
            
            {/* Modal de Confirmación de la Estimación */}
            {isEstimationModalVisible && estimationResult && (
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Estimación Recibida</Text>
                        <Text style={styles.modalText}>Fracción: {Math.round(estimationResult.fraccion * 100)}%</Text>
                        <Text style={styles.modalText}>Onzas: {estimationResult.volumen_fl_oz.toFixed(1)} oz</Text>
                        <Text style={styles.modalText}>Mililitros: {Math.round(estimationResult.volumen_ml)} ml</Text>
                        <Text style={styles.modalQuestion}>¿Desea agregar este valor (en onzas) al inventario?</Text>
                        <View style={styles.modalButtonContainer}>
                            <Button title='No' variant='secondary' onPress={() => setEstimationModalVisible(false)} />
                            <Button title='Sí, Agregar' onPress={confirmAiStockUpdate} />
                        </View>
                    </View>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject, // Ocupa toda la pantalla
        backgroundColor: Colors.dark.background,
    },
    camera: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    outline: {
        width: '50%',
        height: '70%',
        resizeMode: 'contain',
        opacity: 0.3,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        marginTop: 10,
        fontSize: 16,
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    takeButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        borderWidth: 4,
        borderColor: 'rgba(0,0,0,0.2)'
    },
    controlButton: {
        padding: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 80, // Espacio para balancear el botón de cancelar
    }
});