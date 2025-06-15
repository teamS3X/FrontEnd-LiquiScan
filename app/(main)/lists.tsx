import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TragosList } from '@/components/TragosList';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Dropdown } from '@/components/Dropdown';
import { Pin } from '@/components/Pin';


type Drink = {
    id: number,
    title: string,
    image: string,
}
export default function Lists() {
    const { width, height } = useWindowDimensions();
    const [showModal, setShowModal] = useState(false);
    const [editedListItems, setEditedListItems] = useState<Drink[]>([]);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const piscos = [
        {
            id: 0,
            title: "Pisco Mistral 46° 750cc",
            image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1",
        },
        {
            id: 1,
            title: "Pisco Alto del Carmen 40° 700cc",
            image: "https://images.unsplash.com/photo-1610641812407-0b1a5c3a6f2f",
        },
        {
            id: 2,
            title: "Pisco Capel Reservado 35° 1L",
            image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b",
        },
        {
            id: 3,
            title: "Pisco Control C 40° 750cc",
            image: "https://images.unsplash.com/photo-1564758866819-71f08c1b6b2d",
        },
        {
            id: 4,
            title: "Pisco Horcón Quemado 46° 700cc",
            image: "https://images.unsplash.com/photo-1603052877778-b0c7b7a6c0e0",
        },
        {
            id: 5,
            title: "Pisco Fundo Los Nichos 40° 750cc",
            image: "https://images.unsplash.com/photo-1612036784852-0a7b1fd8b93e",
        },
    ];

    const rones = [
        {
            id: 6,
            title: "Ron Abuelo Añejo 7 años 750cc",
            image: "https://images.unsplash.com/photo-1605276375725-f6c4213c9d84",
        },
        {
            id: 7,
            title: "Ron Diplomático Reserva Exclusiva 700cc",
            image: "https://images.unsplash.com/photo-1620325811374-9a0187ac9c80",
        },
        {
            id: 8,
            title: "Ron Bacardí Carta Blanca 1L",
            image: "https://images.unsplash.com/photo-1605187167395-78e9de04b6e6",
        },
        {
            id: 9,
            title: "Ron Havana Club Añejo Especial 750cc",
            image: "https://images.unsplash.com/photo-1631049003743-5e3ff535c44c",
        },
        {
            id: 10,
            title: "Ron Barceló Gran Añejo 700cc",
            image: "https://images.unsplash.com/photo-1623437681863-04b5f438c5a9",
        },
        {
            id: 11,
            title: "Ron Zacapa Centenario 23 750cc",
            image: "https://images.unsplash.com/photo-1625581697572-0cf6e73cb255",
        },
        {
            id: 12,
            title: "Ron Flor de Caña 12 años 750cc",
            image: "https://images.unsplash.com/photo-1616094896936-43c1ff381cb4",
        },
    ];

    const vinos = [
        {
            id: 13,
            title: "Vino Concha y Toro Reservado Cabernet Sauvignon 750cc",
            image: "https://images.unsplash.com/photo-1584467735871-02f1d2700105",
        },
        {
            id: 14,
            title: "Vino Casillero del Diablo Carmenere 750cc",
            image: "https://images.unsplash.com/photo-1582572840856-ff33aee2563b",
        },
        {
            id: 15,
            title: "Vino Santa Rita 120 Merlot 750cc",
            image: "https://images.unsplash.com/photo-1562087967-9b9db63429ef",
        },
        {
            id: 16,
            title: "Vino Tarapacá Gran Reserva Etiqueta Negra 750cc",
            image: "https://images.unsplash.com/photo-1528821121074-6c4c1a0a3c3f",
        },
        {
            id: 17,
            title: "Vino Emiliana Adobe Orgánico Syrah 750cc",
            image: "https://images.unsplash.com/photo-1608568255182-308a5be3b36a",
        },
        {
            id: 18,
            title: "Vino Montes Alpha Cabernet Sauvignon 750cc",
            image: "https://images.unsplash.com/photo-1514362545857-cd8563b7e83f",
        },
        {
            id: 19,
            title: "Vino Undurraga Aliwen Reserva Pinot Noir 750cc",
            image: "https://images.unsplash.com/photo-1617191512914-6b6939b6c85d",
        },
    ];


    const [lists, setLists] = useState<{ id: number; title: string; items: Drink[] }[]>([]);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [selected, setSelected] = useState<Drink[]>([]);
    const [newListName, setNewListName] = useState('');

    const selectedList = selectedListId != null
        ? lists.find(list => list.id === selectedListId)
        : null;

    const selectedTragos = selectedList ? selectedList.items : selected;

    const handleSaveList = () => {
        if (newListName === '') {
            console.log('Ingresa nombre de la nueva lista');
            return;
        };
        const newList = {
            title: newListName.trim(),
            items: selected,
            id: lists.length,
        };
        setLists(prev => [...prev, newList]);
        setShowModal(false);
        setSelectedListId(newList.id)
        console.log('Save list', newListName);
    }
    const updateSelectedTragos = (updatedDrinks: Drink[]) => {
        if (selectedListId != null) {
            const updatedLists = lists.map(list =>
                list.id === selectedListId ? { ...list, items: updatedDrinks } : list
            );
            setLists(updatedLists);
        } else {
            setSelected(updatedDrinks);
        }
    };

    const handleDeleteList = () => {
        if (selectedListId == null) return;
        setLists(prev => prev.filter(l => l.id !== selectedListId));
        setSelectedListId(null);
        setEditedListItems([]);
        setUnsavedChanges(false);
    };
    return (
        <>
            <View style={styles.topBarContainer}>
                <Dropdown placeholder='Selecciona una lista' lists={lists} selectedId={selectedListId}
                    onSelect={setSelectedListId} />
                <View style={styles.topBarBottom}>
                    <Text style={styles.countText}> SELECCIONADOS: {selected.length}</Text>
                    <Button title='Seleccionar todos' variant='secondary' size='small' onPress={() => console.log('todos')} />
                    <Button title='Deseleccionar todos' variant='secondary' size='small' onPress={() => console.log('ninguno')} />
                </View>
                <Pin pin={1234} />
            </View>
            <ScrollView style={styles.container}>
                <TragosList
                    title="Piscos"
                    selectedList={selectedTragos}
                    setSelected={updateSelectedTragos}
                    list={piscos}
                />
                <TragosList title='Rones' selectedList={selected} setSelected={setSelected} list={rones} />
                <TragosList title='Vinos' selectedList={selected} setSelected={setSelected} list={vinos} />
            </ScrollView>
            {selectedListId !== null &&
                <View style={styles.buttonContainer}>
                    <Button title='Guardar Lista' size='big' onPress={() => console.log('guardar')} />
                    <Button title='Eliminar lista' size='big' variant='secondary' onPress={handleDeleteList} />
                </View>
            }
            {selectedListId === null &&
                <View style={styles.buttonContainer}>
                    <Button title="Crear lista" onPress={() => { setShowModal(true) }} size='big' />
                </View>
            }
            {showModal &&
                <View style={[styles.modalContainer, { width: width, height: height }]}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTittle}>CREAR LISTA</Text>
                        <Input placeholder='Ingresa nombre de lista' value={newListName} onChange={setNewListName} />
                        <View style={styles.modalButtonContainer}>
                            <Button title='Aceptar' onPress={handleSaveList} />
                            <Button title='Cancelar' variant='secondary' onPress={() => setShowModal(false)} />
                        </View>
                    </View>
                </View>
            }
        </>
    );
}

export const options = {
    title: 'Listas',
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.background,
    },
    topBarContainer: {
        width: '100%',
        height: 110,
        backgroundColor: Colors.dark.background,
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        paddingInline: 60,
        position: 'relative',
        borderBottomWidth: 1,
        borderColor: Colors.dark.text,
    },
    topBarBottom: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    countText: {
        color: Colors.dark.text,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
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
    modalContainer: {
        backgroundColor: Colors.dark.background,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999,
    },
    modal: {
        position: 'fixed',
        width: 520,
        height: 220,
        top: '50%',
        left: '50%',
        backgroundColor: Colors.dark.background,
        borderColor: Colors.dark.text,
        borderWidth: 1,
        transform: [
            { translateX: -260 },
            { translateY: -110 },
        ],
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 13,

    },
    modalTittle: {
        borderBottomWidth: 1,
        borderColor: Colors.dark.text,
        textAlign: 'center',
        width: '100%',
        color: Colors.dark.text,
        fontSize: 20,
    },
    modalButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 30,
    },
});
