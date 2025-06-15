import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAdminPin, AdminPinData, regeneratePin } from '@/utils/PinService';

export const Pin = () => {
    const [pin, setPin] = useState<number | null>(null);
    const [pinCreatedAt, setPinCreatedAt] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchPinData = async () => {
        const idString = await AsyncStorage.getItem('id');
        const adminId = idString ? parseInt(idString, 10) : null;
        if (adminId !== null) {
            const pinData: AdminPinData | null = await getAdminPin(adminId);
            if (pinData) {
                setPin(pinData.pin);
                setPinCreatedAt(pinData.pin_created_at);
            }
        }
    };

    useEffect(() => {
        fetchPinData();
    }, []);

    const handleRegeneratePin = async () => {
        setLoading(true);
        const idString = await AsyncStorage.getItem('id');
        const adminId = idString ? parseInt(idString, 10) : null;
        if (adminId !== null) {
            const success = await regeneratePin(adminId, true);
            if (success) {
                await fetchPinData();
            } else {
                console.error('Failed to regenerate pin');
            }
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>PIN: {pin !== null ? pin : 'N/A'}</Text>
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRegeneratePin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Regenerar PIN</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 120,
        height: 110,
        position: 'absolute',
        top: 10,
        right: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.dark.primary,
        marginBottom: 0,
    },
    button: {
        borderWidth: 1,
        borderColor: Colors.dark.primary,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 4,
        backgroundColor: 'transparent',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: Colors.dark.primary,
        fontWeight: '500',
        fontSize: 14,
        textAlign: 'center',
    },
});
