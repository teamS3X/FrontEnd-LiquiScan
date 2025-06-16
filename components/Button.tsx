import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

type Variant = 'primary' | 'secondary';
type Size = 'default' | 'small' | 'big';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: Variant;
    size?: Size;
}
export const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'default',
}: ButtonProps) => {
    // Variantes de colores
    const variants = {
        primary: {
            container: {
                backgroundColor: Colors.dark.primary,
                borderColor: Colors.dark.primary,
            },
            text: {
                color: Colors.dark.background,
            },
        },
        secondary: {
            container: {
                backgroundColor: Colors.dark.background,
                borderColor: Colors.dark.primary,
            },
            text: {
                color: Colors.dark.primary,
            },
        },
    }
    // Variantes de tamanos
    const sizes = {
        default: {
            container: {
                width: 120,
                height: 40,
            },
            text: {
                fontSize: 16,
            }
        },
        big: {
            container: {
                width: 340,
                height: 40,
            },
            text: {
                fontSize: 16,
            }
        },
        small: {
            container: {
                width: 120,
                height: 20,
            },
            text: {
                fontSize: 9,
            }
        }
    }
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, variants[variant].container, sizes[size].container]}
        >
            <Text style={[styles.text, variants[variant].text, sizes[size].text]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderStyle: 'solid',
    },
    text: {
        fontSize: 15,
        textTransform: 'uppercase',
        marginBlock: 'auto',
        textAlign: 'center',
    }
});