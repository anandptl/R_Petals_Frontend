const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Clear stored authentication data
export const clearAuthData = () => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('rpetalsUser');
};
git 
// Check admin and shopkeeper session
export const initializeAuthSession = async () => {
    if (typeof window === 'undefined') return;

    const role = localStorage.getItem('role');

    if (role !== 'ADMIN' && role !== 'SHOPKEEPER') {
        return;
    }

    const token = await refreshAccessToken();

    if (!token) {
        clearAuthData();
        window.location.href = '/login';
    }
};

// Refresh access token
export const refreshAccessToken = async () => {
    try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            clearAuthData();
            return null;
        }

        const result = await response.json();
        const loginData = result?.data;

        if (!loginData?.accessToken) {
            clearAuthData();
            return null;
        }

        localStorage.setItem('accessToken', loginData.accessToken);

        if (loginData.role) {
            localStorage.setItem('role', loginData.role);
        }

        if (loginData.user) {
            localStorage.setItem('rpetalsUser', JSON.stringify(loginData.user));
        }

        return loginData.accessToken;
    } catch (error) {
        console.error('TOKEN REFRESH ERROR:', error);
        clearAuthData();
        return null;
    }
};

// Get access token
export const getAccessToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
};

// API request with token refresh
export const apiFetch = async (url, options = {}) => {
    let token = getAccessToken();

    const request = (accessToken) => {
        const headers = new Headers(options.headers || {});

        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }

        if (!headers.has('Content-Type') && options.body) {
            headers.set('Content-Type', 'application/json');
        }

        return fetch(url, {
            ...options,
            headers,
            credentials: 'include',
        });
    };

    let response = await request(token);

    if (response.status !== 401) return response;

    token = await refreshAccessToken();

    if (!token) return response;

    return request(token);
};

// Logout current session
export const logout = async () => {
    const token = getAccessToken();

    try {
        await fetch(`${API_URL}/api/logout`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            credentials: 'include',
        });
    } catch (error) {
        console.error('LOGOUT API ERROR:', error);
    } finally {
        clearAuthData();
    }
};