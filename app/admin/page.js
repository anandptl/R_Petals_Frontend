'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Clock3, Package } from 'lucide-react';
import AdminSidebar from './components/AdminSidebar';

export default function AdminPage() {
    const router = useRouter();

    const [checking, setChecking] = useState(true);
    const [user, setUser] = useState(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [dashboard, setDashboard] = useState({
        totalStores: 0,
        totalProducts: 0,
        todayOrders: 0,
        totalOrders: 0,
    });

    const [dashboardLoading, setDashboardLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('role');
        const storedUser = localStorage.getItem('rpetalsUser');

        if (!token) {
            router.replace('/login?redirect=/admin');
            return;
        }

        if (role !== 'ADMIN') {
            router.replace('/');
            return;
        }

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        }

        const loadDashboard = async () => {

            try {

                const response = await fetch(
                    `${API_URL}/admin/dashboard`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || 'Failed to load dashboard'
                    );
                }

                setDashboard(result.data);

            } catch (error) {

                console.error(
                    'Admin dashboard error:',
                    error
                );

            } finally {

                setDashboardLoading(false);
                setChecking(false);

            }
        };

        loadDashboard();

    }, [router]);


    if (checking) {
        return (
            <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin mx-auto" />

                    <p className="mt-4 text-sm text-[#777174]">
                        Loading admin panel...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-[#292628]">

            {/* aside bar  */}
            <AdminSidebar />

            <main className="lg:ml-[255px] min-h-screen">

                {/* TOPBAR */}

                <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between">

                    <div>

                        <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                            Administration
                        </p>

                        <h1 className="text-xl font-semibold mt-1">
                            Dashboard
                        </h1>

                    </div>

                    <div className="flex items-center gap-3">

                        <button className="w-10 h-10 rounded-xl bg-[#faf7f8] flex items-center justify-center text-[#777174] hover:bg-[#f1e9ec] transition">
                            🔔
                        </button>

                        <div className="w-10 h-10 rounded-xl bg-[#e7dce1] text-[#6d5260] flex items-center justify-center font-bold">
                            A
                        </div>

                    </div>

                </header>

                {/* CONTENT */}

                <div className="p-5 sm:p-8">

                    {/* WELCOME */}

                    <section>

                        <p className="text-sm text-[#8a8385]">
                            Welcome back,
                        </p>

                        <h2 className="text-3xl font-bold mt-1">
                            {user?.name || 'Administrator'}
                        </h2>

                        <p className="text-sm text-[#8a8385] mt-2">
                            Manage the complete R Petals platform from here.
                        </p>

                    </section>

                    {/* STATS */}

                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">

                        <StatCard
                            title="Total Stores"
                            value={dashboardLoading ? "..." : (dashboard?.totalStores ?? 0)}
                            icon="🏪"
                            accent="bg-[#e8eef2]"
                        />

                        <StatCard
                            title="Total Products"
                            value={dashboardLoading ? "..." : (dashboard?.totalProducts ?? 0)}
                            icon="📦"
                            accent="bg-[#eee4eb]"
                        />

                        <StatCard
                            title="Today's Orders"
                            value={dashboardLoading ? "..." : (dashboard?.todayOrders ?? 0)}
                            icon="✓"
                            accent="bg-[#f3e9df]"
                        />

                        <StatCard
                            title="Total Orders"
                            value={dashboardLoading ? "..." : (dashboard?.totalOrders ?? 0)}
                            icon="▤"
                            accent="bg-[#e5eee9]"
                        />

                    </section>

                    {/* MANAGEMENT */}

                    <section className="mt-10">

                        <div className="mb-5">

                            <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                                Management
                            </p>

                            <h2 className="text-2xl font-bold mt-1">
                                Admin Controls
                            </h2>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                            <ManagementCard
                                icon={<Store size={22} strokeWidth={2} />}
                                title="Shops"
                                description="View and manage all registered shops."
                                onClick={() => router.push('/admin/shops')}
                            />

                            <ManagementCard
                                icon="◈"
                                title="Categories"
                                description="Create and manage product categories."
                                onClick={() => router.push('/admin/categories')}
                            />

                            <ManagementCard
                                icon={<Package size={22} strokeWidth={2} />}
                                title="Products"
                                description="Add, update and remove products."
                                onClick={() => router.push('/admin/products')}
                            />

                            <ManagementCard
                                icon="▤"
                                title="Orders"
                                description="View and manage customer orders."
                                onClick={() => router.push('/admin/orders')}
                            />

                            <ManagementCard
                                icon="♙"
                                title="Users"
                                description="View registered users and accounts."
                                onClick={() => router.push('/admin/users')}
                            />

                            <ManagementCard
                                icon="▥"
                                title="Reports"
                                description="View platform performance and reports."
                                onClick={() => router.push('/admin/reports')}
                            />

                        </div>

                    </section>

                    {/* RECENT ACTIVITY */}

                    <section className="mt-10">

                        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)]">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                                        Activity
                                    </p>

                                    <h2 className="text-xl font-semibold mt-1">
                                        Recent Activity
                                    </h2>

                                </div>

                                <div className="w-10 h-10 rounded-xl bg-[#faf7f8] flex items-center justify-center">
                                    ✨
                                </div>

                            </div>

                            <div className="mt-6 rounded-xl bg-[#faf9f9] py-12 text-center">

                                <div className="text-3xl">
                                    🌸
                                </div>

                                <p className="font-medium mt-3">
                                    No recent activity
                                </p>

                                <p className="text-sm text-[#8a8385] mt-1">
                                    Admin activities will appear here.
                                </p>

                            </div>

                        </div>

                    </section>

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

function NavItem({
    icon,
    title,
    active = false,
    onClick,
}) {
    return (
        <button
            onClick={onClick}
            className={`
        w-full
        flex
        items-center
        gap-3
        px-4
        py-3
        rounded-xl
        text-sm
        font-medium
        transition
        ${active
                    ? 'bg-[#eee5e9] text-[#694f5c] shadow-[3px_3px_8px_rgba(0,0,0,0.04),-3px_-3px_8px_rgba(255,255,255,0.8)]'
                    : 'text-[#706a6c] hover:bg-[#faf7f8] hover:text-[#694f5c]'
                }
      `}
        >

            <span className="w-6 text-center">
                {icon}
            </span>

            <span>
                {title}
            </span>

        </button>
    );
}


function StatCard({
    title,
    value,
    icon,
    accent,
}) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-[5px_5px_16px_rgba(0,0,0,0.04),-5px_-5px_16px_rgba(255,255,255,0.9)]">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm text-[#8a8385]">
                        {title}
                    </p>

                    <p className="text-3xl font-bold mt-3">
                        {value}
                    </p>

                </div>

                <div className={`w-12 h-12 ${accent} rounded-xl flex items-center justify-center text-xl shadow-[3px_3px_8px_rgba(0,0,0,0.05),-3px_-3px_8px_rgba(255,255,255,0.8)]`}>
                    {icon}
                </div>

            </div>

        </div>
    );
}


function ManagementCard({
    icon,
    title,
    description,
    onClick,
}) {
    return (
        <button
            onClick={onClick}
            className="group text-left bg-white rounded-2xl p-6 shadow-[5px_5px_16px_rgba(0,0,0,0.04),-5px_-5px_16px_rgba(255,255,255,0.9)] hover:-translate-y-1 hover:shadow-[7px_7px_20px_rgba(0,0,0,0.06),-7px_-7px_20px_rgba(255,255,255,0.9)] transition-all duration-300"
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
                Open →
            </p>

        </button>
    );
}