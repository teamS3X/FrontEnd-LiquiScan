import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';


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

export interface Bar {
    id: number;
    nombrebarra: string;
    idlista: number;
    idadministrador: number;
}

export interface BartenderUser {
    id: number;
    nombre: string;
    role: 'bartender';
}

// 1. Renombramos Session a BartenderSession para evitar conflictos
export interface BartenderSession {
    token: string; // El token nunca será nulo en una sesión guardada
    role: 'bartender';
    user: BartenderUser;
    bars: Bar[];
}

const BARTENDER_SESSION_KEY = 'bartender_session_data'; // Usamos una clave única

// --- FUNCIONES CON NOMBRES ÚNICOS PARA EL BARTENDER ---

/**
 * 2. Renombramos saveSession a saveBartenderSession
 * Guarda el objeto de sesión del bartender en el almacenamiento.
 */
export const saveBartenderSession = async (sessionData: BartenderSession) => {
    try {
        await AsyncStorage.setItem(BARTENDER_SESSION_KEY, JSON.stringify(sessionData));
    } catch (e) {
        console.error('Error al guardar la sesión del bartender.', e);
    }
};

/**
 * 3. Renombramos getSession a getBartenderSession
 * Obtiene el objeto de sesión del bartender del almacenamiento.
 */
export const getBartenderSession = async (): Promise<BartenderSession | null> => {
    try {
        const data = await AsyncStorage.getItem(BARTENDER_SESSION_KEY);
        return data ? (JSON.parse(data) as BartenderSession) : null;
    } catch (e) {
        console.error('Error al cargar la sesión del bartender.', e);
        return null;
    }
};

/**
 * 4. Renombramos clearSession a clearBartenderSession
 * Elimina los datos de la sesión del bartender del almacenamiento.
 */
export const clearBartenderSession = async () => {
    try {
        await AsyncStorage.removeItem(BARTENDER_SESSION_KEY);
    } catch (e) {
        console.error('Error al limpiar la sesión del bartender.', e);
    }
};