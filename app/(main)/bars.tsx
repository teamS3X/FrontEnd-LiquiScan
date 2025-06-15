import { View, Text, StyleSheet, TextInput, Modal } from 'react-native';
import { Colors } from '@/constants/Colors';
import { BarItem } from '@/components/BarItem';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBarra,createBarraValidando } from '@/utils/barService';
import API_URL from '@/constants/Api';




interface Lista {
  id: number;
  title: string;
}

export default function Bars() {
  const [barras, setBarras] = useState<{ id: number; name: string; list: number }[]>([]);
  const [lists, setLists] = useState<Lista[]>([]);  // Estado dinámico para listas

  useEffect(() => {
    const loadData = async () => {
      try {
        const idString = await AsyncStorage.getItem('id');
        const adminId = idString ? parseInt(idString, 10) : null;
        if (adminId === null) throw new Error("ID de administrador no encontrado");

        // Fetch barras
        const barrasResponse = await fetch(`${API_URL}/barra/${adminId}/filtrar_barra/`);
        if (!barrasResponse.ok) throw new Error("Error al obtener barras");
        const barrasData = await barrasResponse.json();
        const barrasTransformadas = barrasData.map((barra: any) => ({
          id: barra.id,
          name: barra.nombrebarra,
          list: barra.idlista,
        }));
        setBarras(barrasTransformadas);

        // Fetch listas
        const listasResponse = await fetch(`${API_URL}/Lista_de_alcohol/${adminId}/filtrar_lista/`);
        if (!listasResponse.ok) throw new Error("Error al obtener listas");
        const listasData = await listasResponse.json();
        // Transformar si es necesario (según estructura que devuelva tu backend)
        const listasTransformadas = listasData.map((lista: any) => ({
          id: lista.id,
          title: lista.nombre,  // Ajusta aquí si el campo se llama distinto
        }));
        setLists(listasTransformadas);

      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);


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
    const [showModal, setShowModal] = useState(false);
    const [newBarName, setNewBarName] = useState('');

    const handleCreateBar = () => {
        setShowModal(true);
    };

const handleSaveBar = async () => {
    try {
        const idString = await AsyncStorage.getItem('id');
        const adminId = idString ? parseInt(idString, 10) : null;
        if (adminId === null) throw new Error("ID de administrador no encontrado");

        const newBar = await createBarraValidando(adminId, newBarName);

        // Ya lo verificaste arriba manualmente, por eso TypeScript permite esto con "!"
        if (newBar.id === undefined) throw new Error("La barra creada no tiene ID");

        setBarras(prev => [
            ...prev,
            { id: newBar.id!, name: newBar.nombrebarra, list: newBar.idlista }
        ]);

        setShowModal(false);
        setNewBarName('');
    } catch (error) {
    if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.error(error);
    }
}
};

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
            <Modal
                visible={showModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Crear Barra</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de la barra"
                            value={newBarName}
                            onChangeText={setNewBarName}
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Guardar" onPress={handleSaveBar} />
                            <Button title="Cancelar" variant="secondary" onPress={() => setShowModal(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 400,
        backgroundColor: Colors.dark.background,
        padding: 20,
        borderRadius: 8,
        borderColor: Colors.dark.text,
        borderWidth: 1,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.dark.text,
        borderRadius: 4,
        padding: 10,
        color: Colors.dark.text,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
    },
});
