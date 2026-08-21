const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ACCESS_TOKEN_REFRESH_SKEW_MS = 2 * 60 * 1000;
const PROACTIVE_REFRESH_MS = 60 * 1000;

let refreshPromise = null;
let refreshTimer = null;
let listenersInstalled = false;

// Clear all authentication credentials from client storage
export const clearAuthData = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
  localStorage.removeItem("rpetalsUser");

  window.dispatchEvent(new Event("rpetals-auth-changed"));
};

// Retrieve stored access token from localStorage
export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

// Retrieve and parse user data from localStorage
export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("rpetalsUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Persist login payload to client storage
export const saveLoginData = (loginData) => {
  if (typeof window === "undefined" || !loginData?.accessToken) return;

  localStorage.setItem("accessToken", loginData.accessToken);
  if (loginData.role) {
    localStorage.setItem("role", String(loginData.role).toUpperCase());
  }
  if (loginData.user) {
    localStorage.setItem("rpetalsUser", JSON.stringify(loginData.user));
  }

  window.dispatchEvent(new Event("rpetals-auth-changed"));
};

// Decode and parse JWT payload without external libraries
const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(
      decodeURIComponent(
        atob(normalized)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );
  } catch {
    return null;
  }
};

// Check if access token is expired or approaching expiration
export const isAccessTokenExpiredOrNearExpiry = (
  token = getAccessToken(),
  skewMs = ACCESS_TOKEN_REFRESH_SKEW_MS
) => {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 <= Date.now() + skewMs;
};

// Request a new access token using the refresh cookie
export const refreshAccessToken = async ({ force = false } = {}) => {
  if (typeof window === "undefined") return null;

  const existingToken = getAccessToken();
  if (!force && existingToken && !isAccessTokenExpiredOrNearExpiry(existingToken)) {
    return existingToken;
  }

  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
        cache: "no-store",
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

      saveLoginData(loginData);
      return loginData.accessToken;
    } catch (error) {
      console.error("TOKEN REFRESH ERROR:", error);
      clearAuthData();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Validate and initialize session on app boot
export const initializeAuthSession = async () => {
  if (typeof window === "undefined") return null;

  const token = getAccessToken();
  if (!token) return null;

  const refreshedToken = await refreshAccessToken({
    force: isAccessTokenExpiredOrNearExpiry(token),
  });

  if (!refreshedToken) {
    redirectToLogin();
    return null;
  }

  startAuthRefreshScheduler();
  return refreshedToken;
};

// Check token health and trigger background refresh if needed
const refreshIfNeeded = async () => {
  const token = getAccessToken();
  if (!token) {
    stopAuthRefreshScheduler();
    return null;
  }

  if (isAccessTokenExpiredOrNearExpiry(token)) {
    const refreshed = await refreshAccessToken({ force: true });
    if (!refreshed) {
      redirectToLogin();
      return null;
    }
  }

  return getAccessToken();
};

// Start background timers and window focus listeners for auto-refresh
export const startAuthRefreshScheduler = () => {
  if (typeof window === "undefined") return;

  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(() => {
    refreshIfNeeded();
  }, PROACTIVE_REFRESH_MS);

  if (!listenersInstalled) {
    listenersInstalled = true;
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") refreshIfNeeded();
    });
    window.addEventListener("focus", () => {
      refreshIfNeeded();
    });
  }
};

// Clear active background refresh timer
export const stopAuthRefreshScheduler = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};

// Clear user data and redirect to login route
export const redirectToLogin = (path) => {
  if (typeof window === "undefined") return;

  const currentPath =
    path || `${window.location.pathname}${window.location.search}`;
  const redirect =
    currentPath.startsWith("/") && !currentPath.startsWith("//")
      ? currentPath
      : "/";

  clearAuthData();
  stopAuthRefreshScheduler();

  if (!window.location.pathname.startsWith("/login")) {
    window.location.replace(
      `/login?redirect=${encodeURIComponent(redirect)}`
    );
  }
};

// Authenticated fetch wrapper with automatic token injection and retry on 401
export const apiFetch = async (url, options = {}) => {
  let token = getAccessToken();

  if (!token || isAccessTokenExpiredOrNearExpiry(token)) {
    token = await refreshAccessToken({ force: true });
    if (!token) {
      redirectToLogin();
      return new Response(
        JSON.stringify({
          success: false,
          message: "Authentication session expired",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  const request = (accessToken) => {
    const headers = new Headers(options.headers || {});
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const isFormData =
      typeof FormData !== "undefined" && options.body instanceof FormData;
    if (!isFormData && options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  let response = await request(token);
  if (response.status !== 401) return response;

  token = await refreshAccessToken({ force: true });
  if (!token) {
    redirectToLogin();
    return response;
  }

  return request(token);
};

// Terminate server session and clear client state
export const logout = async () => {
  const token = getAccessToken();

  try {
    await fetch(`${API_URL}/api/logout`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
      cache: "no-store",
    });
  } catch (error) {
    console.error("LOGOUT API ERROR:", error);
  } finally {
    clearAuthData();
    stopAuthRefreshScheduler();
  }
};