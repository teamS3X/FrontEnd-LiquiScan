import React, { useState } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    Modal,
} from 'react-native';
import { Colors } from '@/constants/Colors';

type Drink = {
    id: number,
    title: string,
    image: string,
}

interface List {
    title: string;
    items: Drink[];
    id: number;
}

interface DropdownProps {
    placeholder: string;
    lists: List[];
    selectedId: number | null;
    onSelect: (id: number | null) => void;
}

export const Dropdown = ({
    placeholder,
    lists,
    selectedId,
    onSelect,
}: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedList = lists.find((list) => list.id === selectedId);

    const handleSelect = (id: number | null) => {
        onSelect(id);
        setIsOpen(false);
    };

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                style={styles.container}
                onPress={() => setIsOpen(!isOpen)}
            >
                <Text style={styles.text}>
                    {selectedList ? selectedList.title : placeholder}
                </Text>
            </TouchableOpacity>

            <Modal visible={isOpen} transparent animationType="fade">
                <TouchableOpacity style={styles.overlay} onPress={() => setIsOpen(false)}>
                    <View style={styles.dropdown}>
                        <TouchableOpacity
                            key={-1}
                            style={styles.createList}
                            onPress={() => handleSelect(null)}
                        >
                            <Text style={styles.createListText}>Crear nueva lista</Text>
                        </TouchableOpacity>
                        {lists.map((list) => (
                            <TouchableOpacity
                                key={list.id}
                                style={styles.item}
                                onPress={() => handleSelect(list.id)}
                            >
                                <Text style={styles.itemText}>{list.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        zIndex: 10,
    },
    container: {
        width: 400,
        height: 27,
        borderBottomWidth: 1,
        borderColor: Colors.dark.text,
        backgroundColor: Colors.dark.background,
    },
    text: {
        fontSize: 15,
        color: Colors.dark.text,
        textTransform: 'uppercase',
        textAlign: 'left',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        backgroundColor: Colors.dark.background,
        borderWidth: 1,
        borderColor: Colors.dark.text,
        width: 250,
        borderRadius: 5,
    },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.text,
    },
    itemText: {
        color: Colors.dark.text,
    },
    createList: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: Colors.dark.text,
        backgroundColor: Colors.dark.softHighlight,
    },
    createListText: {
        color: Colors.dark.text,
    }
});

