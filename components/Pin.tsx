import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';


interface PinProps {
    pin: number;
}
export const Pin = ({
    pin,
}: PinProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>PIN: {pin}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 90,
        height: 70,
        position: 'absolute',
        top: 10,
        right: 60,
        display: 'flex',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 500,
        color: Colors.dark.primary,
    },
});
