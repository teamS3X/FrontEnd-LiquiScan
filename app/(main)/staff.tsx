import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { StaffItem } from '@/components/StaffItem';
import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchBartendersPorAdminConBarra, createBartender, updateBartender, deleteBartender } from '@/utils/BartenderService';

export default function Staff() {
    const [staff, setStaff] = useState<{ id: number; name: string }[]>([]);
    const [adminId, setAdminId] = useState<number | null>(null);

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

    const handleCreateStaff = async () => {
        if (!adminId) return Alert.alert("Error", "ID de administrador no encontrado");

        const newName = prompt("Ingrese nombre del nuevo bartender:");

        if (!newName || newName.trim() === '') {
            return Alert.alert("Error", "Debe ingresar un nombre válido.");
        }

        try {
            const newBartender = {
                nombre: newName.trim(),
                idadministrador: adminId,
            };

            await createBartender(newBartender);
            await loadBartenders(adminId);
            Alert.alert("Éxito", `Bartender "${newName}" creado correctamente.`);
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
