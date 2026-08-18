'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    initializeAuthSession,
    getAccessToken,
    refreshAccessToken,
    redirectToLogin,
    startAuthRefreshScheduler,
} from '@/lib/auth';

const getRequiredRole = (pathname) => {
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
        return 'ADMIN';
    }

    if (
        pathname === '/darkStore' ||
        pathname.startsWith('/darkStore/') ||
        pathname === '/shopkeeper' ||
        pathname.startsWith('/shopkeeper/')
    ) {
        return 'SHOPKEEPER';
    }

    // User-only pages. Public storefront/category/product pages remain public.
    if (
        pathname === '/cart' ||
        pathname.startsWith('/cart/') ||
        pathname === '/checkout' ||
        pathname.startsWith('/checkout/')
    ) {
        return 'USER';
    }

    return null;
};

export default function AuthSessionGuard({ children }) {
    const pathname = usePathname();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const checkSession = async () => {
            const requiredRole = getRequiredRole(pathname);
            const existingToken = getAccessToken();
            const storedRole =
                typeof window !== 'undefined'
                    ? localStorage.getItem('role')?.toUpperCase()
                    : null;

            // Protected route: always validate/refresh the session before
            // allowing the protected page to become active.
            if (requiredRole) {
                const token = await refreshAccessToken({ force: true });

                if (cancelled) return;

                if (!token) {
                    redirectToLogin(pathname);
                    return;
                }

                const role =
                    localStorage.getItem('role')?.toUpperCase();

                if (role !== requiredRole) {
                    window.location.replace(
                        role === 'ADMIN'
                            ? '/admin'
                            : role === 'SHOPKEEPER'
                                ? '/darkStore'
                                : '/'
                    );
                    return;
                }

                startAuthRefreshScheduler();
                setReady(true);
                return;
            }

            // Public route with an existing session: keep the session alive.
            if (existingToken || storedRole) {
                const token = await initializeAuthSession();

                if (cancelled) return;

                if (!token && existingToken) {
                    redirectToLogin(pathname);
                    return;
                }
            }

            if (!cancelled) {
                setReady(true);
            }
        };

        setReady(false);
        checkSession();

        return () => {
            cancelled = true;
        };
    }, [pathname]);

    if (!ready) {
        return (
            <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-sm text-[#777174]">
                        Checking session...
                    </p>
                </div>
            </div>
        );
    }

    return children;
}
