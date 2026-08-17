'use client';

import { useEffect } from 'react';
import { initializeAuthSession } from '@/lib/auth';

export default function AuthSessionGuard() {
    useEffect(() => {
        initializeAuthSession();
    }, []);

    return null;
}
