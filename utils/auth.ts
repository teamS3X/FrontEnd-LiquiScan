import API_URL from '@/constants/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface LoginCredentials {
    correoelectronico: string;
    contrasena: string;
}

interface AuthResponse {
    token: string;
    user: {
        id: number;
        correoelectronico: string;
        role: string;
    };
}

export const registerUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        console.log('Making registration request to:', `${API_URL}/auth/register/`);
        console.log('With credentials:', credentials);

        const response = await fetch(`${API_URL}/auth/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        // Store the token
        await AsyncStorage.setItem('token', data.token);
        console.log('Token stored successfully');

        // Log the user data to see its structure
        console.log('User data from response:', data.user);

        // Ensure we have the required user data
        if (!data.user || !data.user.role) {
            console.error('User data is missing or incomplete:', data.user);
            throw new Error('Invalid user data received from server');
        }

        return {
            token: data.token,
            user: {
                id: data.user.id,
                correoelectronico: data.user.correoelectronico,
                role: data.user.role
            }
        };
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        console.log('Making login request to:', `${API_URL}/auth/login/`);
        console.log('With credentials:', credentials);

        const response = await fetch(`${API_URL}/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store the token
        await AsyncStorage.setItem('token', data.token);
        console.log('Token stored successfully');

        // Store the token
        await AsyncStorage.setItem('id', data.user.id);
        console.log('id stored successfully');


        // Log the user data to see its structure
        console.log('User data from response:', data.user);

        // Ensure we have the required user data
        if (!data.user || !data.user.role) {
            console.error('User data is missing or incomplete:', data.user);
            throw new Error('Invalid user data received from server');
        }

        return {
            token: data.token,
            user: {
                id: data.user.id,
                correoelectronico: data.user.correoelectronico,
                role: data.user.role
            }
        };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const getToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem('token');
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

export const logout = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem('token');
        console.log('Logged out successfully');
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

export const refreshToken = async (): Promise<string> => {
    try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await fetch(`${API_URL}/auth/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Token refresh failed');
        }

        const data = await response.json();
        await AsyncStorage.setItem('access_token', data.access);
        return data.access;
    } catch (error) {
        console.error('Token refresh error:', error);
        throw error;
    }
}; 

export const getAdminId = async (): Promise<number> => {
    const idString = await AsyncStorage.getItem('id');
    if (!idString) throw new Error("No se encontró el id del administrador");
    return parseInt(idString, 10);
};
