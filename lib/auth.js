const API_URL = process.env.NEXT_PUBLIC_API_URL;


/*
=========================================================
REFRESH ACCESS TOKEN
=========================================================
Uses HttpOnly refresh-token cookie to get a new access token.
*/

export const refreshAccessToken = async () => {
    try {
        const response = await fetch(
            `${API_URL}/auth/refresh`,
            {
                method: 'POST',
                credentials: 'include',
            }
        );

        if (!response.ok) {
            console.log(
                'Refresh token expired or invalid.'
            );

            return null;
        }

        const data = await response.json();

        const loginData = data?.data;

        if (!loginData?.accessToken) {
            console.error(
                'New access token not received.'
            );

            return null;
        }


        // ================================================
        // SAVE NEW ACCESS TOKEN
        // ================================================

        localStorage.setItem(
            'accessToken',
            loginData.accessToken
        );


        // ================================================
        // UPDATE ROLE
        // ================================================

        if (loginData.role) {
            localStorage.setItem(
                'role',
                loginData.role
            );
        }


        // ================================================
        // UPDATE USER
        // ================================================

        if (loginData.user) {
            localStorage.setItem(
                'rpetalsUser',
                JSON.stringify(loginData.user)
            );
        }


        console.log(
            'Access token refreshed successfully.'
        );

        return loginData.accessToken;

    } catch (error) {

        console.error(
            'TOKEN REFRESH ERROR:',
            error
        );

        return null;
    }
};


/*
=========================================================
GET ACCESS TOKEN
=========================================================
*/

export const getAccessToken = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return localStorage.getItem('accessToken');
};


/*
=========================================================
CLEAR AUTH DATA
=========================================================
*/

export const clearAuthData = () => {

    if (typeof window === 'undefined') {
        return;
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('rpetalsUser');
};


/*
=========================================================
LOGOUT
=========================================================
*/

export const logout = async () => {

    const token = getAccessToken();

    try {

        await fetch(
            `${API_URL}/api/logout`,
            {
                method: 'POST',

                headers: token
                    ? {
                        Authorization: `Bearer ${token}`,
                    }
                    : {},

                credentials: 'include',
            }
        );

    } catch (error) {

        console.error(
            'LOGOUT API ERROR:',
            error
        );

    } finally {

        clearAuthData();
    }
};