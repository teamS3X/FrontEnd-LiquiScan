import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import { clearSession } from '@/utils/session';
import { useEffect, useState } from 'react';
import { Camera } from 'expo-camera';
import { ScanDrink } from '@/components/ScanDrink';
import { fetchBarras, fetchListasPorAdministrador } from '@/utils/barService';
import { fetchAlcoholes, fetchAlcoholListRelationsByListId } from '@/utils/listsService';
import API_URL from '@/constants/Api';
export default function stock() {
    const listas = [
        {
            fetchAlcoholListRelationsByListId,
            fetchAlcoholes 
        },
    ];
    // Objeto que almacena el stock ingresado
    const [stock, setStock] = useState<{ id: number | null, nombre: string, imagen: string, manualStock: number, aiStock: number }[]>();
    const [openCamera, setOpenCamera] = useState(false);
    const [scanDrinkId, setScanDrinkId] = useState<number | null>(null);
    const [hasPermission, setHasPermission] = useState(true);
    const [openModalWarning, setOpenModalWarning] = useState(false);
    const [openModalConfirm, setOpenModalConfirm] = useState(false);
    const params = useLocalSearchParams();

    useEffect(() => {
    const fetchData = async () => {
        try {
            const idLista = parseInt(Array.isArray(params.listId) ? params.listId[0] : params.listId);
            const response = await fetch(`${API_URL}/Lista_a_alcohol/${idLista}/filtrar_lista/`);
            const relaciones = await response.json(); // [{id:1, id_alcohol:3}, ...]

            const tragos = await Promise.all(
                relaciones.map(async (item: any) => {
                    const response = await fetch(`${API_URL}/alcohol/${item.idalcohol}/`);
                    const data = await response.json(); // { id, titulo, imagen, etc }
                    
                    return {
                        id: data.id,
                        nombre: data.nombre,
                        imagen: data.imagen || null, // usa esto si tu objeto tiene campo 'imagen'
                        manualStock: -1,
                        aiStock: 0,
                    };
                })
            );
            console.log(tragos)

            setStock(tragos);
        } catch (error) {
            console.error("Error cargando tragos:", error);
        }
    };

    fetchData();

    (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
    })();
    }, []);

    const handleTakePicture = (id: number | null) => {
        setScanDrinkId(id);
        setOpenCamera(true);
    }
    const handleAccept = async () => {
        const lista = stock?.filter((item) => item.manualStock < 0);
        if (lista?.length == 0) {
            setOpenModalConfirm(true);
        }
        else {
            setOpenModalWarning(true);
        }
    }
    const handleBack = () => {
        router.back();
    };
    const handleSaveData = () => {
        console.log('Saving...');
        console.log(stock);
        router.back();
    }
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>
                    {params.barTitle}
                </Text>

                <Text style={styles.textIntrucction}></Text>
                <ScrollView style={styles.barsContainer} pointerEvents={openModalConfirm || openModalWarning ? 'none' : 'auto'}>
                    {
                        stock && stock.map((tragos, index) => (
                            <View style={styles.itemContainer} key={tragos.id}>
                                <Image
                                    source={{ uri: tragos.imagen }}
                                    style={styles.image}
                                />
                                
                                    <View style={styles.rightContainer}>
                                        <Text style={styles.text}>{tragos.nombre}</Text>
                                    <View style={styles.middleContainer}>
                                        <View style={styles.manualInputContainer}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    const updatedStock = [...stock];
                                                    updatedStock[index] = {
                                                        ...updatedStock[index],
                                                        manualStock: (updatedStock[index].manualStock || 0) - 1
                                                    }
                                                    setStock(updatedStock);
                                                }}
                                                disabled={tragos.manualStock < 0}
                                            >
                                                <Text style={styles.inputButton}>-</Text>
                                            </TouchableOpacity>
                                            <TextInput style={styles.textManual}
                                                placeholder='0'
                                                keyboardType='numeric'
                                                onChangeText={(text) => {
                                                    const updatedDrinks = [...stock];
                                                    updatedDrinks[index] = {
                                                        ...updatedDrinks[index],
                                                        manualStock: parseInt(text) || 0
                                                    };
                                                    setStock(updatedDrinks);
                                                }}
                                                value={tragos.manualStock < 0 ? '-' : tragos.manualStock.toString()}
                                            />
                                            <TouchableOpacity
                                                onPress={() => {
                                                    const updatedStock = [...stock];
                                                    updatedStock[index] = {
                                                        ...updatedStock[index],
                                                        manualStock: (updatedStock[index].manualStock || 0) + 1
                                                    }
                                                    setStock(updatedStock);
                                                }}>
                                                <Text style={styles.inputButton}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.scanContainer}>
                                            <TouchableOpacity onPress={() => { handleTakePicture(tragos.id) }}>
                                                <Image
                                                    source={require('@/assets/images/icon-scan.png')}
                                                    style={styles.icon}
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.textAi}>{tragos.aiStock < 0 ? '-' : tragos.aiStock.toFixed(2)}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.textTotal}>TOTAL: {tragos.manualStock < 0 ? '' : (tragos.manualStock + tragos.aiStock).toFixed(2)}</Text>
                                </View>
                            </View>
                        ))
                    }
                </ScrollView >
                <View style={styles.buttonContainer} pointerEvents={openModalConfirm || openModalWarning ? 'none' : 'auto'}>
                    <Button title='Volver' variant='secondary' onPress={handleBack} />
                    <Button title='Aceptar' onPress={handleAccept} />
                </View>
            </View >
            {/* Camara */}
            {openCamera && stock != undefined &&
                <ScanDrink drinkId={scanDrinkId} closeCamera={() => setOpenCamera(false)} stock={stock} setStock={setStock} onEstimationComplete={()=>console.log("hola")}/>
            }
            {/* Modal Warning */}
            {openModalWarning &&
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Faltan elementos por contar</Text>
                    <Button title='Aceptar' onPress={() => setOpenModalWarning(false)} />
                </View>
            }
            {/* Modal Confirm */}
            {openModalConfirm &&
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>¿Desea enviar inventario?</Text>
                    <View style={styles.modalButtonContainer}>
                        <Button title='Si' variant='secondary' onPress={handleSaveData} />
                        <Button title='No' onPress={() => setOpenModalConfirm(false)} />
                    </View>
                </View>
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: '100%',
        paddingBlock: 40,
        position: 'relative',
        backgroundColor: Colors.dark.background,
    },
    title: {
        color: Colors.dark.text,
        height: 80,
        lineHeight: 80,
        paddingInline: 60,
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        fontSize: 24,
        fontWeight: 700,
        borderColor: Colors.dark.text,

    },

    textIntrucction: {
        color: Colors.dark.text,
        textAlign: 'center',
        marginBlock: 20,
        fontWeight: 700,
        textTransform: 'uppercase',
    },
    barsContainer: {
        marginInline: 20,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingBlockEnd: 40,
    },
    itemContainer: {
        borderColor: Colors.dark.text,
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        justifyContent: 'center',
        marginBlock: 6,
    },
    middleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    rightContainer: {
        flex: 1,
        display: 'flex',
        gap: 5,
        justifyContent: 'center',
        padding: 5,
    },
    scanContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    image: {
        width: 90,
        height: 110,
        objectFit: 'cover',
    },
    text: {
        color: Colors.dark.text,
        textTransform: 'uppercase',
        fontSize: 13,
        fontWeight: 700,
        flex: 1,
    },
    manualInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputButton: {
        color: Colors.dark.text,
        width: 20,
        height: 20,
        fontWeight: 700,
        fontSize: 24,
        lineHeight: 20,
        textAlign: 'center',
    },
    textManual: {
        color: Colors.dark.text,
        borderBottomWidth: 1,
        borderColor: Colors.dark.text,
        textAlign: 'center',
        width: 40,
    },
    textAi: {
        color: Colors.dark.text,
        textAlign: 'center',
    },
    textTotal: {
        height: 30,
        lineHeight: 30,
        color: Colors.dark.primary,
        fontWeight: 700,
    },
    icon: {
        width: 40,
        height: 40,
        objectFit: 'cover',
    },
    buttonContainer: {
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        borderTopWidth: 1,
        borderColor: Colors.dark.text,
    },
    modalContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 350,
        height: 160,
        backgroundColor: Colors.dark.background,
        borderWidth: 1,
        borderColor: Colors.dark.text,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        transform: 'translateX(-175px) translateY(-80px)',
    },
    modalButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
    },
    modalText: {
        color: Colors.dark.text,
        fontSize: 20,
        textAlign: 'center',
        height: 58,
        borderColor: Colors.dark.text,
        borderBottomWidth: 1,
        textTransform: 'uppercase',
    }
});
