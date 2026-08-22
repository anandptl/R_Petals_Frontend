'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, X, Activity } from 'lucide-react';
import { logout } from '@/lib/auth';

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminName, setAdminName] = useState('ADMIN');

  // Load Admin Name from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('rpetalsUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const name = user?.name || user?.fullName || user?.username || 'ADMIN';
        setAdminName(name);
      } catch (error) {
        console.error('Failed to load admin name:', error);
        setAdminName('ADMIN');
      }
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Handle body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setMobileOpen(false);
      router.replace('/login');
    }
  };

  // Navigation handler
  const navigate = (path) => {
    router.push(path);
    setMobileOpen(false);
  };

  // Active route checker
  const isActive = (path) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Extract admin first letter for avatar
  const adminInitial =
    adminName && adminName !== 'ADMIN'
      ? adminName.trim().charAt(0).toUpperCase()
      : 'A';

  return (
    <>
      {/* Mobile Header */}
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
            onClick={() => router.push('/admin')}
            className="h-9 w-auto object-contain"
          />
        </div>

        {/* Mobile Admin Initial */}
        <div className="w-9 h-9 rounded-xl bg-[#e7dce1] flex items-center justify-center text-[#6d5260] font-bold text-sm">
          {adminInitial}
        </div>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-[270px] bg-white border-r border-[#e9e5e6] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="h-[82px] px-6 flex items-center justify-between border-b border-[#eeeaea]">
          <img
            src="/logo1.png"
            alt="R Petals"
            onClick={() => router.push('/admin')} 
            className="h-12 w-auto object-contain"
          />

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-9 h-9 rounded-xl bg-[#faf7f8] text-[#694f5c] flex items-center justify-center hover:bg-[#eee5e9] transition"
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        {/* Admin Profile Card */}
        <div className="p-5">
          <div className="bg-[#faf7f8] rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#e7dce1] flex items-center justify-center text-[#6d5260] font-bold">
                {adminInitial}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{adminName}</p>
                <p className="text-xs text-[#8a8385] mt-1">ADMIN</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 space-y-1 overflow-y-auto flex-1">
          <SidebarItem
            icon="🏠"
            title="Dashboard"
            active={isActive('/admin')}
            onClick={() => navigate('/admin')}
          />
          <SidebarItem
            icon="🏪"
            title="Stores"
            active={isActive('/admin/stores')}
            onClick={() => navigate('/admin/stores')}
          />
          <SidebarItem
            icon={<Activity size={19} />}
            title="Active Stores"
            active={isActive('/admin/active-stores')}
            onClick={() => navigate('/admin/active-stores')}
          />
          <SidebarItem
            icon="✨"
            title="Occasions"
            active={isActive('/admin/occasions')}
            onClick={() => navigate('/admin/occasions')}
          />    
          <SidebarItem
            icon="💖"
            title="Feelings"
            active={isActive('/admin/feelings')}
            onClick={() => navigate('/admin/feelings')}
          />   
          <SidebarItem
            icon="📦"
            title="Products"
            active={isActive('/admin/products')}
            onClick={() => navigate('/admin/products')}
          />
          <SidebarItem
            icon="🛒"
            title="Orders"
            active={isActive('/admin/orders')}
            onClick={() => navigate('/admin/orders')}
          />
          <SidebarItem
            icon="👤"
            title="Users"
            active={isActive('/admin/users')}
            onClick={() => navigate('/admin/users')}
          />
        </nav>

        {/* Logout Button */}
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

/* Sidebar Item Component */
function SidebarItem({ icon, title, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
        active
          ? 'bg-[#eee5e9] text-[#694f5c]'
          : 'text-[#706a6c] hover:bg-[#faf7f8] hover:text-[#694f5c]'
      }`}
    >
      <span className="w-6 flex justify-center shrink-0">{icon}</span>
      <span>{title}</span>
    </button>
  );
}