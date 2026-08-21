'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser, initializeAuthSession, logout } from '@/lib/auth';

export default function ShopkeeperPage() {
    const router = useRouter();

    const [checking, setChecking] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        let mounted = true;

        const restoreSession = async () => {
            try {
                const token = await initializeAuthSession();

                if (!mounted) return;

                const role = localStorage.getItem('role')?.toUpperCase();

                if (!token) {
                    router.replace('/login?redirect=/darkStore');
                    return;
                }

                if (role !== 'SHOPKEEPER') {
                    router.replace('/');
                    return;
                }

                setUser(getStoredUser());
                setChecking(false);
            } catch (error) {
                console.error('SHOPKEEPER SESSION ERROR:', error);
                if (mounted) {
                    router.replace('/login?redirect=/darkStore');
                }
            }
        };

        restoreSession();

        return () => {
            mounted = false;
        };
    }, [router]);

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            router.replace('/login');
        }
    };

    if (checking) {
        return (
            <div className="min-h-screen bg-[#f4f8f7] flex items-center justify-center">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-[#dce9e5] border-t-[#557f75] rounded-full animate-spin mx-auto" />

                    <p className="mt-4 text-sm text-[#71807c]">
                        Loading shopkeeper panel...
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f8f7] text-[#293331]">

            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}

            <aside className="fixed hidden lg:flex left-0 top-0 bottom-0 w-[255px] bg-white border-r border-[#e4ebe8] flex-col">

                {/* LOGO */}

                <div className="h-[82px] px-7 flex items-center border-b border-[#e8eeec]">

                    <img
                        src="/logo1.png"
                        alt="R Petals"
                        className="h-12 w-auto object-contain"
                    />

                </div>

                {/* SHOPKEEPER PROFILE */}

                <div className="p-5">

                    <div className="bg-[#f4f8f7] rounded-2xl p-4">

                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-[#dce9e5] flex items-center justify-center text-[#557f75] font-bold">
                                S
                            </div>

                            <div className="min-w-0">

                                <p className="text-sm font-semibold truncate">
                                    {user?.name || 'Shopkeeper'}
                                </p>

                                <p className="text-xs text-[#7b8885] mt-1">
                                    SHOPKEEPER
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* NAVIGATION */}

                <nav className="px-4 space-y-1">

                    <NavItem
                        icon="▦"
                        title="Dashboard"
                        active
                    />

                    <NavItem
                        icon="🏪"
                        title="My Shop"
                        onClick={() => router.push('/shopkeeper/shop')}
                    />

                    <NavItem
                        icon="🌹"
                        title="Products"
                        onClick={() => router.push('/shopkeeper/products')}
                    />

                    <NavItem
                        icon="+"
                        title="Add Product"
                        onClick={() => router.push('/shopkeeper/products/add')}
                    />

                    <NavItem
                        icon="▤"
                        title="Orders"
                        onClick={() => router.push('/shopkeeper/orders')}
                    />

                    <NavItem
                        icon="▥"
                        title="Inventory"
                        onClick={() => router.push('/shopkeeper/inventory')}
                    />

                    <NavItem
                        icon="♙"
                        title="Shop Profile"
                        onClick={() => router.push('/shopkeeper/profile')}
                    />

                    <NavItem
                        icon="₹"
                        title="Sales"
                        onClick={() => router.push('/shopkeeper/sales')}
                    />

                </nav>

                {/* LOGOUT */}

                <div className="mt-auto p-5 border-t border-[#e8eeec]">

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#C74747] hover:bg-[#557f75] transition"
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </aside>

            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            <main className="lg:ml-[255px] min-h-screen">

                {/* TOPBAR */}

                <header className="h-[82px] bg-white border-b border-[#e4ebe8] px-5 sm:px-8 flex items-center justify-between">

                    <div>

                        <p className="text-xs uppercase tracking-[0.16em] text-[#8b9895]">
                            Shop Management
                        </p>

                        <h1 className="text-xl font-semibold mt-1">
                            Shopkeeper Dashboard
                        </h1>

                    </div>

                    <div className="flex items-center gap-3">

                        <button className="w-10 h-10 rounded-xl bg-[#f4f8f7] flex items-center justify-center text-[#71807c] hover:bg-[#eaf2ef] transition">
                            🔔
                        </button>

                        <div className="w-10 h-10 rounded-xl bg-[#dce9e5] text-[#557f75] flex items-center justify-center font-bold">
                            S
                        </div>

                    </div>

                </header>

                {/* CONTENT */}

                <div className="p-5 sm:p-8">

                    {/* WELCOME */}

                    <section>

                        <p className="text-sm text-[#7b8885]">
                            Welcome back,
                        </p>

                        <h2 className="text-3xl font-bold mt-1">
                            {user?.name || 'Shopkeeper'}
                        </h2>

                        <p className="text-sm text-[#7b8885] mt-2">
                            Manage your shop, products and orders from one place.
                        </p>

                    </section>

                    {/* SHOP STATUS */}

                    <section className="mt-8">

                        <div className="bg-white rounded-2xl p-6 shadow-[5px_5px_16px_rgba(0,0,0,0.04),-5px_-5px_16px_rgba(255,255,255,0.9)]">

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                                <div>

                                    <p className="text-xs uppercase tracking-[0.15em] text-[#8b9895]">
                                        Shop Status
                                    </p>

                                    <h3 className="text-xl font-semibold mt-2">
                                        Your shop is active
                                    </h3>

                                    <p className="text-sm text-[#7b8885] mt-1">
                                        Your shop is ready to receive customers.
                                    </p>

                                </div>

                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e5f1ec] text-[#4f806f] text-sm font-semibold">

                                    <span className="w-2 h-2 rounded-full bg-[#5c9b82]" />

                                    Active

                                </div>

                            </div>

                        </div>

                    </section>

                    {/* STATS */}

                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">

                        <StatCard
                            title="Products"
                            value="0"
                            icon="🌹"
                            accent="bg-[#eee4eb]"
                        />

                        <StatCard
                            title="Orders"
                            value="0"
                            icon="▤"
                            accent="bg-[#e8eef2]"
                        />

                        <StatCard
                            title="Inventory"
                            value="0"
                            icon="▥"
                            accent="bg-[#e5eee9]"
                        />

                        <StatCard
                            title="Sales"
                            value="₹0"
                            icon="₹"
                            accent="bg-[#f3e9df]"
                        />

                    </section>

                    {/* SHOP MANAGEMENT */}

                    <section className="mt-10">

                        <div className="mb-5">

                            <p className="text-xs uppercase tracking-[0.16em] text-[#8b9895]">
                                Shop Management
                            </p>

                            <h2 className="text-2xl font-bold mt-1">
                                Quick Actions
                            </h2>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                            <ManagementCard
                                icon="🏪"
                                title="My Shop"
                                description="View and manage your shop information."
                                onClick={() => router.push('/shopkeeper/shop')}
                            />

                            <ManagementCard
                                icon="🌹"
                                title="Products"
                                description="View, update and manage your products."
                                onClick={() => router.push('/shopkeeper/products')}
                            />

                            <ManagementCard
                                icon="+"
                                title="Add Product"
                                description="Add a new product with images and category."
                                onClick={() => router.push('/shopkeeper/products/add')}
                            />

                            <ManagementCard
                                icon="▤"
                                title="Orders"
                                description="View and manage your customer orders."
                                onClick={() => router.push('/shopkeeper/orders')}
                            />

                            <ManagementCard
                                icon="▥"
                                title="Inventory"
                                description="Monitor product stock and availability."
                                onClick={() => router.push('/shopkeeper/inventory')}
                            />

                            <ManagementCard
                                icon="♙"
                                title="Shop Profile"
                                description="Update your shop profile and details."
                                onClick={() => router.push('/shopkeeper/profile')}
                            />

                            <ManagementCard
                                icon="₹"
                                title="Sales"
                                description="View your sales and revenue information."
                                onClick={() => router.push('/shopkeeper/sales')}
                            />

                        </div>

                    </section>

                    {/* RECENT ORDERS */}

                    <section className="mt-10">

                        <div className="bg-white rounded-2xl p-6 shadow-[5px_5px_16px_rgba(0,0,0,0.04),-5px_-5px_16px_rgba(255,255,255,0.9)]">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-xs uppercase tracking-[0.16em] text-[#8b9895]">
                                        Orders
                                    </p>

                                    <h2 className="text-xl font-semibold mt-1">
                                        Recent Orders
                                    </h2>

                                </div>

                                <button
                                    onClick={() => router.push('/shopkeeper/orders')}
                                    className="text-sm font-semibold text-[#557f75] hover:underline"
                                >
                                    View all →
                                </button>

                            </div>

                            <div className="mt-6 rounded-xl bg-[#f7faf9] py-12 text-center">

                                <div className="text-3xl">
                                    📦
                                </div>

                                <p className="font-medium mt-3">
                                    No orders yet
                                </p>

                                <p className="text-sm text-[#7b8885] mt-1">
                                    Your latest orders will appear here.
                                </p>

                            </div>

                        </div>

                    </section>

                    <footer className="py-8 text-center">

                        <p className="text-xs text-[#8b9895]">
                            © 2026 R Petals • Shopkeeper Panel
                        </p>

                    </footer>

                </div>

            </main>

        </div>
    );
}


/* ========================================================= */
/* NAV ITEM */
/* ========================================================= */

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
                    ? 'bg-[#e5eeeb] text-[#52796f] shadow-[3px_3px_8px_rgba(0,0,0,0.04),-3px_-3px_8px_rgba(255,255,255,0.8)]'
                    : 'text-[#6f7b78] hover:bg-[#f4f8f7] hover:text-[#52796f]'
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


/* ========================================================= */
/* STAT CARD */
/* ========================================================= */

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

                    <p className="text-sm text-[#7b8885]">
                        {title}
                    </p>

                    <p className="text-3xl font-bold mt-3">
                        {value}
                    </p>

                </div>

                <div
                    className={`
            w-12
            h-12
            ${accent}
            rounded-xl
            flex
            items-center
            justify-center
            text-xl
            shadow-[3px_3px_8px_rgba(0,0,0,0.05),-3px_-3px_8px_rgba(255,255,255,0.8)]
          `}
                >
                    {icon}
                </div>

            </div>

        </div>
    );
}


/* ========================================================= */
/* MANAGEMENT CARD */
/* ========================================================= */

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

                <div className="w-12 h-12 rounded-xl bg-[#e8f0ed] flex items-center justify-center text-xl shadow-[3px_3px_8px_rgba(0,0,0,0.04),-3px_-3px_8px_rgba(255,255,255,0.8)]">
                    {icon}
                </div>

                <div className="w-9 h-9 rounded-full bg-[#f4f8f7] flex items-center justify-center text-[#7b8885] group-hover:bg-[#e5eeeb] transition">
                    →
                </div>

            </div>

            <h3 className="text-lg font-semibold mt-5">
                {title}
            </h3>

            <p className="text-sm text-[#7b8885] mt-2 leading-6">
                {description}
            </p>

            <p className="text-xs font-semibold text-[#557f75] mt-5">
                Open →
            </p>

        </button>
    );
}