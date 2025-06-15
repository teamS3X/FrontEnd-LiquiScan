import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { StaffItem } from '@/components/StaffItem';
import { useState } from 'react';
import { Button } from '@/components/Button';

export default function Staff() {
    const [staff, setStaff] = useState([
        { id: 0, name: 'Many' },
        { id: 1, name: 'Luna' },
        { id: 2, name: 'Alma' },
        { id: 3, name: 'Lizzy' },
        { id: 4, name: 'Chica' },
    ]);
    const renamePerson = (id: number, newName: string) => {
        setStaff(prev =>
            prev.map(person => (person.id === id ? { ...person, name: newName } : person))
        );
    };
    const deletePerson = (id: number) => {
        setStaff(prev => prev.filter(person => person.id !== id));
    };
    const handleCreateStaff = () => {

    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Personal
            </Text>
            <View style={styles.barsContainer}>
                {staff.map((item, index) => (
                    <StaffItem
                        key={item.id}
                        title={item.name}
                        isLastItem={index === (staff.length - 1)}
                        onDelete={() => deletePerson(item.id)}
                        onRename={(newName) => renamePerson(item.id, newName)}
                    />
                ))}
            </View>

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
