'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Store,
    MapPin,
    ArrowRight,
    Activity,
    Phone,
    User
} from 'lucide-react';

import AdminSidebar from '@/app/admin/components/AdminSidebar';
import { apiFetch } from '@/lib/auth';

export default function ShopAdminDashboard() {

    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [checking, setChecking] =useState(true);
    const [user, setUser] = useState(null);
    const [stores, setStores] =useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        let mounted = true;

        const loadStores = async () => {

            try {

                const token =
                    localStorage.getItem('accessToken');

                const role =
                    localStorage.getItem('role');


                if (!token) {

                    router.replace(
                        '/login?redirect=/admin/stores'
                    );

                    return;
                }


                if (role !== 'ADMIN') {

                    router.replace('/');

                    return;
                }


                if (mounted) {
                    setChecking(false);
                }


                const response =
                    await apiFetch(
                        `${API_URL}/admin/stores`,
                        {
                            method: 'GET'
                        }
                    );


                if (response.status === 401) {

                    router.replace(
                        '/login?redirect=/admin/stores'
                    );

                    return;
                }


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        'Failed to load stores'
                    );
                }


                let storesData = [];


                if (Array.isArray(result)) {

                    storesData = result;

                } else if (
                    Array.isArray(result.data)
                ) {

                    storesData = result.data;

                } else if (
                    Array.isArray(result.data?.stores)
                ) {

                    storesData =
                        result.data.stores;

                }


                if (mounted) {

                    setStores(
                        storesData
                    );
                }


            } catch (error) {

                console.error(
                    'Store loading error:',
                    error
                );

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


    const activeStores =
        stores.filter((store) => {

            const shop =
                store?.shop ||
                store?.store ||
                store;

            return shop?.todayActive === true;

        }).length;


    if (checking) {

        return <Loading />;

    }


    return (

        <div className="min-h-screen bg-[#f7f7f5] text-[#292628]">

            <AdminSidebar />


            <main className="lg:ml-[255px] min-h-screen">

                <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                            Store Management
                        </p>
                        <h1 className="text-xl font-semibold mt-1">
                            Stores Dashboard
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


                <div className="p-5 sm:p-8" style={{ paddingTop: '10px' }}>


                    <section>
                        <h2 className="text-3xl font-bold mt-1">
                            Store Management
                        </h2>
                        <p className="text-sm text-[#8a8385]">
                            Manage all registered stores and their details.
                        </p>

                    </section>


                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">


                        <StatCard
                            title="Registered Stores"
                            value={
                                loading
                                    ? '...'
                                    : stores.length
                            }
                            icon="🏪"
                            accent="bg-[#e8eef2]"
                        />


                        <StatCard
                            title="Active Stores"
                            value={
                                loading
                                    ? '...'
                                    : activeStores
                            }
                            icon={
                                <Activity size={21} />
                            }
                            accent="bg-[#e5eee9]"
                        />


                        <StatCard
                            title="Store Orders"
                            value="0"
                            icon="🛒"
                            accent="bg-[#f3e9df]"
                        />


                        <StatCard
                            title="Inventory Items"
                            value="0"
                            icon="📦"
                            accent="bg-[#eee4eb]"
                        />

                    </section>


                    <section className="mt-10">

                        <div className="mb-5">

                            <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                                Quick Access
                            </p>


                            <h2 className="text-2xl font-bold mt-1">
                                Store Controls
                            </h2>

                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                            <ControlCard
                                icon="🏪"
                                title="Register Stores"
                                description="Open and manage store registrations."
                                onClick={() =>
                                    router.push(
                                        '/admin/stores/registered'
                                    )
                                }
                            />


                            <ControlCard
                                icon="🛒"
                                title="Store Orders"
                                description="Track orders placed through registered stores."
                                onClick={() =>
                                    router.push(
                                        '/admin/stores/orders'
                                    )
                                }
                            />


                            <ControlCard
                                icon="📦"
                                title="Store Inventory"
                                description="Monitor products and stock for each store."
                                onClick={() =>
                                    router.push(
                                        '/admin/stores/inventory'
                                    )
                                }
                            />

                        </div>

                    </section>


                    <section className="mt-10 bg-white rounded-2xl shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)] overflow-hidden">


                        <div className="p-6 border-b border-[#eeeaea] flex items-center justify-between">

                            <div>

                                <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                                    Latest
                                </p>


                                <h2 className="text-xl font-semibold mt-1">
                                    Registered Stores
                                </h2>


                                <p className="text-sm text-[#8a8385] mt-1">
                                    Store, shopkeeper, contact and complete address details.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push('/admin/stores/all')
                                }
                                className="text-sm font-semibold text-[#694f5c] flex items-center gap-2 hover:gap-3 transition-all"
                            >
                                View all
                                <ArrowRight size={17} />
                            </button>

                        </div>


                        {loading ? (

                            <TableLoading />

                        ) : stores.length === 0 ? (

                            <EmptyState />

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full min-w-[900px]">

                                    <thead>

                                        <tr className="bg-[#faf7f8] text-left text-xs uppercase tracking-[0.12em] text-[#9a9295]">

                                            <th className="px-6 py-4 font-semibold">
                                                Store Name
                                            </th>


                                            <th className="px-6 py-4 font-semibold">
                                                Shopkeeper & Number
                                            </th>


                                            <th className="px-6 py-4 font-semibold">
                                                Full Address
                                            </th>


                                            <th className="px-6 py-4 font-semibold">
                                                Register Date
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {stores
                                            .slice(0, 6)
                                            .map((store, index) => {

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
                                                    .map(
                                                        (value) => String(value).trim()
                                                    )
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

                                                            {formatDate(
                                                                createdAt
                                                            )}

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

    if (!value) {
        return '—';
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return '—';
    }


    return date.toLocaleDateString(
        'en-IN',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }
    );
}


function StatCard({
    title,
    value,
    icon,
    accent
}) {

    return (

        <div className="bg-white rounded-2xl p-5 shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)] flex items-center justify-between">

            <div>

                <p className="text-sm text-[#8a8385]">
                    {title}
                </p>


                <p className="text-2xl font-bold mt-2">
                    {value}
                </p>

            </div>


            <div
                className={`w-11 h-11 rounded-xl ${accent} text-[#694f5c] flex items-center justify-center`}
            >
                {icon}
            </div>

        </div>
    );
}


function ControlCard({
    icon,
    title,
    description,
    onClick
}) {

    return (

        <button
            type="button"
            onClick={onClick}
            className="text-left bg-white rounded-2xl p-6 shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)] hover:-translate-y-0.5 transition group"
        >

            <div className="w-11 h-11 rounded-xl bg-[#eee5e9] text-[#694f5c] flex items-center justify-center">
                {icon}
            </div>


            <h3 className="text-lg font-semibold mt-5">
                {title}
            </h3>


            <p className="text-sm text-[#8a8385] mt-2 leading-6">
                {description}
            </p>


            <span className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-[#694f5c]">

                Open

                <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition"
                />

            </span>

        </button>
    );
}


function Loading() {

    return (

        <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">

            <div className="text-center">

                <div className="w-10 h-10 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin mx-auto" />

                <p className="mt-4 text-sm text-[#777174]">
                    Loading store management...
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
                Loading registered stores...
            </p>

        </div>
    );
}


function EmptyState() {

    return (

        <div className="p-12 text-center">

            <div className="w-14 h-14 rounded-2xl bg-[#faf7f8] text-[#694f5c] flex items-center justify-center mx-auto">

                <Store size={24} />

            </div>


            <p className="font-semibold mt-4">
                No stores registered
            </p>


            <p className="text-sm text-[#8a8385] mt-1">
                Registered stores will appear here.
            </p>

        </div>
    );
}