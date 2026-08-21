'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/app/admin/components/AdminSidebar';
import { initializeAuthSession } from '@/lib/auth';

const initialOccasions = [
  {
    id: '1',
    occasionName: "Valentine's Day",
    occasionImage: '',
    occasionDate: '2026-02-14T00:00:00',
    active: true,
    createdAt: '2026-01-10T10:30:00',
    updatedAt: '2026-01-10T10:30:00',
  },
  {
    id: '2',
    occasionName: "Mother's Day",
    occasionImage: '',
    occasionDate: '2026-05-10T00:00:00',
    active: true,
    createdAt: '2026-01-11T11:00:00',
    updatedAt: '2026-01-11T11:00:00',
  },
];

export default function AdminOccasionsPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [occasions, setOccasions] = useState(initialOccasions);
  const [showModal, setShowModal] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState(null);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    occasionName: '',
    occasionDate: '',
    active: true,
    image: null,
  });

  const [previewImage, setPreviewImage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef(null);

  /* Auth Check */
  useEffect(() => {
    initializeAuthSession();

    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    const storedUser = localStorage.getItem('rpetalsUser');

    if (!token) {
      router.replace('/login?redirect=/admin/occasions');
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
  }, [router]);

  /* Search Filter */
  const filteredOccasions = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return occasions;

    return occasions.filter((occasion) =>
      occasion.occasionName.toLowerCase().includes(value)
    );
  }, [occasions, search]);

  /* Open Add Modal */
  const openAddModal = () => {
    setEditingOccasion(null);
    setFormData({
      occasionName: '',
      occasionDate: '',
      active: true,
      image: null,
    });
    setPreviewImage('');
    setErrors({});
    setShowModal(true);
  };

  /* Open Edit Modal */
  const openEditModal = (occasion) => {
    setEditingOccasion(occasion);
    setFormData({
      occasionName: occasion.occasionName || '',
      occasionDate: occasion.occasionDate
        ? occasion.occasionDate.substring(0, 10)
        : '',
      active: occasion.active,
      image: null,
    });
    setPreviewImage(occasion.occasionImage || '');
    setErrors({});
    setShowModal(true);
  };

  /* Close Modal */
  const closeModal = () => {
    if (isSaving) return;
    setShowModal(false);
    setEditingOccasion(null);
    setPreviewImage('');
    setErrors({});
  };

  /* Input Change Handler */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  /* Image Upload & Validation */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    setFormData((prev) => ({ ...prev, image: file }));
    setPreviewImage(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: '' }));
  };

  /* Form Validation */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.occasionName.trim()) {
      newErrors.occasionName = 'Occasion name is required.';
    }

    if (!formData.occasionDate) {
      newErrors.occasionDate = 'Occasion date is required.';
    }

    if (!editingOccasion && !formData.image) {
      newErrors.image = 'Occasion image is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* Form Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      const now = new Date().toISOString();

      if (editingOccasion) {
        setOccasions((prev) =>
          prev.map((item) =>
            item.id === editingOccasion.id
              ? {
                  ...item,
                  occasionName: formData.occasionName.trim(),
                  occasionDate: formData.occasionDate,
                  active: formData.active,
                  occasionImage: previewImage || item.occasionImage,
                  updatedAt: now,
                }
              : item
          )
        );
      } else {
        const newOccasion = {
          id: Date.now().toString(),
          occasionName: formData.occasionName.trim(),
          occasionImage: previewImage,
          occasionDate: formData.occasionDate,
          active: formData.active,
          createdAt: now,
          updatedAt: now,
        };

        setOccasions((prev) => [newOccasion, ...prev]);
      }

      closeModal();
    } catch (error) {
      console.error('Failed to save occasion:', error);
    } finally {
      setIsSaving(false);
    }
  };

  /* Delete Item */
  const handleDelete = (occasion) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${occasion.occasionName}"?`
    );
    if (!confirmed) return;

    setOccasions((prev) => prev.filter((item) => item.id !== occasion.id));
  };

  /* Toggle Status */
  const toggleActive = (occasion) => {
    setOccasions((prev) =>
      prev.map((item) =>
        item.id === occasion.id
          ? {
              ...item,
              active: !item.active,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  /* Date Formatter */
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-[#777174]">
            Loading occasions console...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#292628]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="lg:ml-[255px] min-h-screen">
        {/* Top Header */}
        <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
              Catalog & Inventory
            </p>
            <h1 className="text-xl font-semibold mt-1">Occasion Management</h1>
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

        <div className="p-5 sm:p-8">
          {/* Page Heading */}
          <section>
            <p className="text-sm text-[#8a8385]">Occasion Dashboard</p>
            <h2 className="text-3xl font-bold mt-1">Occasions Overview</h2>
            <p className="text-sm text-[#8a8385] mt-2">
              Add, update, view and filter all special occasions.
            </p>
          </section>

          {/* Occasions Catalog Section */}
          <section className="mt-10" style={{ paddingTop: '10px' }}>
            <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)]">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                    Occasion Breakdown
                  </p>
                  <h2 className="text-xl font-semibold mt-1">All Occasions</h2>
                  <p className="text-sm text-[#8a8385] mt-1">
                    View, update and manage all occasions.
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-[#faf7f8] flex items-center justify-center text-lg">
                  🎉
                </div>
              </div>

              {/* Search Bar */}
              <div className="mt-6">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search occasions..."
                  className="w-full rounded-xl border border-[#e5e1e2] bg-[#faf9f9] px-4 py-3 text-sm outline-none focus:border-[#6d5260]"
                />
              </div>

              {/* Data Table */}
              <div className="mt-6 overflow-x-auto rounded-xl border border-[#eee9ea]">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-[#faf9f9] border-b border-[#eee9ea]">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">
                        Image
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">
                        Occasion
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">
                        Date
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">
                        Status
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#8a8385]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOccasions.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-5 py-12 text-center">
                          <div className="text-3xl">🎉</div>
                          <p className="font-medium mt-3">No occasions found</p>
                          <p className="text-sm text-[#8a8385] mt-1">
                            Add an occasion to see it here.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredOccasions.map((occasion) => (
                        <tr
                          key={occasion.id}
                          className="border-b border-[#f1eeee] last:border-0 hover:bg-[#fcfbfb] transition"
                        >
                          <td className="px-5 py-5">
                            <div className="w-10 h-10 rounded-xl bg-[#eee4eb] flex items-center justify-center text-lg overflow-hidden">
                              {occasion.occasionImage ? (
                                <img
                                  src={occasion.occasionImage}
                                  alt={occasion.occasionName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                '🎉'
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <p className="text-sm font-semibold text-[#403a3d]">
                              {occasion.occasionName}
                            </p>
                            <p className="text-xs text-[#aaa4a6] mt-1">
                              ID: {occasion.id}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <span className="text-sm text-[#6f696b]">
                              {formatDate(occasion.occasionDate)}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <button
                              onClick={() => toggleActive(occasion)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                                occasion.active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {occasion.active ? 'Active' : 'Inactive'}
                            </button>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEditModal(occasion)}
                                className="px-3 py-2 rounded-lg border border-[#ded9da] text-xs font-semibold text-[#6d5260] hover:bg-[#faf7f8] transition"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => handleDelete(occasion)}
                                className="px-3 py-2 rounded-lg border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-8 text-center">
            <p className="text-xs text-[#9a9295]">
              © 2026 R Petals • Admin Panel
            </p>
          </footer>
        </div>
      </main>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-[8px_8px_30px_rgba(0,0,0,0.12)]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#eee9ea] flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">
                  {editingOccasion ? 'Update Occasion' : 'Create Occasion'}
                </p>
                <h2 className="text-xl font-semibold mt-1">
                  {editingOccasion ? 'Update Occasion' : 'Add Occasion'}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-xl bg-[#faf7f8] text-[#777174] hover:bg-[#f1e9ec] transition"
              >
                ×
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Section */}
                <div>
                  <label className="text-sm font-semibold text-[#403a3d]">
                    Occasion Image
                  </label>

                  <div className="mt-3">
                    <div className="h-[230px] rounded-xl border border-dashed border-[#ddd5d7] bg-[#faf9f9] overflow-hidden flex items-center justify-center">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Occasion Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-4xl">🎉</div>
                          <p className="text-sm text-[#8a8385] mt-2">
                            No image selected
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
                      className="mt-3 w-full py-2.5 rounded-xl border border-[#ded9da] bg-[#faf7f8] text-sm font-semibold text-[#6d5260] hover:bg-[#f1e9ec] transition"
                    >
                      Choose Image
                    </button>

                    <p className="text-xs text-[#9a9295] mt-2">
                      PNG, JPG or WEBP • Maximum 5 MB
                    </p>

                    {errors.image && (
                      <p className="text-xs text-red-500 mt-2">{errors.image}</p>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div>
                  <label className="text-sm font-semibold text-[#403a3d]">
                    Occasion Name
                  </label>
                  <input
                    type="text"
                    name="occasionName"
                    value={formData.occasionName}
                    onChange={handleChange}
                    placeholder="e.g. Valentine's Day"
                    className={`mt-2 w-full rounded-xl border bg-[#faf9f9] px-4 py-3 text-sm outline-none transition ${
                      errors.occasionName
                        ? 'border-red-400'
                        : 'border-[#e5e1e2] focus:border-[#6d5260]'
                    }`}
                  />
                  {errors.occasionName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.occasionName}
                    </p>
                  )}

                  <label className="text-sm font-semibold text-[#403a3d] block mt-5">
                    Occasion Date
                  </label>
                  <input
                    type="date"
                    name="occasionDate"
                    value={formData.occasionDate}
                    onChange={handleChange}
                    className={`mt-2 w-full rounded-xl border bg-[#faf9f9] px-4 py-3 text-sm outline-none transition ${
                      errors.occasionDate
                        ? 'border-red-400'
                        : 'border-[#e5e1e2] focus:border-[#6d5260]'
                    }`}
                  />
                  {errors.occasionDate && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.occasionDate}
                    </p>
                  )}

                  {/* Active Toggle Switch */}
                  <div className="mt-5 flex items-center justify-between rounded-xl bg-[#faf9f9] p-4">
                    <div>
                      <p className="text-sm font-semibold">Active Occasion</p>
                      <p className="text-xs text-[#8a8385] mt-1">
                        Show this occasion on website.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          active: !prev.active,
                        }))
                      }
                      className={`relative w-11 h-6 rounded-full transition ${
                        formData.active ? 'bg-[#6d5260]' : 'bg-[#d5d1d2]'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                          formData.active ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="mt-7 pt-5 border-t border-[#eee9ea] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl border border-[#ded9da] text-sm font-semibold text-[#777174] hover:bg-[#faf7f8] transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#6d5260] text-white text-sm font-semibold hover:bg-[#5d4650] transition disabled:opacity-50"
                >
                  {isSaving
                    ? 'Saving...'
                    : editingOccasion
                    ? 'Update Occasion'
                    : 'Add Occasion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* Action Card Component */
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
      <p className="text-xs font-semibold text-[#775966] mt-5">
        {actionText} →
      </p>
    </button>
  );
}