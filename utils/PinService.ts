const API_BASE_URL = 'http://localhost:8000/api'; // Adjust base URL as needed

export interface AdminPinData {
    pin: number | null;
    pin_created_at: string | null;
}

export async function getAdminPin(adminId: number): Promise<AdminPinData | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/administrador/${adminId}/`);
        if (!response.ok) {
            console.error('Failed to fetch admin pin data:', response.statusText);
            return null;
        }
        const data = await response.json();
        // Extrae solo el pin y pin_created_at
        const pinData: AdminPinData = {
            pin: data.pin ?? null,
            pin_created_at: data.pin_created_at ?? null,
        };
        return pinData;
    } catch (error) {
        console.error('Error fetching admin pin data:', error);
        return null;
    }
}

export async function regeneratePin(adminId: number, forzar: boolean): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/administrador/${adminId}/regenerar_pin/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ forzar }),
        });
        if (!response.ok) {
            console.error('Failed to regenerate pin:', response.statusText);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error regenerating pin:', error);
        return false;
    }
}
