import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import { Button } from '@/components/Button';

interface ItemProps {
    title: string,
    isLastItem?: boolean,
    onDelete: () => void,
    onRename?: (newName: string) => void;
}
export const StaffItem = ({
    title,
    isLastItem = false,
    onDelete,
    onRename,
}: ItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(title);

    const handleSave = () => {
        if (onRename) onRename(tempName.trim());
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempName(title);
        setIsEditing(false);
    };
    return (
        <View style={[styles.container, isLastItem && { borderBottomWidth: 1 }]}>
            {isEditing ? (
                <TextInput
                    style={[styles.title, styles.input]}
                    value={tempName}
                    onChangeText={setTempName}
                    autoFocus
                />
            ) : (
                <Text style={styles.title}>{title}</Text>
            )}
            <View style={styles.buttonContainer}>
                {isEditing ? (
                    <>
                        <Button title="Guardar" variant="primary" size="small" onPress={handleSave} />
                        <Button title="Cancelar" variant="secondary" size="small" onPress={handleCancel} />
                    </>
                ) : (
                    <>
                        <Button title="Editar" variant="secondary" size="small" onPress={() => setIsEditing(true)} />
                        <Button title="Eliminar" variant="secondary" size="small" onPress={onDelete} />
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        borderColor: Colors.dark.text,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingInline: 10,
    },
    title: {
        fontSize: 15,
        textAlign: 'left',
        color: Colors.dark.text,
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
    },
    input: {

    }
});
