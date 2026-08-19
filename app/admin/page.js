'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/app/admin/components/AdminSidebar';
import { apiFetch, initializeAuthSession } from '@/lib/auth';

export default function AdminPage() {
    const router = useRouter();

    const [checking, setChecking] = useState(true);
    const [user, setUser] = useState(null);

    const [dashboard, setDashboard] = useState({
        totalStores: 0,
        totalProducts: 0,
        todayOrders: 0,
        totalOrders: 0
    });

    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [storeStatus, setStoreStatus] = useState([]);
    const [storeStatusLoading, setStoreStatusLoading] = useState(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

    useEffect(() => {
        initializeAuthSession();

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

        setChecking(false);

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        }

        const loadDashboard = async () => {
            try {
                setDashboardLoading(true);
                const response = await apiFetch(`${API_URL}/admin/dashboard`, {
                    method: 'GET'
                });

                if (response.status === 401) {
                    router.replace('/login?redirect=/admin');
                    return;
                }

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || 'Failed to load dashboard');
                }

                setDashboard(
                    result.data || {
                        totalStores: 0,
                        totalProducts: 0,
                        todayOrders: 0,
                        totalOrders: 0
                    }
                );
            } catch (error) {
                console.error('Admin dashboard error:', error);
            } finally {
                setDashboardLoading(false);
            }
        };

        const loadStoreStatus = async () => {

            try {

                const response = await apiFetch(`${API_URL}/admin/stores`,
                    {
                        method: 'GET'
                    }
                );


                if (response.status === 401) {
                    router.replace(
                        '/login?redirect=/admin'
                    );

                    return;
                }

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || 'Failed to load stores');
                }

                let stores = [];

                if (Array.isArray(result?.data)) {
                    stores = result.data;
                } else if (Array.isArray(result?.data?.stores)) {
                    stores = result.data.stores;
                } else if (Array.isArray(result)) {
                    stores = result;
                }

                const sortedStores = [...stores].sort(
                    (a, b) => {
                        if (a.todayActive && !b.todayActive) {
                            return -1;
                        }

                        if (!a.todayActive && b.todayActive) {
                            return 1;
                        }

                        return 0;
                    }
                );

                setStoreStatus(sortedStores);

            } catch (error) {

                console.error('STORE STATUS ERROR:', error);

                setStoreStatus([]);

            } finally {

                setStoreStatusLoading(false);

            }
        };

        // Dono APIs ko parallel call karein
        loadDashboard();
        loadStoreStatus();

    }, [router, API_URL]);

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
            <AdminSidebar />

            <main className="lg:ml-[255px] min-h-screen">
                <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                            Administration
                        </p>
                        <h1 className="text-xl font-semibold mt-1">
                            Dashboard
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
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                    </div>
                </header>

                <div className="p-5 sm:p-8">
                    {/* Welcome Section */}
                    <section>
                        <p className="text-sm text-[#8a8385]">Welcome back,</p>
                        <h2 className="text-3xl font-bold mt-1">
                            {user?.name || 'Administrator'}
                        </h2>
                        <p className="text-sm text-[#8a8385] mt-2">
                            Manage the complete R Petals platform from here.
                        </p>
                    </section>

                    {/* Stats Section */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
                        <StatCard
                            title="Total Stores"
                            value={dashboardLoading ? '...' : (dashboard?.totalStores ?? 0)}
                            icon="🏪"
                            accent="bg-[#e8eef2]"
                        />
                        <StatCard
                            title="Total Products"
                            value={dashboardLoading ? '...' : (dashboard?.totalProducts ?? 0)}
                            icon="📦"
                            accent="bg-[#eee4eb]"
                        />
                        <StatCard
                            title="Today's Orders"
                            value={dashboardLoading ? '...' : (dashboard?.todayOrders ?? 0)}
                            icon="✓"
                            accent="bg-[#f3e9df]"
                        />
                        <StatCard
                            title="Total Orders"
                            value={dashboardLoading ? '...' : (dashboard?.totalOrders ?? 0)}
                            icon="📋"
                            accent="bg-[#e5eee9]"
                        />
                    </section>

                    {/* Quick Management Section */}
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
                                icon="🏪"
                                title="Stores"
                                description="View and manage all registered stores."
                                onClick={() => router.push('/admin/stores')}
                            />
                            <ManagementCard
                                icon="🏷️"
                                title="Categories"
                                description="Create and manage product categories."
                                onClick={() => router.push('/admin/categories')}
                            />
                            <ManagementCard
                                icon="📦"
                                title="Products"
                                description="Add, update and remove products."
                                onClick={() => router.push('/admin/products')}
                            />
                            <ManagementCard
                                icon="📋"
                                title="Orders"
                                description="View and manage customer orders."
                                onClick={() => router.push('/admin/orders')}
                            />
                            <ManagementCard
                                icon="👥"
                                title="Users"
                                description="View registered users and accounts."
                                onClick={() => router.push('/admin/users')}
                            />
                            <ManagementCard
                                icon="📈"
                                title="Reports"
                                description="View platform performance and reports."
                                onClick={() => router.push('/admin/reports')}
                            />
                        </div>
                    </section>

                    {/* Store Activity Table Section */}
                    <section className="mt-10">
                        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                                        Store Activity
                                    </p>
                                    <h2 className="text-xl font-semibold mt-1">
                                        Store Status
                                    </h2>
                                    <p className="text-sm text-[#8a8385] mt-1">
                                        Today's active stores are shown first.
                                    </p>
                                </div>

                                <div className="w-10 h-10 rounded-xl bg-[#faf7f8] flex items-center justify-center text-lg">
                                    🏪
                                </div>
                            </div>

                            {storeStatusLoading ? (
                                <div className="mt-6 rounded-xl bg-[#faf9f9] py-12 text-center">
                                    <div className="w-8 h-8 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin mx-auto" />
                                    <p className="text-sm text-[#8a8385] mt-4">
                                        Loading stores...
                                    </p>
                                </div>
                            ) : storeStatus.length === 0 ? (
                                <div className="mt-6 rounded-xl bg-[#faf9f9] py-12 text-center">
                                    <div className="text-3xl">🏪</div>
                                    <p className="font-medium mt-3">
                                        No stores registered
                                    </p>
                                    <p className="text-sm text-[#8a8385] mt-1">
                                        Registered stores will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-6 overflow-x-auto rounded-xl border border-[#eee9ea]">
                                    <table className="w-full min-w-[750px]">
                                        <thead>
                                            <tr className="bg-[#faf9f9] border-b border-[#eee9ea]">
                                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">
                                                    Store Name
                                                </th>
                                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">
                                                    Shopkeeper & Number
                                                </th>
                                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">
                                                    Today Active
                                                </th>
                                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">
                                                    Last Active Date
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {storeStatus.map((store, index) => {
                                                const rawDate = store.lastActiveAt || store.updatedAt || store.lastActive;
                                                const isValidDate = rawDate && !isNaN(new Date(rawDate).getTime());

                                                return (
                                                    <tr
                                                        key={store.storeId || store._id || store.id || index}
                                                        className="border-b border-[#f1eeee] last:border-0 hover:bg-[#fcfbfb] transition"
                                                    >
                                                        <td className="px-5 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-[#e8eef2] flex items-center justify-center text-lg shrink-0">
                                                                    🏪
                                                                </div>
                                                                <p className="text-sm font-semibold text-[#403a3d]">
                                                                    {store.shopName || store.name || store.storeName || 'Unknown Shop'}
                                                                </p>
                                                            </div>
                                                        </td>

                                                        <td className="px-5 py-5">
                                                            <p className="text-sm font-semibold text-[#403a3d]">
                                                                {store.userName || store.ownerName || store.user?.name || 'Unknown User'}
                                                            </p>
                                                            <p className="text-xs text-[#8a8385] mt-1">
                                                                {store.mobileNumber || store.phone || store.user?.mobileNumber || '-'}
                                                            </p>
                                                        </td>

                                                        <td className="px-5 py-5">
                                                            {store.todayActive || store.isActive ? (
                                                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8f5ed] text-[#47745a] text-xs font-semibold">
                                                                    <span className="w-2 h-2 rounded-full bg-[#4f9b68]" />
                                                                    Active
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f2f0f0] text-[#777073] text-xs font-semibold">
                                                                    <span className="w-2 h-2 rounded-full bg-[#aaa4a6]" />
                                                                    Inactive
                                                                </span>
                                                            )}
                                                        </td>

                                                        <td className="px-5 py-5">
                                                            {isValidDate ? (
                                                                <div>
                                                                    <p className="text-sm font-medium text-[#514b4e]">
                                                                        {new Date(rawDate).toLocaleDateString('en-IN', {
                                                                            day: '2-digit',
                                                                            month: 'short',
                                                                            year: 'numeric'
                                                                        })}
                                                                    </p>
                                                                    <p className="text-xs text-[#8a8385] mt-1">
                                                                        {new Date(rawDate).toLocaleTimeString('en-IN', {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <span className="text-sm text-[#aaa4a6]">
                                                                    Never active
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
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

function StatCard({ title, value, icon, accent }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-[5px_5px_16px_rgba(0,0,0,0.04),-5px_-5px_16px_rgba(255,255,255,0.9)]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-[#8a8385]">{title}</p>
                    <p className="text-3xl font-bold mt-3">{value}</p>
                </div>
                <div className={`w-12 h-12 ${accent} rounded-xl flex items-center justify-center text-xl shadow-[3px_3px_8px_rgba(0,0,0,0.05),-3px_-3px_8px_rgba(255,255,255,0.8)]`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

function ManagementCard({ icon, title, description, onClick }) {
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

            <h3 className="text-lg font-semibold mt-5">{title}</h3>
            <p className="text-sm text-[#81797c] mt-2 leading-6">{description}</p>
            <p className="text-xs font-semibold text-[#775966] mt-5">Open →</p>
        </button>
    );
}