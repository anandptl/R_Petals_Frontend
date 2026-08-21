'use client';

import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import AdminSidebar from '@/app/admin/components/AdminSidebar';
export default function StoreOrdersPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-[#f7f7f5] text-[#292628]">
            <AdminSidebar />
            <main className="lg:ml-[255px] min-h-screen">
                <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">Store Management</p>
                        <h1 className="text-xl font-semibold mt-1">Store Orders</h1>
                    </div>
                    <button
                        onClick={() => router.push('/admin/stores')}
                        className="px-4 py-2 rounded-xl bg-[#faf7f8] text-[#6d5260] font-semibold text-xs border border-[#eee9ea] hover:bg-[#f2eaed] transition"
                    >
                        ← Back to Stores
                    </button>
                </header>
                
                <div className="p-5 sm:p-8">
                    <p className="text-sm text-[#8a8385]">Track orders belonging to registered stores.</p>

                    <h2 className="text-3xl font-bold mt-1">Store Orders</h2>
                    <div className="mt-8 bg-white rounded-2xl p-10 text-center shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)]">
                        <div className="w-14 h-14 rounded-2xl bg-[#f3e9df] text-[#694f5c] flex items-center justify-center mx-auto"><ShoppingCart size={24} /></div>
                        <h3 className="text-xl font-semibold mt-5">Store orders API is not connected yet</h3>
                        <p className="text-sm text-[#8a8385] max-w-lg mx-auto mt-2 leading-6">The page and navigation are ready. Connect the order endpoint when the backend Order module is available.</p>
                        <button onClick={() => router.push('/admin/stores')} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#694f5c]">Back to dashboard <ArrowRight size={16} /></button>
                    </div>
                </div>
            </main>
        </div>
    );
}

function Header() { return <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">Store Management</p><h1 className="text-xl font-semibold mt-1">Store Orders</h1></div><div className="w-10 h-10 rounded-xl bg-[#e7dce1] text-[#6d5260] flex items-center justify-center font-bold">A</div></header>; }
