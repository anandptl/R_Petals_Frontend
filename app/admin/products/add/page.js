'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Upload,
    X,
    Plus,
    Loader2,
    Package,
    Image as ImageIcon
} from 'lucide-react';
import AdminSidebar from '@/app/admin/components/AdminSidebar';
import { apiFetch, initializeAuthSession } from '@/lib/auth';

export default function AddProductPage() {
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

    const [form, setForm] = useState({
        categoryName: '',
        subCategoryName: '',
        productName: '',
        description: '',
        price: ''
    });

    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [checking, setChecking] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        initializeAuthSession();

        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('role');

        if (!token) {
            router.replace('/login?redirect=/admin/products/add');
            return;
        }

        if (role !== 'ADMIN') {
            router.replace('/');
            return;
        }

        setChecking(false);
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0) return;

        setError('');
        setSuccess('');

        if (images.length + selectedFiles.length > 6) {
            setError('Maximum 6 product images are allowed.');
            e.target.value = '';
            return;
        }

        const invalidFile = selectedFiles.find((file) => !file.type.startsWith('image/'));
        if (invalidFile) {
            setError('Only image files are allowed.');
            e.target.value = '';
            return;
        }

        setImages((previous) => [...previous, ...selectedFiles]);

        const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviews((previous) => [...previous, ...newPreviews]);

        e.target.value = '';
    };

    const removeImage = (index) => {
        const preview = previews[index];
        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setImages((previous) => previous.filter((_, i) => i !== index));
        setPreviews((previous) => previous.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        if (!form.categoryName.trim()) return 'Please enter category name.';
        if (!form.subCategoryName.trim()) return 'Please enter subcategory name.';
        if (!form.productName.trim()) return 'Please enter product name.';
        if (!form.description.trim()) return 'Please enter product description.';
        if (
            form.price === '' ||
            Number.isNaN(Number(form.price)) ||
            Number(form.price) <= 0
        ) {
            return 'Please enter a valid price.';
        }
        if (images.length === 0) return 'Please select at least one product image.';
        if (images.length > 6) return 'Maximum 6 product images are allowed.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setSubmitting(true);

            const product = {
                categoryName: form.categoryName.trim(),
                subCategoryName: form.subCategoryName.trim(),
                productName: form.productName.trim(),
                description: form.description.trim(),
                price: Number(form.price)
            };

            const formData = new FormData();
            formData.append('product', JSON.stringify(product));

            images.forEach((image) => {
                formData.append('images', image);
            });

            const response = await apiFetch(`${API_URL}/admin/add-product`, {
                method: 'POST',
                body: formData
            });

            if (response.status === 401) {
                router.replace('/login?redirect=/admin/products/add');
                return;
            }

            let result = null;
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                result = {
                    success: false,
                    message: text || `Server returned ${response.status}`
                };
            }

            if (!response.ok) {
                throw new Error(
                    result?.message ||
                    result?.error ||
                    `Failed to add product (${response.status})`
                );
            }

            if (result && result.success === false) {
                throw new Error(result.message || 'Failed to add product.');
            }

            setSuccess('Product added successfully.');
            setForm({
                categoryName: '',
                subCategoryName: '',
                productName: '',
                description: '',
                price: ''
            });

            previews.forEach((url) => URL.revokeObjectURL(url));
            setImages([]);
            setPreviews([]);
        } catch (err) {
            console.error('Add Product Error:', err);
            setError(err?.message || 'Something went wrong while adding product.');
        } finally {
            setSubmitting(false);
        }
    };

    if (checking) {
        return (
            <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#e5dfe2] border-t-[#694f5c] rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-sm text-[#777174]">Loading admin panel...</p>
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
                        <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">Catalog & Inventory</p>
                        <h1 className="text-xl font-semibold mt-1">Add New Product</h1>
                    </div>
                    <button
                        onClick={() => router.push('/admin/products')}
                        className="px-4 py-2 rounded-xl bg-[#faf7f8] text-[#6d5260] font-semibold text-xs border border-[#eee9ea] hover:bg-[#f2eaed] transition"
                    >
                        ← Back to Products
                    </button>
                </header>

                <div className="p-5 sm:p-8 max-w-[1200px]">

                    <div className="mt-1">
                        <p className="text-sm text-[#8a8385]">Product Management</p>
                        <h2 className="text-3xl font-bold mt-1">Create New Product</h2>
                        <p className="text-sm text-[#8a8385] mt-2">
                            Enter product category, subcategory, details and images.
                        </p>
                    </div>



                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 bg-white rounded-2xl p-6 sm:p-8 shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#f1e8ec] text-[#694f5c] flex items-center justify-center">
                                <Package size={19} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Product Information</h3>
                                <p className="text-xs text-[#8a8385] mt-1">Fill all product details.</p>
                            </div>
                        </div>

                        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormInput
                                label="Category"
                                name="categoryName"
                                value={form.categoryName}
                                onChange={handleChange}
                                placeholder="Enter category name"
                                disabled={submitting}
                            />
                            <FormInput
                                label="Subcategory"
                                name="subCategoryName"
                                value={form.subCategoryName}
                                onChange={handleChange}
                                placeholder="Enter subcategory name"
                                disabled={submitting}
                            />
                            <FormInput
                                label="Product Name"
                                name="productName"
                                value={form.productName}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                disabled={submitting}
                            />
                            <div>
                                <label className="block text-sm font-semibold text-[#514b4e] mb-2">Price</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#8a8385]">
                                        ₹
                                    </span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="Enter price"
                                        min="0"
                                        step="0.01"
                                        disabled={submitting}
                                        className="w-full h-12 rounded-xl border border-[#e4dfe1] bg-white pl-9 pr-4 text-sm outline-none focus:border-[#9b808c] focus:ring-2 focus:ring-[#694f5c]/10 transition"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-5">
                            <label className="block text-sm font-semibold text-[#514b4e] mb-2">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Enter product description"
                                rows={5}
                                disabled={submitting}
                                className="w-full rounded-xl border border-[#e4dfe1] bg-white px-4 py-3 text-sm outline-none resize-none focus:border-[#9b808c] focus:ring-2 focus:ring-[#694f5c]/10 transition"
                            />
                        </div>

                        <div className="mt-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">Product Images</h3>
                                    <p className="text-xs text-[#8a8385] mt-1">Upload 1 to 6 images. First image is primary.</p>
                                </div>
                                <div className="px-3 py-1.5 rounded-lg bg-[#f4eff1] text-[#694f5c] text-xs font-semibold">
                                    {images.length} / 6
                                </div>
                            </div>

                            <label
                                className={`mt-5 min-h-[170px] rounded-2xl border-2 border-dashed border-[#ddd4d8] bg-[#fcfafb] flex flex-col items-center justify-center transition ${images.length >= 6
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'cursor-pointer hover:bg-[#f8f3f5]'
                                    }`}
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#f1e8ec] text-[#694f5c] flex items-center justify-center">
                                    <ImageIcon size={22} />
                                </div>
                                <p className="mt-4 text-sm font-semibold text-[#514b4e]">Click to upload images</p>
                                <p className="mt-1 text-xs text-[#8a8385]">JPG, JPEG, PNG • Maximum 6</p>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    multiple
                                    onChange={handleImageChange}
                                    disabled={submitting || images.length >= 6}
                                    className="hidden"
                                />
                            </label>

                            {previews.length > 0 && (
                                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {previews.map((preview, index) => (
                                        <div
                                            key={preview}
                                            className="relative aspect-square rounded-xl overflow-hidden border border-[#e4dfe1] bg-[#faf7f8]"
                                        >
                                            <img
                                                src={preview}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                disabled={submitting}
                                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/65 text-white flex items-center justify-center hover:bg-black/80"
                                            >
                                                <X size={14} />
                                            </button>
                                            {index === 0 && (
                                                <span className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-white/90 text-[10px] font-bold text-[#694f5c]">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-9 pt-6 border-t border-[#eee9ea] flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => router.push('/admin/products')}
                                disabled={submitting}
                                className="h-12 px-7 rounded-xl border border-[#ded7da] bg-white text-sm font-semibold text-[#694f5c] hover:bg-[#faf7f8] transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="h-12 px-8 rounded-xl bg-[#694f5c] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#5b4350] transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Adding Product...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} /> Add Product
                                    </>
                                )}
                            </button>
                        </div>
                        {error && (
                            <div className="mt-6 rounded-xl border border-[#f0d8dc] bg-[#fff5f6] px-4 py-4">
                                <p className="text-sm font-semibold text-[#9b5360]">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="mt-6 rounded-xl border border-[#d7eadf] bg-[#f3faf5] px-4 py-4">
                                <p className="text-sm font-semibold text-[#47745a]">{success}</p>
                            </div>
                        )}
                    </form>


                    <footer className="py-8 text-center">
                        <p className="text-xs text-[#9a9295]">© 2026 R Petals • Admin Panel</p>
                    </footer>
                </div>
            </main>
        </div>
    );
}

function FormInput({ label, name, value, onChange, placeholder, disabled }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-[#514b4e] mb-2">{label}</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full h-12 rounded-xl border border-[#e4dfe1] bg-white px-4 text-sm text-[#403a3d] outline-none focus:border-[#9b808c] focus:ring-2 focus:ring-[#694f5c]/10 transition disabled:bg-[#faf9f9]"
            />
        </div>
    );
}