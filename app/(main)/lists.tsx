import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TragosList } from '@/components/TragosList';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Dropdown } from '@/components/Dropdown';
import { Pin } from '@/components/Pin';
import { Drink } from '@/types/drinks';
import { createList, fetchAlcoholes, saveAlcoholListRelation } from '@/utils/listsService';

export default function Lists() {
    const { width, height } = useWindowDimensions();
    const [showModal, setShowModal] = useState(false);
    const [editedListItems, setEditedListItems] = useState<Drink[]>([]);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const [drinkslist, setDrinksList] = useState<Drink[]>([]);

    const [categories, setCategories] = useState<string[]>([]);


    useEffect(() => {
        const loadDrinks = async () => {
            try {
                const data = await fetchAlcoholes();
                const tempCategories = [...new Set(data.map((item: any) => item.categoria))] as string[];
                setDrinksList(data);
                setCategories(tempCategories);
            } catch (error) {
                console.error("Failed to load drinks:", error);
            }
        };
        const loadLists = async () => {
            try {

            }
            catch (error) {
                console.error("Failed to load lists:", error);
            }
        }
        loadDrinks();
    }, []);


    const [lists, setLists] = useState<{ id: number; title: string; items: Drink[] }[]>([]);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [selected, setSelected] = useState<Drink[]>([]);
    const [newListName, setNewListName] = useState('');

    const selectedList = selectedListId != null
        ? lists.find(list => list.id === selectedListId)
        : null;

    const selectedTragos = selectedList ? selectedList.items : selected;

    const handleSaveList = async () => {
        if (newListName === '') {
            console.log('Ingresa nombre de la nueva lista');
            return;
        };
        const idList = await createList({ nombre: newListName });
        selected.forEach((s) => {
            console.log("idLista:", idList.id);
            console.log('idTrago:', s.id)
            saveAlcoholListRelation({ idlista: idList.id, idalcohol: s.id })
        })
        console.log(selected);
        // const newList = {
        // title: newListName.trim(),
        // items: selected,
        // id: lists.length,
        // };
        // setLists(prev => [...prev, newList]);
        setShowModal(false);
        // setSelectedListId(newList.id)
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
                {categories.map((c: string) => (
                    <TragosList
                        key={c}
                        title={c}
                        selectedList={selectedTragos}
                        setSelected={updateSelectedTragos}
                        list={drinkslist.filter((item: any) => item.categoria === c)}
                    />
                ))}

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
