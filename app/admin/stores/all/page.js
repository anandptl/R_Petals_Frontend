'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Search,
    MapPin,
    Store,
    Phone,
    User,
    X
} from 'lucide-react';

import AdminSidebar from '@/app/admin/components/AdminSidebar';
import { apiFetch } from '@/lib/auth';

export default function RegisteredStoresPage() {
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [checking, setChecking] = useState(true);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        let mounted = true;

        const loadStores = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const role = localStorage.getItem('role');

                if (!token) {
                    router.replace('/login?redirect=/admin/stores/registered');
                    return;
                }

                if (role !== 'ADMIN') {
                    router.replace('/');
                    return;
                }

                if (mounted) {
                    setChecking(false);
                }

                const response = await apiFetch(`${API_URL}/admin/stores`, {
                    method: 'GET'
                });

                if (response.status === 401) {
                    router.replace('/login?redirect=/admin/stores/registered');
                    return;
                }

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Failed to load stores');
                }

                let storesData = [];
                if (Array.isArray(result)) {
                    storesData = result;
                } else if (Array.isArray(result.data)) {
                    storesData = result.data;
                } else if (Array.isArray(result.data?.stores)) {
                    storesData = result.data.stores;
                }

                if (mounted) {
                    setStores(storesData);
                }
            } catch (error) {
                console.error('Store loading error:', error);
                if (mounted) {
                    setStores([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadStores();

        return () => {
            mounted = false;
        };
    }, [API_URL, router]);

    // Search filter logic by Shop Name
    const filteredStores = useMemo(() => {
        if (!searchTerm.trim()) return stores;

        return stores.filter((store) => {
            const shopName =
                store?.shopName ||
                store?.shop?.shopName ||
                '';
            return shopName.toLowerCase().includes(searchTerm.toLowerCase().trim());
        });
    }, [stores, searchTerm]);

    if (checking) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-[#292628]">
            <AdminSidebar />

            <main className="lg:ml-[255px] min-h-screen">
                {/* Header with Back Button */}
                <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">Store Management</p>
                        <h1 className="text-xl font-semibold mt-1">Registered Stores</h1>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push('/admin')}
                        className="px-4 py-2 rounded-xl bg-[#faf7f8] text-[#6d5260] font-semibold text-xs border border-[#eee9ea] hover:bg-[#f2eaed] transition"
                    >
                        ← Back to Dashboard
                    </button>
                </header>

                <div className="p-5 sm:p-8" style={{ paddingTop: '10px' }}>
                    {/* Search Field & Stats */}
                    <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)] mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:max-w-md">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8385]"
                            />
                            <input
                                type="text"
                                placeholder="Search by shop name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-[#e9e5e6] bg-[#faf7f8] text-sm focus:outline-none focus:border-[#694f5c] transition"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8385] hover:text-[#292628]"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <p className="text-xs font-semibold tracking-wide text-[#8a8385] self-end sm:self-center">
                            Showing {filteredStores.length} of {stores.length} stores
                        </p>
                    </section>

                    {/* Table Section */}
                    <section className="bg-white rounded-2xl shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)] overflow-hidden">
                        {loading ? (
                            <TableLoading />
                        ) : filteredStores.length === 0 ? (
                            <EmptyState isSearching={Boolean(searchTerm.trim())} />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px]">
                                    <thead>
                                        <tr className="bg-[#faf7f8] text-left text-xs uppercase tracking-[0.12em] text-[#9a9295]">
                                            <th className="px-6 py-4 font-semibold">Store Name</th>
                                            <th className="px-6 py-4 font-semibold">Shopkeeper & Number</th>
                                            <th className="px-6 py-4 font-semibold">Full Address</th>
                                            <th className="px-6 py-4 font-semibold">Register Date</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredStores.map((store, index) => {
                                            const shopName =
                                                store?.shopName ||
                                                store?.shop?.shopName ||
                                                '—';

                                            const userName =
                                                store?.userName ||
                                                store?.user?.fullName ||
                                                '—';

                                            const mobileNumber =
                                                store?.mobileNumber ||
                                                store?.user?.mobileNumber ||
                                                '—';

                                            const fullAddress = [
                                                store?.address || store?.shop?.address,
                                                store?.city || store?.shop?.city,
                                                store?.state || store?.shop?.state,
                                                store?.pincode || store?.shop?.pincode
                                            ]
                                                .filter(
                                                    (value) =>
                                                        value !== null &&
                                                        value !== undefined &&
                                                        String(value).trim() !== ''
                                                )
                                                .map((value) => String(value).trim())
                                                .join(', ');

                                            const createdAt =
                                                store?.createdAt ||
                                                store?.shop?.createdAt ||
                                                store?.registeredAt;

                                            return (
                                                <tr
                                                    key={`store-${index}`}
                                                    className="border-t border-[#f0eded] hover:bg-[#fcfafb] transition"
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-[#eee5e9] text-[#694f5c] flex items-center justify-center shrink-0">
                                                                🏪
                                                            </div>
                                                            <p className="text-sm font-semibold text-[#403a3d]">
                                                                {shopName}
                                                            </p>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="space-y-2">
                                                            <p className="text-sm font-semibold text-[#403a3d] flex items-center gap-2">
                                                                <User
                                                                    size={14}
                                                                    className="text-[#8a8385] shrink-0"
                                                                />
                                                                {userName}
                                                            </p>

                                                            <p className="text-xs text-[#706a6c] flex items-center gap-2">
                                                                <Phone
                                                                    size={12}
                                                                    className="text-[#8a8385] shrink-0"
                                                                />
                                                                {mobileNumber}
                                                            </p>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="flex items-start gap-2 max-w-[500px]">
                                                            <MapPin
                                                                size={17}
                                                                className="mt-1 shrink-0 text-[#8a8385]"
                                                            />
                                                            <span className="text-sm text-[#706a6c] leading-6 break-words">
                                                                {fullAddress || '—'}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5 text-sm text-[#706a6c] whitespace-nowrap">
                                                        {formatDate(createdAt)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
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

function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function Loading() {
    return (
        <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-sm text-[#777174]">
                    Loading registered stores...
                </p>
            </div>
        </div>
    );
}

function TableLoading() {
    return (
        <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#8a8385] mt-4">
                Loading stores data...
            </p>
        </div>
    );
}

function EmptyState({ isSearching }) {
    return (
        <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#faf7f8] text-[#694f5c] flex items-center justify-center mx-auto">
                <Store size={24} />
            </div>
            <p className="font-semibold mt-4">
                {isSearching ? 'No matching stores found' : 'No stores registered'}
            </p>
            <p className="text-sm text-[#8a8385] mt-1">
                {isSearching
                    ? 'Try searching with a different store name.'
                    : 'Registered stores will appear here.'}
            </p>
        </div>
    );
}