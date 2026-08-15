'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    const storedUser = localStorage.getItem('rpetalsUser');

    if (!token) {
      router.replace('/login?redirect=/admin');
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

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('rpetalsUser');

    router.replace('/login');
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-[#777174]">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#292628]">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside className="fixed hidden lg:flex left-0 top-0 bottom-0 w-[255px] bg-white border-r border-[#e9e5e6] flex-col">

        {/* LOGO */}

        <div className="h-[82px] px-7 flex items-center border-b border-[#eeeaea]">

          <img
            src="/logo1.png"
            alt="R Petals"
            className="h-12 w-auto object-contain"
          />

        </div>

        {/* ADMIN */}

        <div className="p-5">

          <div className="bg-[#faf7f8] rounded-2xl p-4">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-[#e7dce1] flex items-center justify-center text-[#6d5260] font-bold">
                A
              </div>

              <div className="min-w-0">

                <p className="text-sm font-semibold truncate">
                  {user?.name || 'Administrator'}
                </p>

                <p className="text-xs text-[#8a8385] mt-1">
                  ADMIN
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="px-4 space-y-1">

          <NavItem
            icon="▦"
            title="Dashboard"
            active
          />

          <NavItem
            icon="🏪"
            title="Shops"
            onClick={() => router.push('/admin/shops')}
          />

          <NavItem
            icon="✓"
            title="Shop Approvals"
            onClick={() => router.push('/admin/shops')}
          />

          <NavItem
            icon="◈"
            title="Categories"
            onClick={() => router.push('/admin/categories')}
          />

          <NavItem
            icon="◇"
            title="Subcategories"
            onClick={() => router.push('/admin/categories')}
          />

          <NavItem
            icon="🌹"
            title="Products"
            onClick={() => router.push('/admin/products')}
          />

          <NavItem
            icon="▧"
            title="Product Images"
            onClick={() => router.push('/admin/products')}
          />

          <NavItem
            icon="▤"
            title="Orders"
            onClick={() => router.push('/admin/orders')}
          />

          <NavItem
            icon="♙"
            title="Users"
            onClick={() => router.push('/admin/users')}
          />

          <NavItem
            icon="▥"
            title="Reports"
            onClick={() => router.push('/admin/reports')}
          />

        </nav>

        {/* LOGOUT */}

        <div className="mt-auto p-5 border-t border-[#eeeaea]">

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#8b4f5d] hover:bg-[#faf1f3] transition"
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="lg:ml-[255px] min-h-screen">

        {/* TOPBAR */}

        <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
              Administration
            </p>

            <h1 className="text-xl font-semibold mt-1">
              Dashboard
            </h1>

          </div>

          <div className="flex items-center gap-3">

            <button className="w-10 h-10 rounded-xl bg-[#faf7f8] flex items-center justify-center text-[#777174] hover:bg-[#f1e9ec] transition">
              🔔
            </button>

            <div className="w-10 h-10 rounded-xl bg-[#e7dce1] text-[#6d5260] flex items-center justify-center font-bold">
              A
            </div>

          </div>

        </header>

        {/* CONTENT */}

        <div className="p-5 sm:p-8">

          {/* WELCOME */}

          <section>

            <p className="text-sm text-[#8a8385]">
              Welcome back,
            </p>

            <h2 className="text-3xl font-bold mt-1">
              {user?.name || 'Administrator'}
            </h2>

            <p className="text-sm text-[#8a8385] mt-2">
              Manage the complete R Petals platform from here.
            </p>

          </section>

          {/* STATS */}

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">

            <StatCard
              title="Total Shops"
              value="0"
              icon="🏪"
              accent="bg-[#e8eef2]"
            />

            <StatCard
              title="Pending Approvals"
              value="0"
              icon="✓"
              accent="bg-[#f3e9df]"
            />

            <StatCard
              title="Total Products"
              value="0"
              icon="🌹"
              accent="bg-[#eee4eb]"
            />

            <StatCard
              title="Total Orders"
              value="0"
              icon="▤"
              accent="bg-[#e5eee9]"
            />

          </section>

          {/* MANAGEMENT */}

          <section className="mt-10">

            <div className="mb-5">

              <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                Management
              </p>

              <h2 className="text-2xl font-bold mt-1">
                Admin Controls
              </h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              <ManagementCard
                icon="🏪"
                title="Shops"
                description="View and manage all registered shops."
                onClick={() => router.push('/admin/shops')}
              />

              <ManagementCard
                icon="✓"
                title="Shop Approvals"
                description="Review and approve shopkeeper registrations."
                onClick={() => router.push('/admin/shops')}
              />

              <ManagementCard
                icon="◈"
                title="Categories"
                description="Create and manage product categories."
                onClick={() => router.push('/admin/categories')}
              />

              <ManagementCard
                icon="◇"
                title="Subcategories"
                description="Manage category-wise subcategories."
                onClick={() => router.push('/admin/categories')}
              />

              <ManagementCard
                icon="🌹"
                title="Products"
                description="Add, update and remove products."
                onClick={() => router.push('/admin/products')}
              />

              <ManagementCard
                icon="▧"
                title="Product Images"
                description="Manage product images and media."
                onClick={() => router.push('/admin/products')}
              />

              <ManagementCard
                icon="▤"
                title="Orders"
                description="View and manage customer orders."
                onClick={() => router.push('/admin/orders')}
              />

              <ManagementCard
                icon="♙"
                title="Users"
                description="View registered users and accounts."
                onClick={() => router.push('/admin/users')}
              />

              <ManagementCard
                icon="▥"
                title="Reports"
                description="View platform performance and reports."
                onClick={() => router.push('/admin/reports')}
              />

            </div>

          </section>

          {/* RECENT ACTIVITY */}

          <section className="mt-10">

            <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)]">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                    Activity
                  </p>

                  <h2 className="text-xl font-semibold mt-1">
                    Recent Activity
                  </h2>

                </div>

                <div className="w-10 h-10 rounded-xl bg-[#faf7f8] flex items-center justify-center">
                  ✨
                </div>

              </div>

              <div className="mt-6 rounded-xl bg-[#faf9f9] py-12 text-center">

                <div className="text-3xl">
                  🌸
                </div>

                <p className="font-medium mt-3">
                  No recent activity
                </p>

                <p className="text-sm text-[#8a8385] mt-1">
                  Admin activities will appear here.
                </p>

              </div>

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


/* ========================================================= */
/* NAV ITEM */
/* ========================================================= */

function NavItem({
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
        ${
          active
            ? 'bg-[#eee5e9] text-[#694f5c] shadow-[3px_3px_8px_rgba(0,0,0,0.04),-3px_-3px_8px_rgba(255,255,255,0.8)]'
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


/* ========================================================= */
/* STAT CARD */
/* ========================================================= */

function StatCard({
  title,
  value,
  icon,
  accent,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[5px_5px_16px_rgba(0,0,0,0.04),-5px_-5px_16px_rgba(255,255,255,0.9)]">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-[#8a8385]">
            {title}
          </p>

          <p className="text-3xl font-bold mt-3">
            {value}
          </p>

        </div>

        <div className={`w-12 h-12 ${accent} rounded-xl flex items-center justify-center text-xl shadow-[3px_3px_8px_rgba(0,0,0,0.05),-3px_-3px_8px_rgba(255,255,255,0.8)]`}>
          {icon}
        </div>

      </div>

    </div>
  );
}


/* ========================================================= */
/* MANAGEMENT CARD */
/* ========================================================= */

function ManagementCard({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="group text-left bg-white rounded-2xl p-6 shadow-[5px_5px_16px_rgba(0,0,0,0.04),-5px_-5px_16px_rgba(255,255,255,0.9)] hover:-translate-y-1 hover:shadow-[7px_7px_20px_rgba(0,0,0,0.06),-7px_-7px_20px_rgba(255,255,255,0.9)] transition-all duration-300"
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
        Open →
      </p>

    </button>
  );
}