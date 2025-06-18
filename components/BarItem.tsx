import { View, Text, Pressable, StyleSheet, TextInput, Modal, FlatList, TouchableOpacity } from 'react-native';
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
                {assignedList ? assignedList.title : 'Ninguna'}
            </Text>
            <View style={styles.buttonContainer}>
                {isEditing ? (
                    <>
                        <Button title="Guardar" variant="primary" onPress={handleSave} />
                        <Button title="Cancelar" variant="secondary" onPress={handleCancel} />
                    </>
                ) : (
                    <>
                        <Button title="Asignar Lista" size="big" variant={assignedList ? 'secondary' : 'primary'} onPress={() => setModalVisible(true)} />
                        <Button title="Renombrar" variant="secondary" onPress={() => setIsEditing(true)} />
                        <Button title="Eliminar" variant="secondary" onPress={onDelete} />
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
                            style={styles.listContainer}
                            data={lists}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item, index }) => (
                                <Pressable
                                    style={({ hovered }) => [hovered && { backgroundColor: Colors.dark.black }]}
                                >
                                    <TouchableOpacity
                                        style={[styles.listItem, index == 0 && { borderTopWidth: 1 }]}
                                        onPress={() => {
                                            onAssignList(item.id);
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.listText}>{item.title}</Text>
                                    </TouchableOpacity>

                                </Pressable>
                            )}
                        />
                        <View style={styles.buttonWrapper}>
                            <Button title="Cerrar" variant="secondary" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderColor: Colors.dark.text,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingInline: 10,
        paddingBlock: 10,
    },
    title: {
        fontSize: 16,
        textAlign: 'left',
        color: Colors.dark.text,
        flex: 1,
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
        height: '90%',
        maxWidth: 600,
        display: 'flex',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        color: Colors.dark.text,
        textTransform: 'uppercase',
        width: '100%',
        textAlign: 'center',
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderColor: Colors.dark.text,
    },
    listContainer: {
        width: '100%',
    },
    buttonWrapper: {
        paddingBlock: 10,
        borderTopWidth: 1,
        borderColor: Colors.dark.text,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    listItem: {
        paddingVertical: 10,
        paddingInline: 10,
        borderBottomWidth: 1,
        borderInlineWidth: 1,
        borderColor: Colors.dark.text,
    },
    listText: {
        color: Colors.dark.text,
        fontSize: 16,
    },
    listAssigned: {
        fontSize: 16,
        color: Colors.dark.primary,
        marginEnd: 40,
        marginStart: 20,
    },
});
