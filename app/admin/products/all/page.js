'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Eye,
    Pencil,
    Trash2,
    Plus,
    Loader2,
    Package,
    X,
    ChevronLeft,
    ChevronRight,
    Search,
    Image as ImageIcon
} from 'lucide-react';
import AdminSidebar from '@/app/admin/components/AdminSidebar';
import { apiFetch, initializeAuthSession } from '@/lib/auth';

export default function AllProductsPage() {
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checking, setChecking] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const init = async () => {
            await initializeAuthSession();
            const token = localStorage.getItem('accessToken');
            const role = localStorage.getItem('role');

            if (!token) {
                router.replace('/login?redirect=/admin/products/all');
                return;
            }

            if (role !== 'ADMIN') {
                router.replace('/');
                return;
            }

            setChecking(false);
            loadProducts();
        };

        init();
    }, [router]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await apiFetch(`${API_URL}/admin/products`, {
                method: 'GET'
            });

            if (response.status === 401) {
                router.replace('/login?redirect=/admin/products/all');
                return;
            }

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to load products');
            }

            setProducts(Array.isArray(result.data) ? result.data : []);
        } catch (err) {
            console.error('Products loading error:', err);
            setError(err.message || 'Unable to load products');
        } finally {
            setLoading(false);
        }
    };

    const normalizedSearch = search.trim().toLowerCase();

    const filteredProducts = [...products].sort((a, b) => {
        const aName = String(a.productName || '').toLowerCase();
        const bName = String(b.productName || '').toLowerCase();

        const aMatch = normalizedSearch && aName.includes(normalizedSearch);
        const bMatch = normalizedSearch && bName.includes(normalizedSearch);

        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
    });

    const openProduct = (product) => {
        setSelectedProduct(product);
        setSelectedImage(0);
    };

    const closeProduct = () => {
        setSelectedProduct(null);
        setSelectedImage(0);
    };

    const nextImage = () => {
        if (!selectedProduct?.images?.length) return;
        setSelectedImage((current) => (current + 1) % selectedProduct.images.length);
    };

    const previousImage = () => {
        if (!selectedProduct?.images?.length) return;
        setSelectedImage((current) =>
            current === 0 ? selectedProduct.images.length - 1 : current - 1
        );
    };

    const handleDelete = async (product) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${product.productName}"?`);
        if (!confirmed) return;

        try {
            setDeletingId(product.id);
            setError('');

            const response = await apiFetch(`${API_URL}/admin/delete/${product.id}`, {
                method: 'DELETE'
            });

            if (response.status === 401) {
                router.replace('/login?redirect=/admin/products/all');
                return;
            }

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to delete product');
            }

            setProducts((previous) => previous.filter((item) => item.id !== product.id));

            if (selectedProduct?.id === product.id) {
                closeProduct();
            }
        } catch (err) {
            console.error('Delete product error:', err);
            setError(err.message || 'Unable to delete product');
        } finally {
            setDeletingId(null);
        }
    };

    if (checking) {
        return (
            <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
                <Loader2 size={38} className="animate-spin text-[#694f5c]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-[#292628]">
            <AdminSidebar />

            <main className="lg:ml-[255px] min-h-screen">
                <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between sticky top-0 z-20">
                    <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">Catalog & Inventory</p>
                        <h1 className="text-xl font-semibold mt-1">All Products</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/products/add')}
                            className="h-10 px-4 rounded-xl bg-[#694f5c] text-white text-xs font-semibold flex items-center gap-2 hover:bg-[#5a4350] shadow-[2px_2px_8px_rgba(105,79,92,0.25)] transition"
                        >
                            <Plus size={16} />
                            <span>Add Product</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push('/admin/products')}
                            className="h-10 px-4 rounded-xl bg-[#faf7f8] text-[#6d5260] font-semibold text-xs border border-[#eee9ea] hover:bg-[#f2eaed] transition"
                        >
                            ← Back to Products
                        </button>
                    </div>
                </header>

                <div className="p-5 sm:p-8" style={{ paddingTop: '10px' }}>
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
                        <div>
                            <h2 className="text-3xl font-bold mt-1">Product Catalog</h2>
                            <p className="text-sm text-[#8a8385] mt-2">
                                View, search, update and delete products across all categories.
                            </p>
                        </div>

                        <div className="relative w-full lg:w-[360px]">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999194]" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search product by name..."
                                className="w-full h-12 rounded-xl bg-white border border-[#e3dddf] pl-11 pr-4 text-sm outline-none focus:border-[#9b808c] focus:ring-2 focus:ring-[#694f5c]/10 shadow-sm transition"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mt-6 rounded-xl border border-[#f0d8dc] bg-[#fff5f6] px-4 py-3 text-sm font-semibold text-[#9b5360]">
                            {error}
                        </div>
                    )}

                    <section className="mt-8 bg-white rounded-2xl shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)] overflow-hidden">
                        {loading ? (
                            <div className="py-24 flex flex-col items-center justify-center">
                                <Loader2 size={36} className="animate-spin text-[#694f5c]" />
                                <p className="mt-4 text-sm text-[#8a8385]">Loading products...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="py-24 text-center">
                                <Package size={45} className="mx-auto text-[#b0a6ab]" />
                                <h3 className="mt-4 font-semibold text-[#403a3d]">No Products Found</h3>
                                <p className="text-xs text-[#8a8385] mt-1">Get started by creating your first product item.</p>
                                <button
                                    type="button"
                                    onClick={() => router.push('/admin/products/add')}
                                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#694f5c] text-white text-xs font-semibold hover:bg-[#5a4350] transition"
                                >
                                    <Plus size={15} /> Add First Product
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1100px]">
                                    <thead>
                                        <tr className="bg-[#faf9f9] border-b border-[#eee9ea]">
                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">Category</th>
                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">SubCategory</th>
                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">Product</th>
                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">Price</th>
                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">Description</th>
                                            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#8a8385]">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredProducts.map((product) => {
                                            const isMatch =
                                                normalizedSearch &&
                                                String(product.productName || '').toLowerCase().includes(normalizedSearch);

                                            return (
                                                <tr
                                                    key={product.id}
                                                    className={`border-b border-[#f1eeee] last:border-0 transition-all duration-200 ${
                                                        isMatch
                                                            ? 'bg-[#f5e9ee] shadow-[inset_4px_0_0_#694f5c]'
                                                            : 'hover:bg-[#fcfbfb]'
                                                    }`}
                                                >
                                                    <td className="px-5 py-5">
                                                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#f4eff1] text-[#694f5c] text-xs font-semibold">
                                                            {product.categoryName || '-'}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <span className="text-sm font-medium text-[#5f595c]">
                                                            {product.subCategoryName || '-'}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <p className={`text-sm font-semibold ${isMatch ? 'text-[#694f5c]' : 'text-[#332f31]'}`}>
                                                            {product.productName || '-'}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <span className="text-sm font-bold text-[#694f5c]">
                                                            ₹{Number(product.price || 0).toLocaleString('en-IN')}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-5 max-w-[340px]">
                                                        <p className="text-sm text-[#777174] line-clamp-2 leading-relaxed">
                                                            {product.description || '-'}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => openProduct(product)}
                                                                className="w-9 h-9 rounded-xl bg-[#f3eef0] text-[#694f5c] flex items-center justify-center hover:bg-[#e8dfe3] transition"
                                                                title="View Product"
                                                            >
                                                                <Eye size={16} />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => router.push(`/admin/products/update/${product.id}`)}
                                                                className="w-9 h-9 rounded-xl bg-[#f3eef0] text-[#694f5c] flex items-center justify-center hover:bg-[#e8dfe3] transition"
                                                                title="Update Product"
                                                            >
                                                                <Pencil size={16} />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                disabled={deletingId === product.id}
                                                                onClick={() => handleDelete(product)}
                                                                className="w-9 h-9 rounded-xl bg-[#fff0f2] text-[#b55462] flex items-center justify-center hover:bg-[#ffe3e7] transition disabled:opacity-50"
                                                                title="Delete Product"
                                                            >
                                                                {deletingId === product.id ? (
                                                                    <Loader2 size={16} className="animate-spin" />
                                                                ) : (
                                                                    <Trash2 size={16} />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {!loading && products.length > 0 && (
                        <p className="mt-4 text-sm text-[#8a8385]">
                            {normalizedSearch ? (
                                <>
                                    Showing <span className="font-semibold text-[#694f5c]">{filteredProducts.length}</span> matching product{filteredProducts.length !== 1 ? 's' : ''}
                                </>
                            ) : (
                                <>
                                    Total <span className="font-semibold text-[#694f5c]">{products.length}</span> products
                                </>
                            )}
                        </p>
                    )}

                    <footer className="py-8 text-center">
                        <p className="text-xs text-[#9a9295]">© 2026 R Petals • Admin Panel</p>
                    </footer>
                </div>
            </main>

            {selectedProduct && (
                <ProductPopup
                    product={selectedProduct}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    previousImage={previousImage}
                    nextImage={nextImage}
                    closeProduct={closeProduct}
                    onUpdate={() => router.push(`/admin/products/update/${selectedProduct.id}`)}
                    onDelete={() => handleDelete(selectedProduct)}
                />
            )}
        </div>
    );
}

