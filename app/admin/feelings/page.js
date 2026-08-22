'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/app/admin/components/AdminSidebar';
import { apiFetch, initializeAuthSession } from '@/lib/auth'; //[cite: 2]

export default function AdminFeelingsPage() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const formSectionRef = useRef(null);

    // Authentication states
    const [checking, setChecking] = useState(true);
    const [user, setUser] = useState(null);

    // Form states with active toggle
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ feelingName: '', isActive: true, image: null });
    const [previewImage, setPreviewImage] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [message, setMessage] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    // Auth verification
    useEffect(() => {
        initializeAuthSession(); //[cite: 2]

        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('role');
        const storedUser = localStorage.getItem('rpetalsUser');

        if (!token) {
            router.replace('/login?redirect=/admin/feelings');
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

    // Input change handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: '' }));
    };

    // Toggle switch handler for active status
    const handleToggleActive = () => {
        setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
    };

    // Image select handler
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setFormErrors((prev) => ({ ...prev, image: 'Please select a valid image file.' }));
            return;
        }

        if (previewImage && previewImage.startsWith('blob:')) {
            URL.revokeObjectURL(previewImage);
        }

        setFormData((prev) => ({ ...prev, image: file }));
        setPreviewImage(URL.createObjectURL(file));
        setFormErrors((prev) => ({ ...prev, image: '' }));
    };

    // Smooth scroll up to form on action card click
    const scrollToForm = () => {
        formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Form validation
    const validateForm = () => {
        const errors = {};
        if (!formData.feelingName.trim()) {
            errors.feelingName = 'Feeling name is required.';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Submit feeling
    const handleAddFeeling = async (e) => {

        e.preventDefault();

        if (!validateForm() || isSaving) return;

        setMessage('');
        setIsSaving(true);

        try {

            const form = new FormData();

            form.append(
                'feelingName',
                formData.feelingName.trim()
            );

            form.append(
                'active',
                String(formData.isActive)
            );

            if (formData.image) {
                form.append(
                    'image',
                    formData.image
                );
            }

            const response = await apiFetch(
                `${API_URL}/feelings/save`,
                {
                    method: 'POST',
                    body: form,
                }
            );

            const errorData =
                await response.json().catch(() => ({}));

            if (!response.ok) {

                throw new Error(
                    errorData.message ||
                    `Failed to add feeling: ${response.status}`
                );
            }

            // SUCCESS MESSAGE
            setMessage(
                'Feeling added successfully!'
            );

            // RESET FORM
            setFormData({
                feelingName: '',
                isActive: true,
                image: null
            });

            setPreviewImage('');

            setFormErrors({});

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (error) {

            console.error(
                'Error adding feeling:',
                error
            );

            // ERROR MESSAGE IN FORM
            setMessage(
                error.message ||
                'Failed to add feeling.'
            );

        } finally {

            setIsSaving(false);

        }
    };

    // Loading state
    if (checking) {
        return (
            <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-sm text-[#777174]">Loading feelings console...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-[#292628]">
            <AdminSidebar /> {/*[cite: 2] */}

            <main className="lg:ml-[255px] min-h-screen">
                {/* Header */}
                <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">Catalog & Inventory</p>
                        <h1 className="text-xl font-semibold mt-1">Feeling Management</h1>
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

                {/* Content body */}
                <div className="p-5 sm:p-8" style={{ paddingTop: '10px' }}>

                    <section>
                        <h2 className="text-3xl font-bold mt-1">Feelings Overview</h2>
                        <p className="text-sm text-[#8a8385] mt-2">Add, update, view and manage all special feelings.</p>
                    </section>

                    {/* Action quick links */}
                    <section className="mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <ActionCard
                                icon="➕"
                                title="Add Feeling"
                                description="Create a new Feeling, upload its image and configure feeling details."
                                actionText="Scroll To Form"
                                onClick={scrollToForm}
                            />

                            <ActionCard
                                icon="🌸"
                                title="All Feelings"
                                description="Browse all feelings, view images and current active status."
                                actionText="View Feelings"
                                onClick={() => router.push('/admin/feelings/all')}
                            />
                        </div>
                    </section>

                    {/* Permanent Form Section */}
                    <section
                        ref={formSectionRef}
                        className="mt-8 bg-white rounded-2xl p-6 border border-[#eee9ea] shadow-sm"
                    >
                        <div className="pb-4 border-b border-[#eee9ea]">
                            <h2 className="text-lg font-semibold text-[#403a3d]">Create New Feeling</h2>
                            <p className="text-xs text-[#8a8385] mt-0.5">Upload image, add name and toggle visibility status.</p>
                        </div>

                        <form onSubmit={handleAddFeeling} className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Input metadata and toggle switch column */}
                                <div className="flex flex-col justify-between">
                                    <div>
                                        <label className="text-sm font-semibold text-[#403a3d]">Feeling Name</label>
                                        <input
                                            type="text"
                                            name="feelingName"
                                            value={formData.feelingName}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Love, Happiness, Romance"
                                            className="mt-2 w-full rounded-xl border border-[#e5e1e2] bg-[#faf9f9] px-4 py-3 text-sm outline-none focus:border-[#6d5260] transition"
                                        />

                                        {formErrors.feelingName && (
                                            <p className="text-xs text-red-500 mt-1">{formErrors.feelingName}</p>
                                        )}

                                        {/* Toggle switch for active status */}
                                        <div className="mt-5 p-4 rounded-xl border border-[#ece7e9] bg-[#faf9f9] flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-[#403a3d]">Active Feeling</p>
                                                <p className="text-xs text-[#8a8385] mt-0.5">Show this feeling on the website.</p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleToggleActive}
                                                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${formData.isActive ? 'bg-[#6d5260]' : 'bg-[#ded6da]'
                                                    }`}
                                            >
                                                <div
                                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.isActive ? 'translate-x-6' : 'translate-x-0'
                                                        }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="mt-5 rounded-xl bg-[#faf9f9] p-4">
                                            <p className="text-sm font-semibold text-[#403a3d]">Feeling Information</p>
                                            <p className="text-xs text-[#8a8385] mt-1 leading-5">
                                                Add the feeling name, set its active state and upload an image to publish it.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Form submit button */}
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-6 py-2.5 rounded-xl bg-[#6d5260] text-white text-sm font-semibold hover:bg-[#5d4650] transition disabled:opacity-50"
                                        >
                                            {isSaving ? 'Adding...' : 'Add Feeling'}
                                        </button>
                                    </div>
                                </div>
                                {/* Image upload column */}
                                <div>
                                    <label className="text-sm font-semibold text-[#403a3d]">Feeling Image</label>
                                    <div className="mt-3">
                                        <div className="h-[240px] rounded-xl border border-dashed border-[#ddd5d7] bg-[#faf9f9] flex items-center justify-center overflow-hidden">
                                            {previewImage ? (
                                                <img
                                                    src={previewImage}
                                                    alt="Feeling preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <div className="w-14 h-14 rounded-xl bg-[#f2eaed] flex items-center justify-center mx-auto text-2xl">
                                                        🌸
                                                    </div>
                                                    <p className="text-sm font-medium text-[#6f696b] mt-3">Upload Feeling Image</p>
                                                    <p className="text-xs text-[#9a9295] mt-1">PNG, JPG or WEBP</p>
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
                                            className="mt-3 w-full py-3 rounded-xl bg-[#faf7f8] border border-[#e5e1e2] text-sm font-semibold text-[#6d5260] hover:bg-[#f1e9ec] transition"
                                        >
                                            Choose Image
                                        </button>
                                        {formErrors.image && (
                                            <p className="text-xs text-red-500 mt-1">{formErrors.image}</p>
                                        )}
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
                                </div>
                                
                            </div>
                        </form>
                    </section>

                    {/* Footer */}
                    <footer className="py-8 text-center">
                        <p className="text-xs text-[#9a9295]">© 2026 R Petals • Admin Panel</p>
                    </footer>
                </div>
            </main>
        </div>
    );
}

// Action card component
function ActionCard({ icon, title, description, actionText, onClick }) {
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
            <p className="text-xs font-semibold text-[#775966] mt-5">{actionText} →</p>
        </button>
    );
}