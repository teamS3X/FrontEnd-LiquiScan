import API_URL from '@/constants/Api';

export const fetchAlcoholes = async () => {
    try {
        const response = await fetch(`${API_URL}/alcohol/`);
        if (!response.ok) throw new Error('Error al obtener alcoholes');
        return await response.json();
    } catch (error) {
        console.error("Error fetching alcoholes:", error);
        throw error;
    }
};
export const createList = async (listData) => {
    try {
        const response = await fetch(`${API_URL}/Lista_de_alcohol/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(listData),
        });

        if (!response.ok) throw new Error('error al enviar lista a crear');
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("error al crear la lista:", error);
    }
}
export const saveAlcoholListRelation = async (relationData) => {
    try {
        const response = await fetch(`${API_URL}/Lista_a_alcohol/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(relationData),
        });

        if (!response.ok) throw new Error('error: respuesta not ok');
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("error al crear relacion:", error);
    }
}

