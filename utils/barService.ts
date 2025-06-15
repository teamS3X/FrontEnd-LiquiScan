import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:8000/api';

interface Barra {
    id?: number;        // opcional cuando estás creando
    nombrebarra: string;
    idadministrador: number;
    idlista: number;
}

export const fetchBarras = async (): Promise<Barra[]> => {
    const response = await fetch(`${API_URL}/barra/`);
    if (!response.ok) throw new Error('Error al obtener barras');
    return await response.json();
};

export const fetchBarra = async (id: number): Promise<Barra> => {
    const response = await fetch(`${API_URL}/barra/${id}/`);
    if (!response.ok) throw new Error('Error al obtener barra');
    return await response.json();
};


export const createBarra = async (barra: Barra): Promise<Barra> => {
    try {
        const response = await fetch(`${API_URL}/barra/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(barra),
        });

        console.log('Response status:', response.status);

        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
            throw new Error(data.detail || 'Error al crear barra');
        }

        return data; // Retornas el objeto creado, normalmente tendrá el `id` asignado por el backend
    } catch (error) {
        console.error("Error creating barra:", error);
        throw error;
    }
};