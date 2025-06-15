import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { BarItem } from '@/components/BarItem';
import { useState } from 'react';
import { Button } from '@/components/Button';

export default function Bars() {
    const [barras, setBarras] = useState([
        { id: 0, name: 'Barra Norte', list: 1 },
        { id: 1, name: 'Barra Sur', list: 2 },
        { id: 2, name: 'Barra Central', list: 3 },
        { id: 3, name: 'Barra del Mar', list: 4 },
        { id: 4, name: 'Barra Andina', list: 1 },
        { id: 5, name: 'Barra del Puerto', list: 4 },
        { id: 6, name: 'Barra Altiplánica', list: 3 },
        { id: 7, name: 'Barra Estación', list: 4 },
        { id: 8, name: 'Barra de la Bahía', list: 2 },
        { id: 9, name: 'Barra Cordillerana', list: 1 },
    ]);

    const lists = [
        {
            id: 1,
            title: 'Lista Tropical',
        },
        {
            id: 2,
            title: 'Lista Clásica',
        },
        {
            id: 3,
            title: 'Lista sin Alcohol',
        },
        {
            id: 4,
            title: 'Lista Premium',
        },
    ];
    const renameBar = (id: number, newName: string) => {
        setBarras(prev =>
            prev.map(barra => (barra.id === id ? { ...barra, name: newName } : barra))
        );
    };
    const deleteBar = (id: number) => {
        setBarras(prev => prev.filter(barra => barra.id !== id));
    };

    const AssignList = (barraId: number, listId: number) => {
        setBarras(prev =>
            prev.map(barra => (barra.id === barraId ? { ...barra, list: listId } : barra))
        );
    };
    const handleCreateBar = () => {

    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Barras
            </Text>
            <View style={styles.barsContainer}>
                {barras.map((item, index) => (
                    <BarItem
                        key={item.id}
                        title={item.name}
                        isLastItem={index === (barras.length - 1)}
                        onDelete={() => deleteBar(item.id)}
                        onRename={(newName) => renameBar(item.id, newName)}
                        onAssignList={(listId) => AssignList(item.id, listId)}
                        listId={item.list}
                        lists={lists}
                    />
                ))}
            </View>
            <View style={styles.buttonContainer}>
                <Button title='Crear Barra' size='big' onPress={handleCreateBar} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.background,
        minHeight: '100%',
    },
    title: {
        color: Colors.dark.text,
        height: 80,
        paddingInline: 60,
        display: 'flex',
        alignItems: 'center',
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        fontSize: 24,
        fontWeight: 500,
        borderColor: Colors.dark.text,
    },
    barsContainer: {
        marginInline: 60,
        marginTop: 60,
    },
    buttonContainer: {
        height: 80,
        backgroundColor: Colors.dark.background,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        borderTopWidth: 1,
        borderColor: Colors.dark.text,
    },
});
