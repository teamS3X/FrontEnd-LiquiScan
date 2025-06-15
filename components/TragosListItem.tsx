import { View, TouchableOpacity, Image, Text, StyleSheet, ImageSourcePropType } from 'react-native';
import { Colors } from '@/constants/Colors';


interface ItemProps {
    title: string;
    path?: ImageSourcePropType;
    selected?: boolean;
}
export const TragosListItem = ({
    title,
    path = require('@/assets/images/trago.jpg'),
    selected = false,
}: ItemProps) => {
    return (
        <View style={styles.container}>
            <Image
                source={path}
                style={styles.image}
            />
            <Text style={styles.text}>{title}</Text>
            <View style={[styles.checkBox, selected ? styles.checkSelected : styles.checkUnselected]}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.dark.text,
        width: 150,
        height: 180,
        backgroundColor: Colors.dark.background,
        display: 'flex',
        alignItems: 'center',
        paddingTop: 10,
    },
    image: {
        width: 90,
        height: 100,
        objectFit: 'cover',
    },
    text: {
        fontSize: 12,
        fontWeight: 500,
        marginTop: 8,
        paddingInline: 15,
        color: Colors.dark.text,
    },
    checkBox: {
        width: 20,
        height: 20,
        borderStyle: 'solid',
        borderWidth: 1,
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    checkSelected: {
        borderColor: Colors.dark.primary,
        backgroundColor: Colors.dark.primary,
    },
    checkUnselected: {
        borderColor: Colors.dark.text,
        backgroundColor: Colors.dark.background,
    }
});
