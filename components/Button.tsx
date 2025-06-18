import { TouchableOpacity, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';

type Variant = 'primary' | 'secondary';
type Size = 'default' | 'small' | 'big';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: Variant;
    size?: Size;
    isCentered?: boolean
}
export const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'default',
    isCentered = false,
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
        <Pressable
            style={({ hovered }) => [hovered && styles.buttonHoverEffect, hovered && styles.hoveredSecondary, isCentered && styles.centeredButton]
            }
        >
            <TouchableOpacity
                onPress={onPress}
                style={[styles.container, variants[variant].container, sizes[size].container]}
            >
                <Text style={[styles.text, variants[variant].text, sizes[size].text]}>{title}</Text>
            </TouchableOpacity>

        </Pressable >
    );
}

const styles = StyleSheet.create({
    centeredButton: {
        marginInline: 'auto',
    },
    container: {
        borderWidth: 1,
        borderStyle: 'solid',
    },
    text: {
        fontSize: 15,
        textTransform: 'uppercase',
        marginBlock: 'auto',
        textAlign: 'center',
    },
    buttonHoverEffect: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
    },
    hoveredSecondary: {
        backgroundColor: Colors.dark.black,
    },
});
