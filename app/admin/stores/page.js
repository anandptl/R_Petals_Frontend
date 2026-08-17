'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, MapPin, Package, ShoppingCart, ArrowRight, Activity } from 'lucide-react';
import AdminSidebar from '@/app/admin/components/AdminSidebar';

export default function ShopAdminDashboard() {
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [checking, setChecking] = useState(true);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('role');

        if (!token) {
            router.replace('/login?redirect=/admin/stores');
            return;
        }

        if (role !== 'ADMIN') {
            router.replace('/');
            return;
        }

        const loadStores = async () => {
            try {
                const response = await fetch(`${API_URL}/admin/stores`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const result = await response.json();
                if (!response.ok || !result.success) throw new Error(result.message || 'Failed to load stores');
                setStores(result.data || []);
            } catch (error) {
                console.error('Store dashboard error:', error);
            } finally {
                setLoading(false);
                setChecking(false);
            }
        };

        loadStores();
    }, [API_URL, router]);

    if (checking) return <Loading />;

    const activeStores = stores.filter((store) => store.todayActive).length;

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-[#292628]">
            <AdminSidebar />
            <main className="lg:ml-[255px] min-h-screen">
                <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">Store Management</p>
                        <h1 className="text-xl font-semibold mt-1">Stores Dashboard</h1>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#e7dce1] text-[#6d5260] flex items-center justify-center font-bold">A</div>
                </header>

                <div className="p-5 sm:p-8">
                    <section>
                        <p className="text-sm text-[#8a8385]">Manage all registered stores, orders and inventory.</p>
                        <h2 className="text-3xl font-bold mt-1">Store Management</h2>
                    </section>

                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
                        <StatCard title="Register Stores" value={loading ? '...' : stores.length} icon={<Store size={21} />} accent="bg-[#e8eef2]" />
                        <StatCard title="Active Stores" value={loading ? '...' : activeStores} icon={<Activity size={21} />} accent="bg-[#e5eee9]" />
                        <StatCard title="Store Orders" value="0" icon={<ShoppingCart size={21} />} accent="bg-[#f3e9df]" />
                        <StatCard title="Inventory Items" value="0" icon={<Package size={21} />} accent="bg-[#eee4eb]" />
                    </section>

                    <section className="mt-10">
                        <div className="flex items-end justify-between gap-4 mb-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">Quick Access</p>
                                <h2 className="text-2xl font-bold mt-1">Store Controls</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <ControlCard icon={<Store size={22} />} title="Register Stores" description="Open and manage store registrations." onClick={() => router.push('/admin/stores/registered')} />
                            <ControlCard icon={<ShoppingCart size={22} />} title="Store Orders" description="Track orders placed through registered stores." onClick={() => router.push('/admin/stores/orders')} />
                            <ControlCard icon={<Package size={22} />} title="Store Inventory" description="Monitor products and stock for each store." onClick={() => router.push('/admin/stores/inventory')} />
                        </div>
                    </section>

                    <section className="mt-10 bg-white rounded-2xl shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)] overflow-hidden">
                        <div className="p-6 border-b border-[#eeeaea] flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">Latest</p>
                                <h2 className="text-xl font-semibold mt-1">Registered Stores</h2>
                            </div>
                            <button onClick={() => router.push('/admin/stores/registered')} className="text-sm font-semibold text-[#694f5c] flex items-center gap-2 hover:gap-3 transition-all">
                                View all <ArrowRight size={17} />
                            </button>
                        </div>

                        {loading ? <TableLoading /> : stores.length === 0 ? <EmptyState /> : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[720px]">
                                    <thead>
                                        <tr className="bg-[#faf7f8] text-left text-xs uppercase tracking-[0.12em] text-[#9a9295]">
                                            <th className="px-6 py-4 font-semibold">Store</th>
                                            <th className="px-6 py-4 font-semibold">Location</th>
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                            <th className="px-6 py-4 font-semibold">Registered</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stores.slice(0, 6).map((store) => (
                                            <tr key={store.id} className="border-t border-[#f0eded] hover:bg-[#fcfafb] transition">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-[#eee5e9] text-[#694f5c] flex items-center justify-center"><Store size={18} /></div>
                                                        <div>
                                                            <p className="text-sm font-semibold">Store #{store.id?.slice(-6) || 'N/A'}</p>
                                                            <p className="text-xs text-[#8a8385] mt-1">ID: {store.id || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-2 text-sm text-[#706a6c]"><MapPin size={16} className="mt-0.5 shrink-0" /><span>{store.city}, {store.state}<br />{store.pincode}</span></div>
                                                </td>
                                                <td className="px-6 py-4"><StatusBadge active={store.todayActive} /></td>
                                                <td className="px-6 py-4 text-sm text-[#706a6c]">{formatDate(store.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, accent }) {
    return <div className="bg-white rounded-2xl p-5 shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)] flex items-center justify-between"><div><p className="text-sm text-[#8a8385]">{title}</p><p className="text-2xl font-bold mt-2">{value}</p></div><div className={`w-11 h-11 rounded-xl ${accent} text-[#694f5c] flex items-center justify-center`}>{icon}</div></div>;
}

function ControlCard({ icon, title, description, onClick }) {
    return <button onClick={onClick} className="text-left bg-white rounded-2xl p-6 shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)] hover:-translate-y-0.5 transition group"><div className="w-11 h-11 rounded-xl bg-[#eee5e9] text-[#694f5c] flex items-center justify-center">{icon}</div><h3 className="text-lg font-semibold mt-5">{title}</h3><p className="text-sm text-[#8a8385] mt-2 leading-6">{description}</p><span className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-[#694f5c]">Open <ArrowRight size={16} className="group-hover:translate-x-1 transition" /></span></button>;
}

function StatusBadge({ active }) {
    return <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${active ? 'bg-[#e5eee9] text-[#4f725f]' : 'bg-[#f3e9df] text-[#8a684c]'}`}><span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#5f8a70]' : 'bg-[#ad805a]'}`} />{active ? 'Open Today' : 'Closed Today'}</span>;
}

function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function Loading() {
    return <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center"><div className="text-center"><div className="w-10 h-10 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin mx-auto" /><p className="mt-4 text-sm text-[#777174]">Loading store management...</p></div></div>;
}

function TableLoading() {
    return <div className="p-8 text-center text-sm text-[#8a8385]">Loading registered stores...</div>;
}

function EmptyState() {
    return <div className="p-10 text-center"><div className="w-12 h-12 rounded-2xl bg-[#faf7f8] text-[#694f5c] flex items-center justify-center mx-auto"><Store size={22} /></div><p className="font-semibold mt-4">No stores registered</p><p className="text-sm text-[#8a8385] mt-1">Registered store applications will appear here.</p></div>;
}
