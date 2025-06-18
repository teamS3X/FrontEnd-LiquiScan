import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import CategorySection from '@/components/CategorySection';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Dropdown } from '@/components/Dropdown';
import { Pin } from '@/components/Pin';
import { Drink } from '@/types/drinks';
import {
    createList,
    fetchAlcoholes,
    saveAlcoholListRelation,
    fetchListsByAdmin,
    fetchAlcoholListRelationsByListId,
} from '@/utils/listsService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Lists() {
    const { width, height } = useWindowDimensions();
    const [showModal, setShowModal] = useState(false);
    const [drinkslist, setDrinksList] = useState<Drink[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [idadmin, setidadmin] = useState<number | null>(null);
    const [lists, setLists] = useState<{ id: number; title: string; items: Drink[] }[]>([]);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [selectedList, setSelectedList] = useState<number[]>([]);
    const [newListName, setNewListName] = useState('');
    const [listDrinkRelation, setListDrinkRelation] = useState([]);

    const fetchLists = async () => {
        if (idadmin !== null) {
            try {
                const listsData = await fetchListsByAdmin(idadmin);
                const listsWithItems = await Promise.all(
                    listsData.map(async (list: any) => {
                        const relations = await fetchAlcoholListRelationsByListId(list.id);
                        const items = relations.map((rel: any) => ({ id: rel.idalcohol }));
                        return {
                            id: list.id,
                            title: list.nombre,
                            items: items,
                        };
                    })
                );
                setLists(listsWithItems);
            } catch (error) {
                console.error("Failed to fetch lists by admin:", error);
            }
        }
    };

    const fetchListDrinkRelation = async () => {
        if (selectedListId != null) {
            const listDrinks = await fetchAlcoholListRelationsByListId(selectedListId);
            const newList = listDrinks.filter((relation: any) => relation.idlista === selectedListId);
            setListDrinkRelation(listDrinks);
            const alcoholIds = newList.map((item: any) => item.idalcohol);
            setSelectedList(alcoholIds);
        } else {
            setSelectedList([]);
        }
    };

    const updateSelectedList = (newSelected: number[]) => {
        setSelectedList(newSelected);
    };

    const handleSaveList = async () => {
        if (newListName === '') {
            console.log('Ingresa nombre de la nueva lista');
            return;
        }
        const idList = await createList({ nombre: newListName, idadministrador: idadmin });
        for (const s of selectedList) {
            const relation = { idlista: idList.id, idalcohol: s };
            await saveAlcoholListRelation(relation);
        }
        setShowModal(false);
        fetchLists();
        fetchListDrinkRelation();
        setSelectedListId(idList.id);
    };

    const handleDeleteList = () => {
        if (selectedListId == null) return;
        setLists(prev => prev.filter(l => l.id !== selectedListId));
        setSelectedListId(null);
    };

    const handleToggleCategory = (category: string, selectAll: boolean) => {
        const filteredIds = drinkslist.filter((item: any) => item.categoria === category).map(item => item.id);
        if (selectAll) {
            const newSelection = Array.from(new Set([...selectedList, ...filteredIds]));
            setSelectedList(newSelection);
        } else {
            const newSelection = selectedList.filter(id => !filteredIds.includes(id));
            setSelectedList(newSelection);
        }
    };

    const handleSelectAll = () => {
        const allIds = drinkslist.map(d => d.id);
        setSelectedList(allIds);
    };

    const handleDeselectAll = () => {
        setSelectedList([]);
    };

    const getButtonLabel = (category: string, selectAll: boolean): string => {
        const categoryUpper = category.toUpperCase();
        if (categoryUpper === 'CERVEZAS') {
            return selectAll ? `Seleccionar todas las ${category}` : `Deseleccionar todas las ${category}`;
        } else if (categoryUpper === 'OTROS') {
            return selectAll ? `Seleccionar todos de ${category}` : `Deseleccionar todos de ${category}`;
        } else {
            return selectAll ? `Seleccionar todos los ${category}` : `Deseleccionar todos los ${category}`;
        }
    };

    useEffect(() => {
        const getid = async () => {
            const idString = await AsyncStorage.getItem('id');
            const idadmin = idString ? parseInt(idString, 10) : null;
            setidadmin(idadmin);
        };
        getid();
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
        loadDrinks();
    }, []);

    useEffect(() => {
        fetchLists();
        fetchListDrinkRelation();
    }, [idadmin]);

    useEffect(() => {
        fetchListDrinkRelation();
    }, [selectedListId]);

    return (
        <>
            <View style={styles.topBarContainer}>
                <Dropdown placeholder='Selecciona una lista' lists={lists} selectedId={selectedListId} onSelect={setSelectedListId} />
                <View style={styles.topBarBottom}>
                    <Text style={styles.countText}> SELECCIONADOS: {selectedList.length}</Text>
                    <Button title='Seleccionar todos' variant='secondary' size='small' onPress={handleSelectAll} />
                    <Button title='Deseleccionar todos' variant='secondary' size='small' onPress={handleDeselectAll} />
                </View>
                <Pin />
            </View>
            <ScrollView style={styles.container}>
                {categories.map((c: string, index: number) => (
                    <View key={c} style={styles.sectionWrapper}>
                        {index !== 0 && <View style={styles.sectionDivider} />}
                        <CategorySection
                            category={c}
                            drinkslist={drinkslist}
                            selectedList={selectedList}
                            updateSelectedList={updateSelectedList}
                            getButtonLabel={getButtonLabel}
                            handleToggleCategory={handleToggleCategory}
                        />
                    </View>
                ))}
            </ScrollView>
            {selectedListId !== null ? (
                <View style={styles.buttonContainer}>
                    <Button title='Guardar Lista' size='big' onPress={() => console.log('guardar')} />
                    <Button title='Eliminar lista' size='big' variant='secondary' onPress={handleDeleteList} />
                </View>
            ) : (
                <View style={styles.buttonContainer}>
                    <Button title="Crear lista" onPress={() => { setShowModal(true) }} size='big' />
                </View>
            )}
            {showModal && (
                <View style={[styles.modalContainer, { width: width, height: height }]}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTittle}>CREAR LISTA</Text>
                        <Input placeholder='Ingresa nombre de lista' value={newListName} onChange={setNewListName} />
                        <View style={styles.modalButtonContainer}>
                            <Button title='Aceptar' onPress={handleSaveList} />
                            <Button title='Cancelar' variant='secondary' onPress={() => { setShowModal(false); setNewListName('') }} />
                        </View>
                    </View>
                </View>
            )}
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
    countText: {
        color: Colors.dark.text,
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
    sectionWrapper: {
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
},
sectionDivider: {
    height: 1,
    backgroundColor: Colors.dark.text,
    marginVertical: 0, // quita espacio arriba y abajo
},
});
