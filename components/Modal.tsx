import { View, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';
type Variant = 'default' | 'search' | 'password' | 'mail';
interface InputProps {
    placeholder: string,
    variant?: Variant,
}
export const Modal = ({
    variant = 'default',
    placeholder,
}: InputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isPassword = variant === 'password';
    const isSearch = variant === 'search';
    return (
        <View style={styles.container}>
            <TextInput style={styles.text} placeholder={placeholder} secureTextEntry={isPassword && !isPasswordVisible} />
            {isSearch && (
                <Image source={require('@/assets/images/icon-search.png')} style={styles.icon} />
            )}
            {isPassword && (
                <TouchableOpacity onPress={() => setIsPasswordVisible(prev => !prev)}>
                    <Image
                        source={require('@/assets/images/icon-eye.png')}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 350,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: Colors.dark.text,
        paddingHorizontal: 5,
        display: 'flex',
        flexDirection: 'row',

    },
    text: {
        fontSize: 15,
        textTransform: 'uppercase',
        textAlign: 'left',
        color: Colors.dark.text,
        flex: 1,
    },
    icon: {
        width: 22,
        height: 22,
        objectFit: 'cover',
    }
});
