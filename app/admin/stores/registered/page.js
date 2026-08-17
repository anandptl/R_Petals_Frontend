'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Store,
    MapPin,
    Navigation,
    Building2,
    MapPinned,
    Loader2,
    CheckCircle2
} from 'lucide-react';

import AdminSidebar from '@/app/admin/components/AdminSidebar';

export default function RegisterStoresPage() {

    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        shopName: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: ''
    });

    // Handle input change
    const handleChange = async (e) => {

        const { name, value } = e.target;

        setError('');
        setMessage('');

        // Pincode 6 digits se kam hai
        if (name === 'pincode' && value.length < 6) {

            setFormData((prev) => ({
                ...prev,
                pincode: value,
                city: '',
                state: ''
            }));

            return;
        }

        // Normal input update
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // Pincode ke 6 digits complete hone par city/state fetch karo
        if (name === 'pincode' && value.length === 6) {

            try {

                setLocationLoading(true);

                const response = await fetch(
                    `https://api.postalpincode.in/pincode/${value}`
                );

                const data = await response.json();

                if (
                    data[0]?.Status === 'Success' &&
                    data[0]?.PostOffice?.length > 0
                ) {

                    const postOffice = data[0].PostOffice[0];

                    setFormData((prev) => ({
                        ...prev,
                        pincode: value,
                        city: postOffice.District || '',
                        state: postOffice.State || ''
                    }));

                } else {

                    setFormData((prev) => ({
                        ...prev,
                        city: '',
                        state: ''
                    }));

                    setError('Invalid pincode.');

                }

            } catch (error) {

                console.error(
                    'Pincode API error:',
                    error
                );

                setError(
                    'Unable to fetch city and state from pincode.'
                );

            } finally {

                setLocationLoading(false);
            }
        }
    };


    // Get location from entered address
    const getAddressLocation = async () => {
        setError('');
        setMessage('');

        if (!formData.address.trim()) {
            setError('Please enter shop address.');
            return;
        }

        if (!formData.city.trim()) {
            setError('Please enter city.');
            return;
        }

        if (!formData.state.trim()) {
            setError('Please enter state.');
            return;
        }

        if (!/^[0-9]{6}$/.test(formData.pincode)) {
            setError('Please enter valid 6 digit pincode.');
            return;
        }

        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.replace('/login?redirect=/admin/stores/register');
            return;
        }

        const fullAddress = [
            formData.address.trim(),
            formData.city.trim(),
            formData.state.trim(),
            formData.pincode,
            'India'
        ].join(', ');

        try {
            setLocationLoading(true);

            const response = await fetch(
                `${API_URL}/admin/stores/geocode?address=${encodeURIComponent(fullAddress)}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    }
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.message || 'Unable to find location.'
                );
            }

            if (
                !result?.success ||
                !result?.data ||
                result.data.latitude == null ||
                result.data.longitude == null
            ) {
                throw new Error(
                    result?.message || 'Location not found.'
                );
            }

            setFormData((prev) => ({
                ...prev,
                latitude: String(result.data.latitude),
                longitude: String(result.data.longitude)
            }));

            setMessage('Location found successfully.');

        } catch (error) {
            console.error('Address location error:', error);

            setError(
                error?.message || 'Unable to find location.'
            );

            setFormData((prev) => ({
                ...prev,
                latitude: '',
                longitude: ''
            }));

        } finally {
            setLocationLoading(false);
        }
    };

    // Register store
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');
        setMessage('');

        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.replace(
                '/login?redirect=/admin/stores/register'
            );
            return;
        }

        if (!formData.shopName.trim()) {
            setError('Please enter shop name.');
            return;
        }

        if (!formData.address.trim()) {
            setError('Please enter shop address.');
            return;
        }

        if (!formData.city.trim()) {
            setError('Please enter city.');
            return;
        }

        if (!formData.state.trim()) {
            setError('Please enter state.');
            return;
        }

        if (!/^[0-9]{6}$/.test(formData.pincode)) {
            setError('Please enter valid 6 digit pincode.');
            return;
        }

        if (!formData.latitude || !formData.longitude) {
            setError('Please get shop location first.');
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/admin/stores/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                    'Store registration failed.'
                );
            }

            setMessage(
                'Store registered successfully.'
            );

            setFormData({
                shopName: '',
                address: '',
                city: '',
                state: '',
                pincode: '',
                latitude: '',
                longitude: ''
            });

        } catch (error) {

            console.error(
                'Store registration error:',
                error
            );

            setError(
                error.message ||
                'Something went wrong.'
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-[#292628]">

            <AdminSidebar />

            <main className="lg:ml-[255px] min-h-screen">

                {/* Header */}
                <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between">

                    <div>

                        <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                            Store Management
                        </p>

                        <div className="flex items-center gap-3 mt-1">

                            <button
                                onClick={() =>
                                    router.push('/admin/stores')
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-full text-[#6f676a] transition hover:bg-[#f5f1f2]"
                                aria-label="Back to Store Management"
                            >
                                <span className="material-symbols-outlined text-[22px]">
                                    arrow_back
                                </span>
                            </button>

                            <h1 className="text-xl font-semibold">
                                Register Store
                            </h1>

                        </div>

                    </div>

                    <div className="w-10 h-10 rounded-xl bg-[#e7dce1] text-[#6d5260] flex items-center justify-center font-bold">
                        A
                    </div>

                </header>

                <div className="p-5 sm:p-8">

                    {/* Page heading */}
                    <div className="mb-8">

                        <p className="text-sm text-[#8a8385]">
                            Store Management
                        </p>

                        <h2 className="text-3xl font-bold mt-1">
                            Register Store
                        </h2>

                        <p className="mt-2 text-sm text-[#8a8385] max-w-2xl">
                            Add a new store by providing its basic
                            information, address and exact location.
                        </p>

                    </div>

                    {/* Registration form */}
                    <div className="bg-white rounded-2xl shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)] overflow-hidden">

                        {/* Form header */}
                        <div className="px-6 py-6 sm:px-8 border-b border-[#f0eded]">

                            <div className="flex items-center gap-4">

                                <div className="w-12 h-12 rounded-xl bg-[#eee5e9] text-[#694f5c] flex items-center justify-center">
                                    <Store size={22} />
                                </div>

                                <div>

                                    <h3 className="text-lg font-semibold text-[#292628]">
                                        Store Information
                                    </h3>

                                    <p className="text-sm text-[#8a8385] mt-1">
                                        Enter the details below to register a new store.
                                    </p>

                                </div>

                            </div>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="p-6 sm:p-8"
                        >

                            {/* Basic information */}
                            <div>

                                <div className="flex items-center gap-2 mb-5">

                                    <Building2
                                        size={18}
                                        className="text-[#6d5260]"
                                    />

                                    <div>

                                        <h4 className="text-sm font-semibold text-[#292628]">
                                            Basic Information
                                        </h4>

                                        <p className="text-xs text-[#9a9295] mt-0.5">
                                            Basic details of the store
                                        </p>

                                    </div>

                                </div>

                                {/* Shop name */}
                                <div>

                                    <label
                                        htmlFor="shopName"
                                        className="block text-sm font-semibold text-[#514b4e] mb-2"
                                    >
                                        Shop Name
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="shopName"
                                        type="text"
                                        name="shopName"
                                        value={formData.shopName}
                                        onChange={handleChange}
                                        placeholder="Enter shop name"
                                        required
                                        className="w-full h-12 rounded-xl border border-[#e6e1e3] bg-white px-4 text-sm text-[#292628] placeholder:text-[#b0a9ac] outline-none transition focus:border-[#9b7b89] focus:ring-2 focus:ring-[#eee5e9]"
                                    />

                                </div>

                                {/* Address */}
                                <div className="mt-5">

                                    <label
                                        htmlFor="address"
                                        className="block text-sm font-semibold text-[#514b4e] mb-2"
                                    >
                                        Shop Address
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>

                                    <textarea
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter complete shop address"
                                        rows={4}
                                        required
                                        className="w-full rounded-xl border border-[#e6e1e3] bg-white px-4 py-3 text-sm text-[#292628] placeholder:text-[#b0a9ac] outline-none resize-none transition focus:border-[#9b7b89] focus:ring-2 focus:ring-[#eee5e9]"
                                    />

                                </div>

                            </div>

                            <div className="my-8 border-t border-[#f0eded]" />

                            {/* Address details */}
                            <div>

                                <div className="flex items-center gap-2 mb-5">

                                    <MapPin
                                        size={18}
                                        className="text-[#6d5260]"
                                    />

                                    <div>

                                        <h4 className="text-sm font-semibold text-[#292628]">
                                            Address Details
                                        </h4>

                                        <p className="text-xs text-[#9a9295] mt-0.5">
                                            Location information of the store
                                        </p>

                                    </div>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {/* City */}
                                    <div>

                                        <label
                                            htmlFor="city"
                                            className="block text-sm font-semibold text-[#514b4e] mb-2"
                                        >
                                            City
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            id="city"
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Enter pincode, and city will appear automatically."
                                            required
                                            className="w-full h-12 rounded-xl border border-[#e6e1e3] bg-white px-4 text-sm outline-none transition focus:border-[#9b7b89] focus:ring-2 focus:ring-[#eee5e9]"
                                        />

                                    </div>

                                    {/* State */}
                                    <div>

                                        <label
                                            htmlFor="state"
                                            className="block text-sm font-semibold text-[#514b4e] mb-2"
                                        >
                                            State
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            id="state"
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="Enter pincode, and state will appear automatically."
                                            required
                                            className="w-full h-12 rounded-xl border border-[#e6e1e3] bg-white px-4 text-sm outline-none transition focus:border-[#9b7b89] focus:ring-2 focus:ring-[#eee5e9]"
                                        />

                                    </div>

                                </div>

                                {/* Pincode */}
                                <div className="mt-5 md:w-1/2">

                                    <label
                                        htmlFor="pincode"
                                        className="block text-sm font-semibold text-[#514b4e] mb-2"
                                    >
                                        Pincode
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="pincode"
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="Enter 6 digit pincode"
                                        maxLength={6}
                                        inputMode="numeric"
                                        pattern="[0-9]{6}"
                                        required
                                        className="w-full h-12 rounded-xl border border-[#e6e1e3] bg-white px-4 text-sm outline-none transition focus:border-[#9b7b89] focus:ring-2 focus:ring-[#eee5e9]"
                                    />

                                </div>

                            </div>

                            <div className="my-8 border-t border-[#f0eded]" />

                            {/* Shop location */}
                            <div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

                                    <div className="flex items-center gap-2">

                                        <MapPinned
                                            size={18}
                                            className="text-[#6d5260]"
                                        />

                                        <div>

                                            <h4 className="text-sm font-semibold text-[#292628]">
                                                Shop Location
                                            </h4>

                                            <p className="text-xs text-[#9a9295] mt-0.5">
                                                Get the exact GPS coordinates of the store
                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={getAddressLocation}
                                        disabled={locationLoading}
                                        className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#6d5260] text-white text-sm font-semibold transition hover:bg-[#5b424e] disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {locationLoading ? (
                                            <>
                                                <Loader2
                                                    size={16}
                                                    className="animate-spin"
                                                />
                                                Finding Location...
                                            </>
                                        ) : (
                                            <>
                                                <MapPinned size={16} />
                                                Get Location
                                            </>
                                        )}
                                    </button>

                                </div>

                                <div className="rounded-xl border border-[#e9e4e6] bg-[#faf8f9] p-5">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                        {/* Latitude */}
                                        <div>

                                            <label
                                                htmlFor="latitude"
                                                className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#9a9295] mb-2"
                                            >
                                                Latitude
                                            </label>

                                            <input
                                                id="latitude"
                                                type="text"
                                                value={formData.latitude}
                                                readOnly
                                                placeholder="Not detected"
                                                className="w-full h-11 rounded-xl border border-[#e4dfe1] bg-white px-4 text-sm text-[#706a6c] outline-none"
                                            />

                                        </div>

                                        {/* Longitude */}
                                        <div>

                                            <label
                                                htmlFor="longitude"
                                                className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#9a9295] mb-2"
                                            >
                                                Longitude
                                            </label>

                                            <input
                                                id="longitude"
                                                type="text"
                                                value={formData.longitude}
                                                readOnly
                                                placeholder="Not detected"
                                                className="w-full h-11 rounded-xl border border-[#e4dfe1] bg-white px-4 text-sm text-[#706a6c] outline-none"
                                            />

                                        </div>

                                    </div>

                                    {formData.latitude &&
                                        formData.longitude && (
                                            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[#4f725f]">

                                                <CheckCircle2 size={15} />

                                                Shop location detected successfully.

                                            </div>
                                        )}

                                </div>

                            </div>

                            {/* Error */}
                            {error && (
                                <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            {/* Success */}
                            {message && (
                                <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#d9e9df] bg-[#f0f8f3] px-4 py-3 text-sm text-[#4f725f]">

                                    <CheckCircle2 size={17} />

                                    {message}

                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-8 pt-6 border-t border-[#f0eded] flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push('/admin/stores')
                                    }
                                    disabled={loading}
                                    className="h-11 px-6 rounded-xl border border-[#ddd7d9] bg-white text-sm font-semibold text-[#625b5e] transition hover:bg-[#faf7f8] disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="h-11 px-7 rounded-xl bg-[#6d5260] text-white text-sm font-semibold flex items-center justify-center gap-2 transition hover:bg-[#5b424e] disabled:opacity-60 disabled:cursor-not-allowed"
                                >

                                    {loading ? (
                                        <>
                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />
                                            Registering...
                                        </>
                                    ) : (
                                        <>
                                            <Store size={17} />
                                            Register Store
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </main>

        </div>
    );
}

function Loading() {
    return (
        <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin" />
        </div>
    );
}