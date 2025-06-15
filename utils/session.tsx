import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';


// Elegir almacenamiento según plataforma
const storage = {
    setItem: async (key: string, value: string) => {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, value);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    },
    getItem: async (key: string) => {
        if (Platform.OS === 'web') {
            return localStorage.getItem(key);
        } else {
            return await SecureStore.getItemAsync(key);
        }
    },
    deleteItem: async (key: string) => {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    },
};

// Funciones de sesión
export async function saveSession({ token, user }: { 
    token: string; 
    user: { 
        id: number;
        correoelectronico: string;
        role: string;
    } 
}) {
    await storage.setItem('token', token);
    await storage.setItem('role', user.role);
    await storage.setItem('correoelectronico', user.correoelectronico);
    await storage.setItem('id', user.id.toString());
}

export async function getSession() {
    const token = await storage.getItem('token');
    const role = await storage.getItem('role');
    const correoelectronico = await storage.getItem('correoelectronico');
    const id = await storage.getItem('id');
    return { token, correoelectronico, role, id };
}

export async function clearSession() {
    await storage.deleteItem('token');
    await storage.deleteItem('role');
    await storage.deleteItem('correoelectronico');
    await storage.deleteItem('id');
}
