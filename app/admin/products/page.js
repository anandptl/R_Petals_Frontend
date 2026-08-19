'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/app/admin/components/AdminSidebar';
import { apiFetch, initializeAuthSession } from '@/lib/auth';

export default function AdminProductsPage() {
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

    useEffect(() => {
        initializeAuthSession();

        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('role');
        const storedUser = localStorage.getItem('rpetalsUser');

        if (!token) {
            router.replace('/login?redirect=/admin/products');
            return;
        }

        if (role !== 'ADMIN') {
            router.replace('/');
            return;
        }

        setChecking(false);

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        }

        const loadCategories = async () => {
            try {
                setCategoriesLoading(true);

                const response = await apiFetch(
                    `${API_URL}/admin/categories`,
                    {
                        method: 'GET'
                    }
                );

                if (response.status === 401) {
                    router.replace('/login?redirect=/admin/products');
                    return;
                }

                const result = await response.json();

                if (response.ok && result.success) {
                    setCategories(
                        Array.isArray(result.data)
                            ? result.data
                            : []
                    );
                } else {
                    setCategories([]);
                }
            } catch (error) {
                console.error('Failed to load categories:', error);
                setCategories([]);
            } finally {
                setCategoriesLoading(false);
            }
        };

        loadCategories();
    }, [router, API_URL]);

    if (checking) {
        return (
            <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-sm text-[#777174]">
                        Loading products console...
                    </p>
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
                        <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                            Catalog & Inventory
                        </p>
                        <h1 className="text-xl font-semibold mt-1">
                            Product Management
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

                <div className="p-5 sm:p-8">
                    <section>
                        <p className="text-sm text-[#8a8385]">
                            Inventory Dashboard
                        </p>
                        <h2 className="text-3xl font-bold mt-1">
                            Products Overview
                        </h2>
                        <p className="text-sm text-[#8a8385] mt-2">
                            Add, update, view and filter all store products by categories.
                        </p>
                    </section>

                    <section className="mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <ActionCard
                                icon="➕"
                                title="Add Product"
                                description="Create new items, upload images and configure pricing."
                                actionText="Add Product"
                                onClick={() => router.push('/admin/products/add')}
                            />

                            <ActionCard
                                icon="📦"
                                title="All Products"
                                description="Browse complete product inventory and current stock status."
                                actionText="View Catalog"
                                onClick={() => router.push('/admin/products/all')}
                            />

                            <ActionCard
                                icon="⚙️"
                                title="Update & Delete"
                                description="Edit existing products, modify rates or remove items."
                                actionText="Manage Products"
                                onClick={() => router.push('/admin/products/manage')}
                            />
                        </div>
                    </section>

                    <section className="mt-10">
                        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                                        Catalog Breakdown
                                    </p>
                                    <h2 className="text-xl font-semibold mt-1">
                                        Category-wise Products
                                    </h2>
                                    <p className="text-sm text-[#8a8385] mt-1">
                                        Products grouped by category and subcategory.
                                    </p>
                                </div>

                                <div className="w-10 h-10 rounded-xl bg-[#faf7f8] flex items-center justify-center text-lg">
                                    🏷️
                                </div>
                            </div>

                            {categoriesLoading ? (
                                <div className="mt-6 rounded-xl bg-[#faf9f9] py-12 text-center">
                                    <div className="w-8 h-8 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin mx-auto" />
                                    <p className="text-sm text-[#8a8385] mt-4">
                                        Loading categories...
                                    </p>
                                </div>
                            ) : categories.length === 0 ? (
                                <div className="mt-6 rounded-xl bg-[#faf9f9] py-12 text-center">
                                    <div className="text-3xl">
                                        📦
                                    </div>
                                    <p className="font-medium mt-3">
                                        No categories found
                                    </p>
                                    <p className="text-sm text-[#8a8385] mt-1">
                                        Categories created will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-6 overflow-x-auto rounded-xl border border-[#eee9ea]">
                                    <table className="w-full min-w-[700px]">
                                        <thead>
                                            <tr className="bg-[#faf9f9] border-b border-[#eee9ea]">
                                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">
                                                    Category
                                                </th>
                                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">
                                                    Subcategories
                                                </th>
                                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">
                                                    Total Products
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {categories.map((cat, index) => {
                                                const productCount =
                                                    cat.productCount ??
                                                    cat.products?.length ??
                                                    0;

                                                return (
                                                    <tr
                                                        key={cat.id || cat._id || index}
                                                        className="border-b border-[#f1eeee] last:border-0 hover:bg-[#fcfbfb] transition"
                                                    >
                                                        <td className="px-5 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-[#eee4eb] flex items-center justify-center text-lg shrink-0">
                                                                    🏷️
                                                                </div>
                                                                <p className="text-sm font-semibold text-[#403a3d]">
                                                                    {cat.categoryName || 'Unnamed Category'}
                                                                </p>
                                                            </div>
                                                        </td>

                                                        <td className="px-5 py-5">
                                                            <div className="flex flex-wrap gap-2">
                                                                {Array.isArray(cat.subCategories) && cat.subCategories.length > 0 ? (
                                                                    cat.subCategories.map((sub, subIndex) => (
                                                                        <span
                                                                            key={sub.id || sub._id || subIndex}
                                                                            className="text-xs px-2.5 py-1 bg-[#f4eff1] text-[#6d5260] rounded-md font-medium"
                                                                        >
                                                                            {sub.subCategoryName || 'Unnamed'}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-xs text-[#aaa4a6]">
                                                                        No subcategory
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>

                                                        <td className="px-5 py-5">
                                                            <span className="text-sm font-semibold text-[#403a3d]">
                                                                {productCount} {productCount === 1 ? 'Product' : 'Products'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
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

            <h3 className="text-lg font-semibold mt-5">
                {title}
            </h3>

            <p className="text-sm text-[#81797c] mt-2 leading-6">
                {description}
            </p>

            <p className="text-xs font-semibold text-[#775966] mt-5">
                {actionText} →
            </p>
        </button>
    );
}