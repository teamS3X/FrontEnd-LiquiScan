import { saveSession, getSession, clearSession } from './session';

export async function loginUser(credentials: { username: string, password: string }) {
    // Response es la respuesta de la API
    const response = {
        token: 'token-1234',
        user: {
            username: 'nombre',
            role: '',
            id: '13',
        }
    }
    // Solo para testear los flujos
    if (credentials.username == 'admin') {
        response.user.role = 'admin';
    }
    else if (credentials.username == 'bar') {
        response.user.role = 'bar';
    }
    
    return response
}
