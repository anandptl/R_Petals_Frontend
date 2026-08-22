'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/app/admin/components/AdminSidebar';
import { apiFetch, initializeAuthSession } from '@/lib/auth';

export default function AdminOccasionsPage() {

    const router = useRouter();

    const [checking, setChecking] = useState(true);
    const [user, setUser] = useState(null);

    const [stats, setStats] = useState({
        totalOccasions: 0,
        activeOccasions: 0,
        upcomingOccasions: 0,
    });

    const [statsLoading, setStatsLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

    

    useEffect(() => {

        initializeAuthSession();

        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('role');
        const storedUser = localStorage.getItem('rpetalsUser');

        if (!token) {
            router.replace('/login?redirect=/admin/occasions');
            return;
        }

        if (role !== 'ADMIN') {
            router.replace('/');
            return;
        }

        setChecking(false);

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        }



    }, [router, API_URL]);


    useEffect(() => {

        const loadStats = async () => {

            try {

                setStatsLoading(true);

                const response = await apiFetch(`${API_URL}/occasions/stats`, {

                        method: 'GET',
                    }
                );

                console.log(
                    'Stats status:',
                    response.status
                );

                const text = await response.text();

                console.log(
                    'Stats response:',
                    text
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to load occasion stats: ${response.status}`
                    );
                }

                const data = JSON.parse(text);

                console.log('Occasion Stats:', data);

                setStats({
                    totalOccasions: data.totalOccasions ?? 0,
                    activeOccasions: data.activeOccasions ?? 0,
                    upcomingOccasions: data.upcomingOccasions ?? 0,
                });

            } catch (error) {

                console.error(
                    'Failed to load occasion stats:',
                    error
                );

            } finally {

                setStatsLoading(false);

            }

        };

        if (!checking) {
            loadStats();
        }

    }, [checking]);


    if (checking) {
        return (
            <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin mx-auto" />

                    <p className="mt-4 text-sm text-[#777174]">
                        Loading occasions console...
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-[#292628]">

            <AdminSidebar />

            <main className="lg:ml-[255px] min-h-screen">

                {/* HEADER */}
                <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between sticky top-0 z-10">

                    <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                            Catalog & Inventory
                        </p>

                        <h1 className="text-xl font-semibold mt-1">
                            Occasion Management
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            className="w-10 h-10 rounded-xl bg-[#faf7f8] flex items-center justify-center text-[#777174] hover:bg-[#f1e9ec] transition"
                        >
                            🔔
                        </button>

                        <div className="w-10 h-10 rounded-xl bg-[#e7dce1] text-[#6d5260] flex items-center justify-center font-bold">
                            {user?.name
                                ? user.name.charAt(0).toUpperCase()
                                : 'A'}
                        </div>

                    </div>
                </header>

                {/* CONTENT */}
                <div className="p-5 sm:p-8" style={{ paddingTop: '10px' }}>

                    {/* TITLE */}
                    <section>
                        <h2 className="text-3xl font-bold mt-1">
                            Occasions Overview
                        </h2>

                        <p className="text-sm text-[#8a8385] mt-2">
                            Add, update, view and manage all special occasions.
                        </p>
                    </section>

                    {/* ACTION CARDS */}
                    <section className="mt-8">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <ActionCard
                                icon="➕"
                                title="Add Occasion"
                                description="Create a new occasion, upload its image and configure the occasion date."
                                actionText="Add Occasion"
                                onClick={() =>
                                    router.push('/admin/occasions/add')
                                }
                            />

                            <ActionCard
                                icon="🌸"
                                title="All Occasions"
                                description="Browse all occasions, view images, dates and current active status."
                                actionText="View Occasions"
                                onClick={() =>
                                    router.push('/admin/occasions/all')
                                }
                            />

                        </div>

                    </section>

                    {/* OCCASION BREAKDOWN */}
                    <section className="mt-10">

                        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)]">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                                        Occasion Breakdown
                                    </p>

                                    <h2 className="text-xl font-semibold mt-1">
                                        Special Occasions
                                    </h2>

                                    <p className="text-sm text-[#8a8385] mt-1">
                                        Manage seasonal and special-day occasions for R Petals.
                                    </p>

                                </div>

                                <div className="w-10 h-10 rounded-xl bg-[#faf7f8] flex items-center justify-center text-lg">
                                    🌸
                                </div>

                            </div>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

                                <StatCard
                                    title="Total Occasions"
                                    value={
                                        statsLoading
                                            ? '...'
                                            : stats.totalOccasions
                                    }
                                />

                                <StatCard
                                    title="Active Occasions"
                                    value={
                                        statsLoading
                                            ? '...'
                                            : stats.activeOccasions
                                    }
                                />

                                <StatCard
                                    title="Upcoming Occasions"
                                    value={
                                        statsLoading
                                            ? '...'
                                            : stats.upcomingOccasions
                                    }
                                />

                            </div>

                        </div>

                    </section>

                    {/* FOOTER */}
                    <footer className="py-8 text-center">
                        <p className="text-xs text-[#9a9295]">
                            © 2026 R Petals • Admin Panel
                        </p>
                    </footer>

                </div>
            </main>
        </div>
    );
}


/* ACTION CARD */

function ActionCard({
    icon,
    title,
    description,
    actionText,
    onClick,
}) {
    return (
        <button
            onClick={onClick}
            className="group text-left bg-white rounded-2xl p-6 shadow-[5px_5px_16px_rgba(0,0,0,0.04),-5px_-5px_16px_rgba(255,255,255,0.9)] hover:-translate-y-1 hover:shadow-[7px_7px_20px_rgba(0,0,0,0.06),-7px_-7px_20px_rgba(255,255,255,0.9)] transition-all duration-300 w-full"
        >

            <div className="flex items-start justify-between">

                <div className="w-12 h-12 rounded-xl bg-[#f2eaed] flex items-center justify-center text-xl shadow-[3px_3px_8px_rgba(0,0,0,0.04),-3px_-3px_8px_rgba(255,255,255,0.8)]">
                    {icon}
                </div>

                <div className="w-9 h-9 rounded-full bg-[#faf7f8] flex items-center justify-center text-[#81797c] group-hover:bg-[#eee5e9] transition">
                    →
                </div>

            </div>

            <h3 className="text-lg font-semibold mt-5">
                {title}
            </h3>

            <p className="text-sm text-[#81797c] mt-2 leading-6">
                {description}
            </p>

            <p className="text-xs font-semibold text-[#775966] mt-5">
                {actionText} →
            </p>

        </button>
    );
}


/* STAT CARD */

function StatCard({ title, value }) {
    return (
        <div className="rounded-xl bg-[#faf9f9] p-5">

            <p className="text-sm text-[#8a8385]">
                {title}
            </p>

            <p className="text-2xl font-bold mt-2 text-[#403a3d]">
                {value}
            </p>

        </div>
    );
}