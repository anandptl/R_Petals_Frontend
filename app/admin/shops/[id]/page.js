'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminSidebar from '../../components/AdminSidebar';

import {
    ArrowLeft,
    Store,
    User,
    MapPin,
    Phone,
    Mail,
    Package,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock3,
    Navigation,
    ShieldCheck,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ShopDetailsPage() {

    const router = useRouter();
    const params = useParams();

    const shopId = params.id;

    const [shopData, setShopData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [actionLoading, setActionLoading] = useState(null);
    const [actionMessage, setActionMessage] = useState('');

    useEffect(() => {

        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('role');

        if (!token) {
            router.replace(
                `/login?redirect=/admin/shops/${shopId}`
            );
            return;
        }

        if (role !== 'ADMIN') {
            router.replace('/');
            return;
        }

        fetchShopDetails(token);

    }, [router, shopId]);

    const fetchShopDetails = async (token) => {

        try {

            setLoading(true);
            setError('');

            const response = await fetch(
                `${API_URL}/admin/shops/${shopId}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const result = await response.json();

            console.log(
                'SHOP DETAILS RESPONSE:',
                result
            );

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    'Unable to load shop details'
                );

            }

            setShopData(result.data);

        } catch (err) {

            console.error(
                'SHOP DETAILS ERROR:',
                err
            );

            setError(
                err.message ||
                'Something went wrong'
            );

        } finally {

            setLoading(false);

        }
    };

    const handleApprove = async () => {

        const token =
            localStorage.getItem('accessToken');

        if (!token) {

            router.replace('/login');

            return;
        }

        try {

            setActionLoading('approve');
            setActionMessage('');
            setError('');

            const response = await fetch(
                `${API_URL}/admin/shops/${shopId}/approve`,
                {
                    method: 'PATCH',

                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const result =
                await response.json();

            console.log(
                'APPROVE SHOP RESPONSE:',
                result
            );

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    'Failed to approve shop'
                );

            }

            // Update UI immediately
            setShopData(prev => ({

                ...prev,

                shop: {
                    ...prev.shop,

                    status: 'APPROVED',

                    active: true,

                    todayActive: false,
                },

                user: {
                    ...prev.user,

                    role: 'SHOPKEEPER',
                },

            }));

            setActionMessage(
                'Shop approved successfully.'
            );

        } catch (err) {

            console.error(
                'APPROVE SHOP ERROR:',
                err
            );

            setError(
                err.message ||
                'Unable to approve shop'
            );

        } finally {

            setActionLoading(null);

        }
    };


    const handleReject = async () => {

        const token =
            localStorage.getItem('accessToken');

        if (!token) {

            router.replace('/login');

            return;
        }

        try {

            setActionLoading('reject');
            setActionMessage('');
            setError('');

            const response = await fetch(
                `${API_URL}/admin/shops/${shopId}/reject`,
                {
                    method: 'PATCH',

                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const result =
                await response.json();

            console.log(
                'REJECT SHOP RESPONSE:',
                result
            );

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    'Failed to reject shop'
                );

            }

            // Update UI immediately
            setShopData(prev => ({

                ...prev,

                shop: {
                    ...prev.shop,

                    status: 'REJECTED',

                    active: false,

                    todayActive: false,
                },

            }));

            setActionMessage(
                'Shop rejected successfully.'
            );

        } catch (err) {

            console.error(
                'REJECT SHOP ERROR:',
                err
            );

            setError(
                err.message ||
                'Unable to reject shop'
            );

        } finally {

            setActionLoading(null);

        }
    };

    if (loading) {

        return (

            <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-[#e7dfe3] border-t-[#6d5260] rounded-full animate-spin mx-auto" />

                    <p className="mt-4 text-sm text-[#777174]">
                        Loading shop details...
                    </p>

                </div>

            </div>

        );
    }


    if (error || !shopData) {

        return (

            <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center p-5">

                <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-[5px_5px_16px_rgba(0,0,0,0.04)]">

                    <div className="w-14 h-14 rounded-full bg-[#f5e4e6] text-[#8b4f5d] flex items-center justify-center mx-auto">

                        <XCircle size={28} />

                    </div>

                    <h2 className="text-xl font-bold mt-5">
                        Shop Not Found
                    </h2>

                    <p className="text-sm text-[#8a8385] mt-2">
                        {error || 'Unable to load this shop.'}
                    </p>

                    <button
                        onClick={() =>
                            router.push('/admin/shops')
                        }
                        className="mt-6 px-5 py-3 rounded-xl bg-[#eee5e9] text-[#694f5c] font-semibold hover:bg-[#e3d8dd] transition"
                    >
                        Back to Shops
                    </button>

                </div>

            </div>

        );
    }


    const shop = shopData.shop;
    const owner = shopData.user;
    const products = shopData.products || [];

    return (

        <div className="min-h-screen bg-[#f7f7f5] text-[#292628]">

            <AdminSidebar />


            <main className="lg:ml-[255px] min-h-screen">


                <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center">

                    <button
                        onClick={() =>
                            router.push('/admin/shops')
                        }
                        className="w-10 h-10 rounded-xl bg-[#faf7f8] flex items-center justify-center text-[#6d5260] hover:bg-[#eee5e9] transition"
                    >

                        <ArrowLeft size={19} />

                    </button>


                    <div className="ml-4">

                        <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                            Administration / Shops
                        </p>

                        <h1 className="text-xl font-semibold mt-1">
                            Shop Details
                        </h1>

                    </div>

                </header>

                <div className="p-5 sm:p-8">

                    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-[5px_5px_16px_rgba(0,0,0,0.04),-5px_-5px_16px_rgba(255,255,255,0.9)]">

                        <div className="flex flex-col md:flex-row md:items-center gap-6">


                            {/* SHOP IMAGE */}

                            <div className="shrink-0">

                                {shop.shopImage ? (

                                    <img
                                        src={shop.shopImage}
                                        alt={shop.shopName}
                                        className="w-28 h-28 rounded-2xl object-cover border border-[#eeeaea]"
                                    />

                                ) : (

                                    <div className="w-28 h-28 rounded-2xl bg-[#eee5e9] text-[#6d5260] flex items-center justify-center">

                                        <Store size={42} />

                                    </div>

                                )}

                            </div>


                            {/* SHOP NAME */}

                            <div className="flex-1">

                                <div className="flex flex-wrap items-center gap-3">

                                    <h2 className="text-3xl font-bold">
                                        {shop.shopName || 'Unnamed Shop'}
                                    </h2>

                                    <StatusBadge
                                        status={shop.status}
                                    />

                                </div>


                                <p className="text-sm text-[#8a8385] mt-2">
                                    Shopkeeper: {shop.shopkeeperName || '-'}
                                </p>


                                <p className="text-xs text-[#9a9295] mt-2 break-all">
                                    Shop ID: {shop.id}
                                </p>

                            </div>


                            {/* TODAY STATUS */}

                            <TodayStatus
                                active={shop.todayActive}
                            />

                        </div>

                    </section>

                    <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">

                        <StatusCard
                            title="Shop Status"
                            value={shop.status || '-'}
                            icon={<ShieldCheck size={21} />}
                            type={
                                shop.status === 'APPROVED'
                                    ? 'success'
                                    : shop.status === 'REJECTED'
                                        ? 'danger'
                                        : 'warning'
                            }
                        />


                        <StatusCard
                            title="Shop Active"
                            value={
                                shop.active
                                    ? 'Active'
                                    : 'Inactive'
                            }
                            icon={<Store size={21} />}
                            type={
                                shop.active
                                    ? 'success'
                                    : 'danger'
                            }
                        />


                        <StatusCard
                            title="Today"
                            value={
                                shop.todayActive
                                    ? 'Open Today'
                                    : 'Closed Today'
                            }
                            icon={<Calendar size={21} />}
                            type={
                                shop.todayActive
                                    ? 'success'
                                    : 'danger'
                            }
                        />

                    </section>

                    <DetailSection
                        icon={<Store size={20} />}
                        title="Shop Information"
                    >

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                            <InfoCard
                                label="Shop Name"
                                value={shop.shopName}
                            />

                            <InfoCard
                                label="Shopkeeper Name"
                                value={shop.shopkeeperName}
                            />

                            <InfoCard
                                label="GST Number"
                                value={shop.gstNumber}
                            />

                            <InfoCard
                                label="Shop ID"
                                value={shop.id}
                            />

                            <InfoCard
                                label="Status"
                                value={shop.status}
                            />

                            <InfoCard
                                label="Active"
                                value={
                                    shop.active
                                        ? 'Yes'
                                        : 'No'
                                }
                            />

                            <InfoCard
                                label="Today Active"
                                value={
                                    shop.todayActive
                                        ? 'Yes'
                                        : 'No'
                                }
                            />

                        </div>

                    </DetailSection>

                    <DetailSection
                        icon={<MapPin size={20} />}
                        title="Address & Location"
                    >

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                            <InfoCard
                                label="Address"
                                value={shop.address}
                            />

                            <InfoCard
                                label="City"
                                value={shop.city}
                            />

                            <InfoCard
                                label="State"
                                value={shop.state}
                            />

                            <InfoCard
                                label="Pincode"
                                value={shop.pincode}
                            />

                            <InfoCard
                                label="Latitude"
                                value={shop.latitude}
                            />

                            <InfoCard
                                label="Longitude"
                                value={shop.longitude}
                            />

                        </div>


                        {/* MAP BUTTON */}

                        {shop.latitude &&
                            shop.longitude && (

                                <button
                                    onClick={() => {

                                        window.open(
                                            `https://www.google.com/maps?q=${shop.latitude},${shop.longitude}`,
                                            '_blank'
                                        );

                                    }}
                                    className="mt-6 inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#eee5e9] text-[#694f5c] text-sm font-semibold hover:bg-[#e4d8de] transition"
                                >

                                    <Navigation size={17} />

                                    Open Location in Google Maps

                                </button>

                            )}

                    </DetailSection>

                    <DetailSection
                        icon={<User size={20} />}
                        title="Shopkeeper Account"
                    >

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                            <InfoCard
                                label="Full Name"
                                value={owner?.fullName}
                            />

                            <InfoCard
                                label="Mobile Number"
                                value={owner?.mobileNumber}
                                icon={<Phone size={15} />}
                            />

                            <InfoCard
                                label="Email"
                                value={owner?.email}
                                icon={<Mail size={15} />}
                            />

                            <InfoCard
                                label="Role"
                                value={owner?.role}
                            />

                            <InfoCard
                                label="Mobile Verified"
                                value={
                                    owner?.verified
                                        ? 'Yes'
                                        : 'No'
                                }
                            />

                            <InfoCard
                                label="Email Verified"
                                value={
                                    owner?.emailVerified
                                        ? 'Yes'
                                        : 'No'
                                }
                            />

                            <InfoCard
                                label="Account Active"
                                value={
                                    owner?.active
                                        ? 'Yes'
                                        : 'No'
                                }
                            />

                            <InfoCard
                                label="User ID"
                                value={owner?.id}
                            />

                        </div>

                    </DetailSection>

                    <DetailSection
                        icon={<Calendar size={20} />}
                        title="Record Information"
                    >

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                            <InfoCard
                                label="Created At"
                                value={formatDate(shop.createdAt)}
                            />

                            <InfoCard
                                label="Last Updated"
                                value={formatDate(shop.updatedAt)}
                            />

                        </div>

                    </DetailSection>

                    <DetailSection
                        icon={<Package size={20} />}
                        title="Shop Products"
                        rightContent={

                            <span className="text-sm text-[#8a8385]">
                                {products.length} products
                            </span>

                        }
                    >

                        {products.length === 0 ? (

                            <div className="py-14 text-center bg-[#faf9f9] rounded-2xl">

                                <Package
                                    size={38}
                                    className="mx-auto text-[#aaa3a5]"
                                />

                                <p className="font-semibold mt-3">
                                    No Products
                                </p>

                                <p className="text-sm text-[#8a8385] mt-1">
                                    This shop has no products.
                                </p>

                            </div>

                        ) : (

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                                {products.map((product) => (

                                    <div
                                        key={product.id}
                                        className="border border-[#eeeaea] rounded-2xl p-5 hover:shadow-md transition"
                                    >

                                        <div className="flex items-start justify-between gap-3">

                                            <div className="w-12 h-12 rounded-xl bg-[#eee5e9] flex items-center justify-center text-[#694f5c]">

                                                <Package size={21} />

                                            </div>


                                            <span
                                                className={`
                                                    px-3 py-1.5 rounded-full text-xs font-semibold
                                                    ${product.active
                                                        ? 'bg-[#e5eee9] text-[#466653]'
                                                        : 'bg-[#f5e4e6] text-[#8b4f5d]'
                                                    }
                                                `}
                                            >

                                                {product.active
                                                    ? 'Active'
                                                    : 'Inactive'}

                                            </span>

                                        </div>


                                        <h3 className="font-bold mt-4">
                                            {product.productName ||
                                                'Unnamed Product'}
                                        </h3>


                                        <p className="text-sm text-[#8a8385] mt-2 line-clamp-2">

                                            {product.description ||
                                                'No description available'}

                                        </p>


                                        <div className="flex items-center justify-between mt-5">

                                            <span className="text-lg font-bold text-[#694f5c]">

                                                ₹{product.price ?? 0}

                                            </span>


                                            {product.stock !== undefined && (

                                                <span className="text-xs text-[#8a8385]">

                                                    Stock: {product.stock}

                                                </span>

                                            )}

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </DetailSection>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3">


                        {/* BACK TO SHOPS */}

                        <button
                            onClick={() =>
                                router.push('/admin/shops')
                            }
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#694f5c] text-white text-sm font-semibold hover:bg-[#5d4652] transition"
                        >

                            <ArrowLeft size={17} />

                            Back to Shops

                        </button>

                        {shop.status === 'PENDING' && (

                            <>


                                {/* APPROVE */}

                                <button
                                    onClick={handleApprove}
                                    disabled={
                                        actionLoading !== null
                                    }
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#e5eee9] text-[#466653] text-sm font-semibold hover:bg-[#d9e7de] disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >

                                    {actionLoading === 'approve' ? (

                                        <span className="w-4 h-4 border-2 border-[#466653]/30 border-t-[#466653] rounded-full animate-spin" />

                                    ) : (

                                        <CheckCircle2 size={17} />

                                    )}


                                    {actionLoading === 'approve'
                                        ? 'Approving...'
                                        : 'Approve Shop'}

                                </button>


                                {/* REJECT */}

                                <button
                                    onClick={handleReject}
                                    disabled={
                                        actionLoading !== null
                                    }
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#f5e4e6] text-[#8b4f5d] text-sm font-semibold hover:bg-[#edd9dc] disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >

                                    {actionLoading === 'reject' ? (

                                        <span className="w-4 h-4 border-2 border-[#8b4f5d]/30 border-t-[#8b4f5d] rounded-full animate-spin" />

                                    ) : (

                                        <XCircle size={17} />

                                    )}


                                    {actionLoading === 'reject'
                                        ? 'Rejecting...'
                                        : 'Reject Shop'}

                                </button>

                            </>

                        )}

                    </div>

                    {actionMessage && (

                        <div className="mt-4 flex items-center gap-3 p-4 rounded-xl bg-[#e5eee9] text-[#466653] border border-[#d7e6dc]">

                            <CheckCircle2 size={19} />

                            <p className="text-sm font-medium">
                                {actionMessage}
                            </p>

                        </div>

                    )}

                    {error && (

                        <div className="mt-4 flex items-center gap-3 p-4 rounded-xl bg-[#f5e4e6] text-[#8b4f5d] border border-[#ead4d7]">

                            <XCircle size={19} />

                            <p className="text-sm font-medium">
                                {error}
                            </p>

                        </div>

                    )}

                </div>

            </main>

        </div>

    );
}


function SidebarItem({
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


function DetailSection({
    icon,
    title,
    children,
    rightContent,
}) {

    return (

        <section className="mt-8">

            <div className="flex items-center justify-between mb-5">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-[#eee5e9] text-[#694f5c] flex items-center justify-center">

                        {icon}

                    </div>


                    <h2 className="text-xl font-bold">
                        {title}
                    </h2>

                </div>


                {rightContent}

            </div>


            <div className="bg-white rounded-2xl p-6 shadow-[5px_5px_16px_rgba(0,0,0,0.04),-5px_-5px_16px_rgba(255,255,255,0.9)]">

                {children}

            </div>

        </section>

    );

}


function InfoCard({
    label,
    value,
    icon,
}) {

    return (

        <div className="border border-[#eeeaea] rounded-xl p-4">

            <div className="flex items-center gap-2">

                {icon && (

                    <span className="text-[#694f5c]">
                        {icon}
                    </span>

                )}

                <p className="text-xs uppercase tracking-wider text-[#9a9295]">
                    {label}
                </p>

            </div>


            <p className="font-semibold mt-2 break-all">
                {value || '-'}
            </p>

        </div>

    );

}


function StatusCard({
    title,
    value,
    icon,
    type,
}) {

    const styles = {

        success: {
            bg: 'bg-[#e5eee9]',
            text: 'text-[#466653]',
        },

        warning: {
            bg: 'bg-[#f3e9df]',
            text: 'text-[#8a6346]',
        },

        danger: {
            bg: 'bg-[#f5e4e6]',
            text: 'text-[#8b4f5d]',
        },

    };


    const style =
        styles[type] ||
        styles.warning;


    return (

        <div className="bg-white rounded-2xl p-5 shadow-[5px_5px_16px_rgba(0,0,0,0.04),-5px_-5px_16px_rgba(255,255,255,0.9)]">

            <div className="flex items-center gap-4">

                <div
                    className={`
                        w-11
                        h-11
                        rounded-xl
                        ${style.bg}
                        ${style.text}
                        flex
                        items-center
                        justify-center
                    `}
                >

                    {icon}

                </div>


                <div>

                    <p className="text-sm text-[#8a8385]">
                        {title}
                    </p>

                    <p
                        className={`
                            text-lg
                            font-bold
                            mt-1
                            ${style.text}
                        `}
                    >
                        {value}
                    </p>

                </div>

            </div>

        </div>

    );

}


function StatusBadge({
    status,
}) {


    if (status === 'APPROVED') {

        return (

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e5eee9] text-[#466653] text-xs font-semibold">

                <CheckCircle2 size={14} />

                Approved

            </span>

        );

    }


    if (status === 'PENDING') {

        return (

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f3e9df] text-[#8a6346] text-xs font-semibold">

                <Clock3 size={14} />

                Pending

            </span>

        );

    }


    if (status === 'REJECTED') {

        return (

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5e4e6] text-[#8b4f5d] text-xs font-semibold">

                <XCircle size={14} />

                Rejected

            </span>

        );

    }


    return (

        <span className="px-3 py-1.5 rounded-full bg-[#eeeeee] text-[#666666] text-xs font-semibold">

            {status || 'Unknown'}

        </span>

    );

}


function TodayStatus({
    active,
}) {

    if (active) {

        return (

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#e5eee9] text-[#466653] text-sm font-semibold">

                <CheckCircle2 size={17} />

                Open Today

            </div>

        );

    }


    return (

        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#f5e4e6] text-[#8b4f5d] text-sm font-semibold">

            <XCircle size={17} />

            Closed Today

        </div>

    );

}


function formatDate(value) {

    if (!value) {
        return '-';
    }


    try {

        return new Date(value).toLocaleString(
            'en-IN',
            {
                dateStyle: 'medium',
                timeStyle: 'short',
            }
        );

    } catch {

        return value;

    }

}