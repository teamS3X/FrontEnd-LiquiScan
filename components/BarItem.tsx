import { View, Text, StyleSheet, TextInput, Modal, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import { Button } from '@/components/Button';

interface ItemProps {
    title: string,
    isLastItem?: boolean,
    listId?: number,
    onDelete: () => void,
    onRename?: (newName: string) => void;
    onAssignList: (listId: number) => void;
    lists: { id: number; title: string }[];
}
export const BarItem = ({
    title,
    isLastItem = false,
    listId,
    onDelete,
    onRename,
    onAssignList,
    lists,
}: ItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(title);
    const [modalVisible, setModalVisible] = useState(false);
    const assignedList = lists.find((list) => list.id === listId);
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
            <Text style={styles.listAssigned}>
                Lista asignada: {assignedList ? assignedList.title : 'Ninguna'}
            </Text>
            <View style={styles.buttonContainer}>
                {isEditing ? (
                    <>
                        <Button title="Guardar" variant="primary" size="small" onPress={handleSave} />
                        <Button title="Cancelar" variant="secondary" size="small" onPress={handleCancel} />
                    </>
                ) : (
                    <>
                        <Button title="Asignar Lista" variant="primary" size="small" onPress={() => setModalVisible(true)} />
                        <Button title="Editar" variant="secondary" size="small" onPress={() => setIsEditing(true)} />
                        <Button title="Eliminar" variant="secondary" size="small" onPress={onDelete} />
                    </>
                )}
            </View>
            <Modal
                visible={modalVisible}
                animationType='fade'
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecciona una lista</Text>
                        <FlatList
                            data={lists}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.listItem}
                                    onPress={() => {
                                        onAssignList(item.id);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.listText}>{item.title}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <Button title="Cerrar" variant="secondary" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
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

    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: Colors.dark.background,
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        color: Colors.dark.text,
        marginBottom: 10,
    },
    listItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: Colors.dark.text,
    },
    listText: {
        color: Colors.dark.text,
        fontSize: 16,
    },
    listAssigned: {
        fontSize: 12,
        color: Colors.dark.primary,
    },
});