function ProductPopup({
    product,
    selectedImage,
    setSelectedImage,
    previousImage,
    nextImage,
    closeProduct,
    onUpdate,
    onDelete
}) {
    const images = Array.isArray(product.images) ? product.images : [];

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeProduct}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-[1000px] max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-5 border-b border-[#eee9ea] flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-[#9a9295]">Product Details</p>
                        <h3 className="text-xl font-bold mt-1 text-[#292628]">{product.productName}</h3>
                    </div>
                    <button
                        type="button"
                        onClick={closeProduct}
                        className="w-9 h-9 rounded-xl bg-[#f5f1f3] flex items-center justify-center text-[#694f5c] hover:bg-[#eae3e7] transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-7">
                    <div>
                        <div className="relative w-full h-[360px] sm:h-[460px] rounded-2xl overflow-hidden bg-[#f5f2f3] border border-[#eee8eb]">
                            {images.length > 0 ? (
                                <img
                                    src={images[selectedImage]?.imageUrl}
                                    alt={product.productName}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#aaa1a5]">
                                    <ImageIcon size={50} />
                                </div>
                            )}

                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={previousImage}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/90 shadow-md flex items-center justify-center text-[#332f31] hover:bg-white transition"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextImage}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/90 shadow-md flex items-center justify-center text-[#332f31] hover:bg-white transition"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        {images.length > 0 && (
                            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                                {images.map((image, index) => (
                                    <button
                                        key={image.id || index}
                                        type="button"
                                        onClick={() => setSelectedImage(index)}
                                        className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                                            selectedImage === index
                                                ? 'border-[#694f5c] ring-2 ring-[#694f5c]/20'
                                                : 'border-transparent'
                                        }`}
                                    >
                                        <img src={image.imageUrl} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="rounded-2xl bg-[#faf8f9] p-5">
                                <Info label="Category" value={product.categoryName} />
                                <Info label="SubCategory" value={product.subCategoryName} />
                                <Info label="Product Name" value={product.productName} />
                                <Info
                                    label="Price"
                                    value={`₹${Number(product.price || 0).toLocaleString('en-IN')}`}
                                />
                            </div>

                            <div className="rounded-2xl bg-[#faf8f9] p-5">
                                <p className="text-xs text-[#999194]">Description</p>
                                <p className="mt-2 text-sm leading-relaxed text-[#403a3d]">
                                    {product.description || '-'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3 pt-4 border-t border-[#eee9ea]">
                            <button
                                type="button"
                                onClick={onUpdate}
                                className="flex-1 h-11 rounded-xl bg-[#694f5c] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#5b4350] transition"
                            >
                                <Pencil size={16} /> Update
                            </button>

                            <button
                                type="button"
                                onClick={onDelete}
                                className="flex-1 h-11 rounded-xl bg-[#fff0f2] text-[#b55462] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#ffe3e7] transition"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="py-2.5 border-b border-[#eee9ea] last:border-0">
            <p className="text-xs text-[#999194]">{label}</p>
            <p className="mt-0.5 text-sm font-semibold text-[#403a3d]">{value || '-'}</p>
        </div>
    );
}