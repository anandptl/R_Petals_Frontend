'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../components/AdminSidebar';
import {
    Store,
    Eye,
    Search,
    RefreshCw,
    Clock3,
    CheckCircle2,
    XCircle,
    MapPin
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminShopsPage() {

    const router = useRouter();

    const [checking, setChecking] = useState(true);
    const [shops, setShops] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('role');

        if (!token) {
            router.replace('/login?redirect=/admin/shops');
            return;
        }

        if (role !== 'ADMIN') {
            router.replace('/');
            return;
        }

        setChecking(false);

        loadShops(token);

    }, [router]);

    const loadShops = async (token) => {

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/admin/shops`,
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
                    result.message || 'Failed to load shops'
                );
            }

            const sortedShops = [...(result.data || [])].sort((a, b) => {

                // PENDING sabse upar
                if (a.status === 'PENDING' && b.status !== 'PENDING') {
                    return -1;
                }

                if (a.status !== 'PENDING' && b.status === 'PENDING') {
                    return 1;
                }

                // Same status me newest first
                return new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0);
            });

            setShops(sortedShops);

        } catch (error) {

            console.error('SHOP LIST ERROR:', error);

        } finally {

            setLoading(false);

        }
    };

    const refresh = () => {

        const token = localStorage.getItem('accessToken');

        if (token) {
            loadShops(token);
        }
    };

    

    const filteredShops = shops.filter((shop) => {

        const text = search.toLowerCase();

        return (
            shop.shopName?.toLowerCase().includes(text) ||
            shop.shopkeeperName?.toLowerCase().includes(text) ||
            shop.city?.toLowerCase().includes(text) ||
            shop.state?.toLowerCase().includes(text) ||
            shop.gstNumber?.toLowerCase().includes(text)
        );

    });

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

            {/* SIDEBAR */}

            <AdminSidebar />

            {/* MAIN */}

            <main className="lg:ml-[255px] min-h-screen">

                {/* HEADER */}

                <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between">

                    <div>

                        <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                            Administration
                        </p>

                        <h1 className="text-xl font-semibold mt-1">
                            Shops
                        </h1>

                    </div>

                    <button
                        onClick={refresh}
                        className="w-10 h-10 rounded-xl bg-[#faf7f8] flex items-center justify-center text-[#777174] hover:bg-[#f1e9ec] transition"
                        title="Refresh"
                    >
                        <RefreshCw size={18} />
                    </button>

                </header>

                {/* CONTENT */}

                <div className="p-5 sm:p-8">

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

                        <div>

                            <p className="text-sm text-[#8a8385]">
                                Management
                            </p>

                            <h2 className="text-3xl font-bold mt-1">
                                All Shops
                            </h2>

                            <p className="text-sm text-[#8a8385] mt-2">
                                View and manage all registered shops.
                            </p>

                        </div>

                        <div className="flex items-center gap-3">

                            <div className="bg-white border border-[#e9e5e6] rounded-xl px-4 py-3 flex items-center gap-3 w-full sm:w-[300px]">

                                <Search
                                    size={18}
                                    className="text-[#9a9295]"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search shops..."
                                    className="outline-none bg-transparent w-full text-sm"
                                />

                            </div>

                        </div>

                    </div>

                    {/* SUMMARY */}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">

                        <MiniCard
                            title="Total Shops"
                            value={shops.length}
                            icon={<Store size={20} />}
                            accent="bg-[#e8eef2]"
                        />

                        <MiniCard
                            title="Pending"
                            value={shops.filter(
                                shop => shop.status === 'PENDING'
                            ).length}
                            icon={<Clock3 size={20} />}
                            accent="bg-[#f3e9df]"
                        />

                        <MiniCard
                            title="Approved"
                            value={shops.filter(
                                shop => shop.status === 'APPROVED'
                            ).length}
                            icon={<CheckCircle2 size={20} />}
                            accent="bg-[#e5eee9]"
                        />

                    </div>

                    {/* TABLE */}

                    <section className="mt-8 bg-white rounded-2xl shadow-[5px_5px_16px_rgba(0,0,0,0.04),-5px_-5px_16px_rgba(255,255,255,0.9)] overflow-hidden">

                        <div className="px-6 py-5 border-b border-[#eeeaea]">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                                        Shop Directory
                                    </p>

                                    <h3 className="text-xl font-semibold mt-1">
                                        Registered Shops
                                    </h3>

                                </div>

                                <span className="text-sm text-[#8a8385]">
                                    {filteredShops.length} shops
                                </span>

                            </div>

                        </div>

                        {loading ? (

                            <div className="py-20 text-center">

                                <div className="w-9 h-9 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin mx-auto" />

                                <p className="text-sm text-[#8a8385] mt-4">
                                    Loading shops...
                                </p>

                            </div>

                        ) : filteredShops.length === 0 ? (

                            <div className="py-20 text-center">

                                <div className="text-4xl">
                                    🏪
                                </div>

                                <p className="font-medium mt-3">
                                    No shops found
                                </p>

                                <p className="text-sm text-[#8a8385] mt-1">
                                    No registered shop matches your search.
                                </p>

                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-[#faf9f9]">

                                        <tr className="text-left text-xs uppercase tracking-wider text-[#9a9295]">

                                            <th className="px-6 py-4">
                                                Shop
                                            </th>

                                            <th className="px-6 py-4">
                                                Owner
                                            </th>

                                            <th className="px-6 py-4">
                                                Location
                                            </th>

                                            <th className="px-6 py-4">
                                                Status
                                            </th>

                                            <th className="px-6 py-4">
                                                Today
                                            </th>

                                            <th className="px-6 py-4 text-right">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-[#eeeaea]">

                                        {filteredShops.map((shop) => (

                                            <tr
                                                key={shop.id}
                                                className="hover:bg-[#fcfbfb] transition"
                                            >

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-3">

                                                        {shop.shopImage ? (

                                                            <img
                                                                src={shop.shopImage}
                                                                alt={shop.shopName}
                                                                className="w-12 h-12 rounded-xl object-cover border border-[#eeeaea]"
                                                            />

                                                        ) : (

                                                            <div className="w-12 h-12 rounded-xl bg-[#eee5e9] flex items-center justify-center text-[#6d5260]">
                                                                <Store size={20} />
                                                            </div>

                                                        )}

                                                        <div>

                                                            <p className="font-semibold">
                                                                {shop.shopName || 'Unnamed Shop'}
                                                            </p>

                                                            <p className="text-xs text-[#9a9295] mt-1">
                                                                ID: {shop.id}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                <td className="px-6 py-5">

                                                    <p className="text-sm font-medium">
                                                        {shop.shopkeeperName || '-'}
                                                    </p>

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-2 text-sm text-[#706a6c]">

                                                        <MapPin size={15} />

                                                        <span>
                                                            {shop.city || '-'}, {shop.state || '-'}
                                                        </span>

                                                    </div>

                                                </td>

                                                <td className="px-6 py-5">
                                                    <StatusBadge status={shop.status} />
                                                </td>

                                                <td className="px-6 py-5">
                                                    <TodayBadge
                                                        active={shop.todayActive}
                                                    />
                                                </td>

                                                <td className="px-6 py-5 text-right">

                                                    <button
                                                        onClick={() =>
                                                            router.push(
                                                                `/admin/shops/${shop.id}`
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eee5e9] text-[#694f5c] text-sm font-semibold hover:bg-[#e4d8de] transition"
                                                    >
                                                        <Eye size={16} />
                                                        View Details
                                                    </button>

                                                </td>

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
        w-full flex items-center gap-3 px-4 py-3 rounded-xl
        text-sm font-medium transition
        ${active
                    ? 'bg-[#eee5e9] text-[#694f5c]'
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

function MiniCard({
    title,
    value,
    icon,
    accent,
}) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-[5px_5px_16px_rgba(0,0,0,0.04),-5px_-5px_16px_rgba(255,255,255,0.9)]">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-[#8a8385]">
                        {title}
                    </p>

                    <p className="text-2xl font-bold mt-2">
                        {value}
                    </p>

                </div>

                <div className={`w-11 h-11 ${accent} rounded-xl flex items-center justify-center text-[#6d5260]`}>
                    {icon}
                </div>

            </div>

        </div>
    );
}

function StatusBadge({ status }) {

    const config = {
        APPROVED: {
            text: 'Approved',
            className: 'bg-[#e5eee9] text-[#466653]',
            icon: <CheckCircle2 size={14} />
        },
        PENDING: {
            text: 'Pending',
            className: 'bg-[#f3e9df] text-[#8a6346]',
            icon: <Clock3 size={14} />
        },
        REJECTED: {
            text: 'Rejected',
            className: 'bg-[#f5e4e6] text-[#8b4f5d]',
            icon: <XCircle size={14} />
        }
    };

    const item = config[status] || {
        text: status || 'Unknown',
        className: 'bg-[#eeeeee] text-[#666666]',
        icon: null
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${item.className}`}>
            {item.icon}
            {item.text}
        </span>
    );
}

function TodayBadge({ active }) {

    return active ? (

        <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-semibold bg-[#e5eee9] text-[#466653]">
            Open Today
        </span>

    ) : (

        <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-semibold bg-[#f1e9ec] text-[#8b4f5d]">
            Closed Today
        </span>

    );
}