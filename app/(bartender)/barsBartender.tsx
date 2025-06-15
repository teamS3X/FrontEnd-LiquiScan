import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/Button';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
// 1. CORRECCIÓN EN LA IMPORTACIÓN: Se importa 'BartenderSession' en lugar de 'Session'.
import { Bar, BartenderSession, clearBartenderSession, getBartenderSession } from '@/utils/session';

export default function BarsBartender() {
    const [barras, setBarras] = useState<Bar[]>([]);

    useEffect(() => {
        const loadBarsData = async () => {
            // 2. CORRECCIÓN EN LA ANOTACIÓN DE TIPO: Se usa 'BartenderSession'.
            const session: BartenderSession | null = await getBartenderSession();
            
            if (session?.bars) {
                setBarras(session.bars);
            }
        };
        loadBarsData();
    }, []);
    
    const handleLogout = async () => {
        await clearBartenderSession();
        router.replace('/'); 
    };

    const handleItemPress = (barra: Bar) => {
        if (!barra.idlista) {
            console.log('Error: Esta barra no tiene una lista asignada.');
            return;
        }
        router.push({ 
            pathname: '/stock', 
            params: { listId: barra.idlista, barId: barra.id, barTitle: barra.nombrebarra } 
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selecciona tu Barra</Text>
            <Text style={styles.textIntrucction}>Elige una barra para realizar el inventario</Text>
            <ScrollView style={styles.barsContainer}>
                {barras.length > 0 ? (
                    barras.map((barra) => (
                        <TouchableOpacity 
                            style={styles.itemContainer} 
                            key={barra.id} 
                            onPress={() => handleItemPress(barra)}
                        >
                            <Text style={styles.text}>{barra.nombrebarra}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.text}>Cargando barras disponibles...</Text>
                )}
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button title='Salir' variant='secondary' onPress={handleLogout} />
            </View>
        </View>
    );
}

// ... (los estilos se mantienen igual)
const styles = StyleSheet.create({
    container: {
        minHeight: '100%',
        position: 'relative',
        backgroundColor: Colors.dark.background,
        paddingBlock: 40,
    },
    title: {
        color: Colors.dark.text,
        height: 80,
        lineHeight: 80,
        paddingInline: 60,
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        fontSize: 24,
        fontWeight: '700',
        borderColor: Colors.dark.text,
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
        height: 33,
        paddingInline: 5,
        display: 'flex',
        justifyContent: 'center',
        marginBlock: 6,
    },
    text: {
        color: Colors.dark.text,
        textTransform: 'uppercase',
    },
    textIntrucction: {
        color: Colors.dark.text,
        textAlign: 'center',
        marginBlock: 20,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    buttonContainer: {
        padding: 20,
        display: 'flex',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: Colors.dark.text,
    }
});
