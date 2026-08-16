'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
    LayoutDashboard,
    Store,
    ClipboardCheck,
    Tags,
    Package,
    ShoppingCart,
    Users,
    LogOut,
    Menu,
    X,
} from 'lucide-react';

export default function AdminSidebar() {

    const router = useRouter();
    const pathname = usePathname();

    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);


    useEffect(() => {

        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };

    }, [mobileOpen]);


    const handleLogout = async () => {
        const token = localStorage.getItem("accessToken");

        try {
            if (token) {
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/logout`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("role");
            localStorage.removeItem("rpetalsUser");

            setUser(null);
            setMenuOpen(false);
            setProfileMenuOpen(false);
            setMobileProfileOpen(false);

            router.replace("/login");
        }
    };

    const navigate = (path) => {

        router.push(path);

        // Mobile par click ke baad close
        setMobileOpen(false);
    };


    const isActive = (path) => {

        if (path === '/admin') {
            return pathname === '/admin';
        }

        return pathname === path ||
            pathname.startsWith(`${path}/`);
    };


    return (
        <>

            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-[68px] bg-white border-b border-[#e9e5e6] flex items-center justify-between px-4">

                <div className="flex items-center gap-3">

                    <button
                        onClick={() => setMobileOpen(true)}
                        className="w-10 h-10 rounded-xl bg-[#faf7f8] text-[#694f5c] flex items-center justify-center hover:bg-[#eee5e9] transition"
                        aria-label="Open menu"
                    >
                        <Menu size={21} />
                    </button>


                    <img
                        src="/logo1.png"
                        alt="R Petals"
                        className="h-9 w-auto object-contain"
                    />

                </div>


                <div className="w-9 h-9 rounded-xl bg-[#e7dce1] flex items-center justify-center text-[#6d5260] font-bold text-sm">
                    A
                </div>

            </header>

            {mobileOpen && (

                <button
                    aria-label="Close menu"
                    onClick={() => setMobileOpen(false)}
                    className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
                />

            )}

            <aside
                className={`
          fixed
          left-0
          top-0
          bottom-0
          z-50
          w-[270px]
          bg-white
          border-r
          border-[#e9e5e6]
          flex
          flex-col
          transition-transform
          duration-300
          ease-in-out

          lg:translate-x-0

          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >

                <div className="h-[82px] px-6 flex items-center justify-between border-b border-[#eeeaea]">

                    <img
                        src="/logo1.png"
                        alt="R Petals"
                        className="h-12 w-auto object-contain"
                    />


                    {/* MOBILE CLOSE */}

                    <button
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden w-9 h-9 rounded-xl bg-[#faf7f8] text-[#694f5c] flex items-center justify-center hover:bg-[#eee5e9] transition"
                    >
                        <X size={19} />
                    </button>

                </div>


                <div className="p-5">

                    <div className="bg-[#faf7f8] rounded-2xl p-4">

                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-[#e7dce1] flex items-center justify-center text-[#6d5260] font-bold">
                                A
                            </div>


                            <div className="min-w-0">

                                <p className="text-sm font-semibold truncate">
                                    Administrator
                                </p>

                                <p className="text-xs text-[#8a8385] mt-1">
                                    ADMIN
                                </p>

                            </div>

                        </div>

                    </div>

                </div>



                <nav className="px-4 space-y-1 overflow-y-auto flex-1">

                    <SidebarItem
                        icon={<LayoutDashboard size={19} />}
                        title="Dashboard"
                        active={isActive('/admin')}
                        onClick={() => navigate('/admin')}
                    />


                    <SidebarItem
                        icon={<Store size={19} />}
                        title="Shops"
                        active={isActive('/admin/shops')}
                        onClick={() => navigate('/admin/shops')}
                    />

                    <SidebarItem
                        icon={<Tags size={19} />}
                        title="Categories"
                        active={isActive('/admin/categories')}
                        onClick={() => navigate('/admin/categories')}
                    />


                    <SidebarItem
                        icon={<Package size={19} />}
                        title="Products"
                        active={isActive('/admin/products')}
                        onClick={() => navigate('/admin/products')}
                    />


                    <SidebarItem
                        icon={<ShoppingCart size={19} />}
                        title="Orders"
                        active={isActive('/admin/orders')}
                        onClick={() => navigate('/admin/orders')}
                    />


                    <SidebarItem
                        icon={<Users size={19} />}
                        title="Users"
                        active={isActive('/admin/users')}
                        onClick={() => navigate('/admin/users')}
                    />

                </nav>

                <div className="p-5 border-t border-[#eeeaea]">

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#8b4f5d] hover:bg-[#faf1f3] transition"
                    >

                        <LogOut size={18} />

                        Logout

                    </button>

                </div>

            </aside>
        </>
    );
}


function SidebarItem({
    icon,
    title,
    active,
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

            <span className="w-6 flex justify-center shrink-0">
                {icon}
            </span>

            <span>
                {title}
            </span>

        </button>
    );
}