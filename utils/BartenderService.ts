import API_URL from '@/constants/Api';

interface BartenderData {
  id: number;
  nombre: string;
  idadministrador: number;
  idbarra: number | null;
}

// Obtener todos los bartenders
export const fetchBartenders = async (): Promise<BartenderData[]> => {
  try {
    const response = await fetch(`${API_URL}/Bartender/`);
    if (!response.ok) throw new Error('Error al obtener bartenders');
    return await response.json();
  } catch (error) {
    console.error("Error fetching bartenders:", error);
    throw error;
  }
};

// Obtener bartenders por admin que tienen barra asignada (no null)
export const fetchBartendersPorAdminConBarra = async (adminId: number): Promise<BartenderData[]> => {
  try {
    const response = await fetch(`${API_URL}/bartenders_por_administrador_con_barra/${adminId}/`);
    if (!response.ok) throw new Error('Error al obtener bartenders por administrador con barra');
    return await response.json();
  } catch (error) {
    console.error("Error fetching bartenders por admin con barra:", error);
    throw error;
  }
};

// Crear nuevo bartender
export interface NewBartenderData {
  nombre: string;
  idadministrador: number;
}

export const createBartender = async (bartenderData: NewBartenderData) => {
  try {
    const response = await fetch(`${API_URL}/Bartender/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bartenderData),
    });

    if (!response.ok) throw new Error('Error al crear bartender');
    return await response.json();
  } catch (error) {
    console.error("Error creando bartender:", error);
    throw error;
  }
};

// Actualizar bartender (PUT)
export const updateBartender = async (id: number, updatedData: { nombre: string }) => {
  try {
    const response = await fetch(`${API_URL}/Bartender/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const data = await response.json();
        if (data.nombre && data.nombre.includes('unique')) {
          throw new Error('Ya existe un bartender con ese nombre.');
        }
      }
      throw new Error('Error al actualizar bartender');
    }

    return await response.json();
  } catch (error) {
    console.error('Error actualizando bartender:', error);
    throw error;
  }
};

// Eliminar bartender (DELETE)
export const deleteBartender = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/Bartender/${id}/`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Error al eliminar bartender');
  } catch (error) {
    console.error('Error eliminando bartender:', error);
    throw error;
  }
};