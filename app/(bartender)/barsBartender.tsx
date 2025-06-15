import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/Button';
import { router } from 'expo-router';
import { clearSession } from '@/utils/session';

export default function barsBartender() {
    const barras = [
        { id: 0, name: 'Barra Norte', list: 1 },
        { id: 1, name: 'Barra Sur', list: 2 },
        { id: 2, name: 'Barra Central', list: 3 },
        { id: 3, name: 'Barra del Mar', list: 4 },
        { id: 4, name: 'Barra Andina', list: 5 },
        { id: 5, name: 'Barra del Puerto', list: 4 },
        { id: 6, name: 'Barra Altiplánica', list: 3 },
        { id: 7, name: 'Barra Estación', list: 5 },
        { id: 8, name: 'Barra de la Bahía', list: 6 },
        { id: 10, name: 'Barra Cordillerana 1', list: 1 },
        { id: 11, name: 'Barra Cordillerana 2', list: 1 },
        { id: 12, name: 'Barra Cordillerana 3', list: 3 },
        { id: 13, name: 'Barra Cordillerana 4', list: 4 },
        { id: 14, name: 'Barra Cordillerana 5', list: 5 },
        { id: 15, name: 'Barra Cordillerana 6', list: 3 },
        { id: 16, name: 'Barra Cordillerana 7', list: 1 },
        { id: 17, name: 'Barra Cordillerana 8', list: 2 },
        { id: 18, name: 'Barra Cordillerana 9', list: 1 },
    ];
    const handleLogout = async () => {
        await clearSession();
        router.replace('/');
    }
    const handleItemPress = (barra: { id: number, name: string, list: number }) => {
        if (!barra.list || barra.list == undefined) {
            console.log('Error: Not valid lists has been asigned to this bar');
        }
        router.push({ pathname: '/stock', params: { listId: barra.list, barId: barra.id, barTitle: barra.name } });
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Barras
            </Text>
            <Text style={styles.textIntrucction}>  Selecciona una barra para realizar inventario</Text>
            <ScrollView style={styles.barsContainer}>
                {
                    barras.map((barra) => (
                        <TouchableOpacity style={styles.itemContainer} key={barra.id} onPress={() => { handleItemPress(barra) }}>
                            <Text style={styles.text}>{barra.name}</Text>
                        </TouchableOpacity>
                    ))
                }
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button title='Salir' variant='secondary' onPress={handleLogout} />
            </View>
        </View>
    );
}

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
        fontWeight: 700,
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
        fontWeight: 700,
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
