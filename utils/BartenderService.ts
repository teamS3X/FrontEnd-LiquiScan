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
    const response = await fetch(`${API_URL}/BartenderCreate/`);
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
interface NewBartenderData {
  nombre: string;
  idadministrador: number;
  idbarra: number;
}

export const createBartender = async (bartenderData: NewBartenderData) => {
  try {
    const response = await fetch(`${API_URL}/BartenderCreate/`, {
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

// Actualizar bartender existente
export const updateBartender = async (id: number, bartenderData: Partial<NewBartenderData>) => {
  try {
    const response = await fetch(`${API_URL}/BartenderRetrieveUpdateDestroy/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bartenderData),
    });

    if (!response.ok) throw new Error('Error al actualizar bartender');
    return await response.json();
  } catch (error) {
    console.error("Error actualizando bartender:", error);
    throw error;
  }
};

// Eliminar bartender por id
export const deleteBartender = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/BartenderRetrieveUpdateDestroy/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Error al eliminar bartender');
    return true;
  } catch (error) {
    console.error("Error eliminando bartender:", error);
    throw error;
  }
};