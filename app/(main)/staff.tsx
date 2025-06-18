import { View, Text, StyleSheet, Alert, ScrollView, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { StaffItem } from '@/components/StaffItem';
import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchBartendersPorAdminConBarra, createBartender, updateBartender, deleteBartender } from '@/utils/BartenderService';
import {Pin} from '@/components/Pin'

export default function Staff() {
    const [staff, setStaff] = useState<{ id: number; name: string }[]>([]);
    const [adminId, setAdminId] = useState<number | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [newBartenderName, setNewBartenderName] = useState('');

    const loadBartenders = async (adminIdToUse: number) => {
        try {
            const bartendersData = await fetchBartendersPorAdminConBarra(adminIdToUse);
            const formatted = bartendersData.map((b: any) => ({
                id: b.id,
                name: b.nombre,
            }));
            setStaff(formatted);
        } catch (error) {
            console.error("Error cargando bartenders:", error);
        }
    };

    useEffect(() => {
        const fetchAdminId = async () => {
            const idString = await AsyncStorage.getItem('id');
            const parsedId = idString ? parseInt(idString, 10) : null;
            if (parsedId !== null) {
                setAdminId(parsedId);
                loadBartenders(parsedId);
            }
        };
        fetchAdminId();
    }, []);

    const handleCreateStaff = () => setModalVisible(true);

    const handleSave = async () => {
        if (!adminId) return Alert.alert("Error", "ID de administrador no encontrado");

        if (!newBartenderName || newBartenderName.trim() === '') {
            return Alert.alert("Error", "Debe ingresar un nombre válido.");
        }

        try {
            await createBartender({
                nombre: newBartenderName.trim(),
                idadministrador: adminId,
            });
            await loadBartenders(adminId);
            setNewBartenderName('');
            setModalVisible(false);
        } catch (error: any) {
            Alert.alert("Error", error.message || "No se pudo crear el bartender.");
        }
    };

    const renamePerson = async (id: number, newName: string) => {
        try {
            await updateBartender(id, { nombre: newName.trim() });
            await loadBartenders(adminId!);
            Alert.alert("Éxito", "Nombre actualizado.");
        } catch (error: any) {
            Alert.alert("Error", error.message || "No se pudo actualizar el bartender.");
        }
    };

    const deletePerson = async (id: number) => {
        try {
            await deleteBartender(id);
            await loadBartenders(adminId!);
            Alert.alert("Éxito", "Bartender eliminado.");
        } catch (error: any) {
            Alert.alert("Error", error.message || "No se pudo eliminar el bartender.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Personal</Text>
            <Pin/>
            <ScrollView style={styles.barsContainer}>
                {staff.map((item, index) => (
                    <StaffItem
                        key={item.id}
                        title={item.name}
                        isLastItem={index === staff.length - 1}
                        onDelete={() => deletePerson(item.id)}
                        onRename={(newName) => renamePerson(item.id, newName)}
                    />
                ))}
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button title='Crear Bartender' size='big' onPress={handleCreateStaff} />
            </View>

            <Modal transparent visible={modalVisible} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Crear Bartender</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre del bartender"
                            placeholderTextColor="#999"
                            value={newBartenderName}
                            onChangeText={setNewBartenderName}
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>GUARDAR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>CANCELAR</Text>
                            </TouchableOpacity>
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
        fontWeight: '500',
        borderColor: Colors.dark.text,
    },
    barsContainer: {
        marginInline: 60,
        marginTop: 60,
    },
    buttonContainer: {
        height: 80,
        borderTopWidth: 1,
        borderColor: Colors.dark.text,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#1e1e1e',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 20,
        width: 400, // ancho fijo más estrecho
        maxWidth: '90%',
    }, 

    modalTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        color: '#fff',
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: '#f1b100',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    saveButtonText: {
        fontWeight: 'bold',
    },
    cancelButton: {
        borderColor: '#f1b100',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    cancelButtonText: {
        color: '#f1b100',
        fontWeight: 'bold',
    },
});
