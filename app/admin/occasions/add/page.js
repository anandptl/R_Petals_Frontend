'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/app/admin/components/AdminSidebar';
import { apiFetch, initializeAuthSession } from '@/lib/auth';

export default function AddOccasionPage() {
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const fileInputRef = useRef(null);

    const [checking, setChecking] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState(null);

    const [occasionName, setOccasionName] = useState('');
    const [occasionDate, setOccasionDate] = useState('');
    const [active, setActive] = useState(true);

    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    /* Auth Verification */
    useEffect(() => {
        initializeAuthSession();

        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('role');
        const storedUser = localStorage.getItem('rpetalsUser');

        if (!token) {
            router.replace('/login?redirect=/admin/occasions/add');
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

        setChecking(false);
    }, [router]);


    /* Image Selection & Validation */
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setErrors((prev) => ({
            ...prev,
            image: '',
        }));

        if (!file.type.startsWith('image/')) {
            setErrors((prev) => ({
                ...prev,
                image: 'Please select a valid image.',
            }));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                image: 'Image size must be less than 5 MB.',
            }));
            return;
        }

        setImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    /* Form Validation */
    const validateForm = () => {
        const newErrors = {};

        if (!occasionName.trim()) {
            newErrors.occasionName = 'Occasion name is required.';
        }

        if (!occasionDate) {
            newErrors.occasionDate = 'Occasion date is required.';
        }

        if (!image) {
            newErrors.image = 'Occasion image is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    /* Form Submission */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validateForm()) return;

        setSaving(true);

        try {
            const formData = new FormData();
            formData.append('occasionName', occasionName.trim());
            formData.append('occasionDate', `${occasionDate}T00:00:00`);
            formData.append('active', String(active));
            formData.append('image', image);

            const response = await apiFetch(`${API_URL}/occasions/save`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                let errorMessage = 'Failed to create occasion.';
                try {
                    const data = await response.json();
                    errorMessage = data.message || data.error || errorMessage;
                } catch {
                    // Fallback if JSON parsing fails
                }
                throw new Error(errorMessage);
            }

            setMessage('Occasion created successfully.');

            // Reset form state
            setOccasionName('');
            setOccasionDate('');
            setActive(true);
            setImage(null);
            setPreviewImage('');

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            setTimeout(() => {
                router.push('/admin/occasions/add');
            }, 500);
        } catch (error) {
            console.error('Create occasion error:', error);
            setMessage(error.message || 'Something went wrong.');
        } finally {
            setSaving(false);
        }
    };

    if (checking) {
        return (
            <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-sm text-[#777174]">
                        Loading occasion console...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-[#292628]">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="lg:ml-[255px] min-h-screen">
                {/* Top Header */}
                <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                            Catalog & Inventory
                        </p>
                        <h1 className="text-xl font-semibold mt-1">Occasion Management</h1>
                    </div>

                    <button
                        onClick={() => router.push('/admin/occasions')}
                        className="px-4 py-2 rounded-xl bg-[#faf7f8] text-[#6d5260] font-semibold text-xs border border-[#eee9ea] hover:bg-[#f2eaed] transition"
                    >
                        ← Back to Occasions
                    </button>
                </header>

                {/* Centered Content Container */}
                <div className="p-4 sm:p-8 mx-auto" style={{ paddingTop: '10px' }}>
                    {/* Section Title */}
                    <section className="mt-2">
                        <h2 className="text-3xl font-bold">Add Occasion</h2>
                        <p className="text-sm text-[#8a8385] mt-2">
                            Create a new occasion and upload its image.
                        </p>
                    </section>

                    {/* Form Card */}
                    <section className="mt-8 flex flex-col items-center">
                        <form
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                            className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)] border border-[#f0ecee]"
                        >
                            <div className="grid grid-cols-2 lg:grid-cols-2 gap-8">
                                {/* Occasion Details */}
                                <div>
                                    <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                                        Occasion Details
                                    </p>
                                    <h3 className="text-xl font-semibold mt-1">
                                        Basic Information
                                    </h3>

                                    {/* Occasion Name */}
                                    <div className="mt-6">
                                        <label className="text-sm font-medium">Occasion Name</label>
                                        <input
                                            type="text"
                                            value={occasionName}
                                            onChange={(e) => {
                                                setOccasionName(e.target.value);
                                                setErrors((prev) => ({ ...prev, occasionName: '' }));
                                            }}
                                            placeholder="e.g. Valentine's Day"
                                            className={`mt-2 w-full rounded-xl border bg-[#faf9f9] px-4 py-3 text-sm outline-none transition ${errors.occasionName
                                                ? 'border-red-400'
                                                : 'border-[#e5e1e2] focus:border-[#6d5260]'
                                                }`}
                                        />
                                        {errors.occasionName && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.occasionName}
                                            </p>
                                        )}
                                    </div>

                                    {/* Occasion Date */}
                                    <div className="mt-5">
                                        <label className="text-sm font-medium">Occasion Date</label>
                                        <input
                                            type="date"
                                            value={occasionDate}
                                            onChange={(e) => {
                                                setOccasionDate(e.target.value);
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    occasionDate: ''
                                                }));
                                            }}
                                            className={`mt-2 w-full rounded-xl border bg-[#faf9f9] px-4 py-3 text-sm outline-none transition ${errors.occasionDate
                                                ? 'border-red-400'
                                                : 'border-[#e5e1e2] focus:border-[#6d5260]'
                                                }`}
                                        />
                                        {errors.occasionDate && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.occasionDate}
                                            </p>
                                        )}
                                    </div>

                                    {/* Active Switch */}
                                    <div className="mt-5 flex items-center justify-between rounded-xl bg-[#faf9f9] p-4 border border-[#f0ecee]">
                                        <div>
                                            <p className="text-sm font-semibold">Active Occasion</p>
                                            <p className="text-xs text-[#8a8385] mt-1">
                                                Show this occasion on the website.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setActive(!active)}
                                            className={`relative w-11 h-6 rounded-full transition ${active ? 'bg-[#6d5260]' : 'bg-[#d5d1d2]'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${active ? 'left-6' : 'left-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                                        Occasion Image
                                    </p>
                                    <h3 className="text-xl font-semibold mt-1">Upload Image</h3>

                                    <div className="mt-6">
                                        <div className="h-[180px] rounded-xl border border-dashed border-[#ddd5d7] bg-[#faf9f9] overflow-hidden flex items-center justify-center">
                                            {previewImage ? (
                                                <img
                                                    src={previewImage}
                                                    alt="Occasion Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <div className="text-5xl">🎉</div>
                                                    <p className="text-sm font-medium mt-3">
                                                        No image selected
                                                    </p>
                                                    <p className="text-xs text-[#9a9295] mt-1">
                                                        PNG, JPG or WEBP
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="mt-4 w-full rounded-xl border border-[#ddd5d7] bg-[#faf7f8] py-3 text-sm font-semibold text-[#775966] hover:bg-[#f1e9ec] transition"
                                        >
                                            Choose Image
                                        </button>

                                        {errors.image && (
                                            <p className="mt-2 text-xs text-red-500">{errors.image}</p>
                                        )}

                                        <p className="mt-2 text-xs text-[#9a9295]">Maximum 5 MB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback Banner */}
                            {message && (
                                <div
                                    className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-medium ${message.includes('successfully')
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                        }`}
                                >
                                    {message}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-8 pt-6 border-t border-[#eee9ea] flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => router.push('/admin/occasions')}
                                    disabled={saving}
                                    className="px-5 py-3 rounded-xl border border-[#ded8d9] text-sm font-semibold text-[#777174] hover:bg-[#faf7f8] transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-3 rounded-xl bg-[#6d5260] text-white text-sm font-semibold hover:bg-[#5d4650] transition disabled:opacity-50"
                                >
                                    {saving ? 'Creating...' : 'Create Occasion'}
                                </button>
                            </div>
                        </form>


                    </section>

                    {/* Footer */}
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