'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Pencil, Trash2, Search, X } from 'lucide-react';
import AdminSidebar from '@/app/admin/components/AdminSidebar';
import { apiFetch, initializeAuthSession } from '@/lib/auth'; //[cite: 2]

export default function AdminFeelingsPage() {
  const router = useRouter();

  // Authentication states
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  // Feelings list and search states
  const [feelings, setFeelings] = useState([]);
  const [search, setSearch] = useState('');
  const [loadingFeelings, setLoadingFeelings] = useState(false);
  const [feelingError, setFeelingError] = useState('');

  // Modal display states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFeeling, setEditingFeeling] = useState(null);
  const [viewingFeeling, setViewingFeeling] = useState(null);

  // Form edit states
  const [formData, setFormData] = useState({ feelingName: '', active: true, image: null });
  const [previewImage, setPreviewImage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';


  // Verify authentication and admin privileges
  useEffect(() => {
    initializeAuthSession(); //[cite: 2]

    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    const storedUser = localStorage.getItem('rpetalsUser');

    if (!token) {
      router.replace('/login?redirect=/admin/feelings/all');
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

  // Fetch all feelings from the backend API
  useEffect(() => {
    if (checking) return;

    const loadFeelings = async () => {
      setLoadingFeelings(true);
      setFeelingError('');

      try {
        const response = await apiFetch(`${API_URL}/feelings/all`, {
          method: 'GET'
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to load feelings: ${response.status}`);
        }

        const data = await response.json();
        setFeelings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load feelings:', error);
        setFeelingError(error.message || 'Failed to load feelings.');
        setFeelings([]);
      } finally {
        setLoadingFeelings(false);
      }
    };

    loadFeelings();
  }, [checking]);

  // Filter and prioritize matched search queries to the top
  const processedFeelings = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return feelings.map((item) => ({ ...item, isMatched: false }));
    }

    const matched = [];
    const unmatched = [];

    feelings.forEach((item) => {
      const name = (item.feelingName || '').toLowerCase();
      if (name.includes(query)) {
        matched.push({ ...item, isMatched: true });
      } else {
        unmatched.push({ ...item, isMatched: false });
      }
    });

    return [...matched, ...unmatched];
  }, [feelings, search]);

  // Open edit modal and populate state
  const openEditModal = (feeling) => {
    setEditingFeeling(feeling);
    setFormData({
      feelingName: feeling.feelingName || '',
      active: feeling.active ?? true,
      image: null,
    });
    setPreviewImage(feeling.feelingImage || '');
    setErrors({});
    setShowEditModal(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset form and close edit modal
  const closeEditModal = () => {
    if (isSaving) return;

    setShowEditModal(false);
    setEditingFeeling(null);
    setFormData({ feelingName: '', active: true, image: null });
    setPreviewImage('');
    setErrors({});

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Toggle active status boolean
  const handleActiveToggle = () => {
    setFormData((prev) => ({ ...prev, active: !prev.active }));
  };

  // Handle image file selection and preview creation
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'Please select a valid image.' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image size must be less than 5 MB.' }));
      return;
    }

    if (previewImage && previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage);
    }

    setFormData((prev) => ({ ...prev, image: file }));
    setPreviewImage(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: '' }));
  };

  // Form input validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.feelingName.trim()) {
      newErrors.feelingName = 'Feeling name is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit update request for feeling
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingFeeling || !validateForm()) return;

    setIsSaving(true);

    try {
      const data = new FormData();
      data.append('feelingName', formData.feelingName.trim());
      data.append('active', String(formData.active));

      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await apiFetch(`${API_URL}/feelings/${editingFeeling.id}`, {
        method: 'PUT',
        body: data,
      }); //[cite: 2]

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update feeling: ${response.status}`);
      }

      const updatedFeeling = await response.json();

      setFeelings((prev) =>
        prev.map((item) => (item.id === updatedFeeling.id ? updatedFeeling : item))
      );

      setViewingFeeling(null);
      closeEditModal();
    } catch (error) {
      console.error('Failed to update feeling:', error);
      setErrors({ submit: error.message || 'Failed to update feeling.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a feeling record with user confirmation
  const handleDelete = async (feeling) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${feeling.feelingName}"?`);
    if (!confirmed) return;

    try {
      const response = await apiFetch(`${API_URL}/feelings/${feeling.id}`, { method: 'DELETE' }); //[cite: 2]

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `Failed to delete feeling: ${response.status}`);
      }

      setFeelings((prev) => prev.filter((item) => item.id !== feeling.id));

      if (viewingFeeling?.id === feeling.id) {
        setViewingFeeling(null);
      }

      if (editingFeeling?.id === feeling.id) {
        closeEditModal();
      }
    } catch (error) {
      console.error('Failed to delete feeling:', error);
      setFeelingError(error.message || 'Failed to delete feeling.');
    }
  };

  // Auth checking loader screen
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
      {/* Admin Sidebar Navigation */}
      <AdminSidebar /> {/*[cite: 2] */}

      <main className="lg:ml-[255px] min-h-screen">
        {/* Top bar header */}
        <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">Catalog & Inventory</p>
            <h1 className="text-xl font-semibold mt-1">Feeling Management</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/feelings')}
              className="h-10 px-3.5 sm:px-4 rounded-xl bg-[#694f5c] text-white text-xs font-semibold flex items-center gap-1.5 sm:gap-2 hover:bg-[#5a4350] shadow-[2px_2px_8px_rgba(105,79,92,0.25)] transition shrink-0"
            >
              <Plus size={16} />
              <span>Add Feeling</span>
            </button>

            <button
              type="button"
              onClick={() => router.push('/admin/feelings')}
              className="h-10 px-3.5 sm:px-4 rounded-xl bg-[#faf7f8] text-[#6d5260] font-semibold text-xs border border-[#eee9ea] hover:bg-[#f2eaed] transition shrink-0"
            >
              ← Back to Feelings
            </button>
          </div>
        </header>

        {/* Content container */}
        <div className="p-5 sm:p-8">
          <section>
            <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)]">
              {/* Header title and search input */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold mt-1">All feelings</h2>
                  <p className="text-sm text-[#8a8385] mt-1">View, search, update and delete all feelings.</p>
                </div>

                <div className="relative w-full sm:w-[380px]">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a9295]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Feeling by name..."
                    className="w-full rounded-xl border border-[#e5e1e2] bg-[#faf9f9] pl-11 pr-10 py-2.5 text-sm outline-none focus:border-[#6d5260] transition"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9295] hover:text-[#403a3d]"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Error banner message */}
              {feelingError && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-600">{feelingError}</p>
                </div>
              )}

              {/* Feelings Table Container */}
              <div className="mt-6 overflow-x-auto rounded-xl border border-[#eee9ea]">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="bg-[#faf9f9] border-b border-[#eee9ea]">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">Image</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#8a8385]">Feeling</th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#8a8385]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Render loading rows */}
                    {loadingFeelings ? (
                      <tr>
                        <td colSpan="3" className="px-5 py-16 text-center">
                          <div className="w-8 h-8 border-4 border-[#e6e1e3] border-t-[#6d5260] rounded-full animate-spin mx-auto" />
                          <p className="text-sm text-[#8a8385] mt-3">Loading feelings...</p>
                        </td>
                      </tr>
                    ) : processedFeelings.length === 0 ? (
                      /* Render empty state */
                      <tr>
                        <td colSpan="3" className="px-5 py-16 text-center">
                          <div className="w-14 h-14 rounded-2xl bg-[#faf7f8] flex items-center justify-center mx-auto">
                            <span className="text-2xl">🌸</span>
                          </div>
                          <p className="font-semibold mt-4 text-[#403a3d]">No feelings found</p>
                          <p className="text-sm text-[#8a8385] mt-1">Add a feeling to see it here.</p>
                        </td>
                      </tr>
                    ) : (
                      /* Render feelings list */
                      processedFeelings.map((feeling) => (
                        <tr
                          key={feeling.id}
                          className={`border-b border-[#f1eeee] last:border-0 transition ${feeling.isMatched ? 'bg-[#fdf2f4] hover:bg-[#fae7eb]' : 'bg-white hover:bg-[#fcfbfb]'
                            }`}
                        >
                          <td className="px-5 py-5">
                            <div className="w-14 h-14 rounded-xl bg-[#eee4eb] flex items-center justify-center overflow-hidden border border-[#e5dce0]">
                              {feeling.feelingImage ? (
                                <img
                                  src={feeling.feelingImage}
                                  alt={feeling.feelingName || 'Feeling'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xl">🌸</span>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-[#403a3d]">{feeling.feelingName}</p>
                              {feeling.isMatched && (
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#694f5c] text-white">
                                  Match
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex justify-end gap-2">
                              {/* View detail button */}
                              <button
                                type="button"
                                onClick={() => setViewingFeeling(feeling)}
                                title="View"
                                className="w-10 h-10 rounded-xl bg-[#f4eff2] text-[#6d5260] flex items-center justify-center hover:bg-[#ebe2e7] transition"
                              >
                                <Eye size={17} />
                              </button>

                              {/* Edit details button */}
                              <button
                                type="button"
                                onClick={() => openEditModal(feeling)}
                                title="Edit"
                                className="w-10 h-10 rounded-xl bg-[#f4eff2] text-[#6d5260] flex items-center justify-center hover:bg-[#ebe2e7] transition"
                              >
                                <Pencil size={17} />
                              </button>

                              {/* Delete feeling button */}
                              <button
                                type="button"
                                onClick={() => handleDelete(feeling)}
                                title="Delete"
                                className="w-10 h-10 rounded-xl bg-[#fff0f2] text-[#c04b5a] flex items-center justify-center hover:bg-[#ffe2e6] transition"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total counter and match indicator */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-[#8a8385]">
                  Total <span className="font-semibold text-[#6d5260]">{feelings.length}</span>{' '}
                  {feelings.length === 1 ? 'Feeling' : 'feelings'}
                </p>

                {search.trim() && (
                  <p className="text-xs text-[#6d5260] font-medium">
                    {processedFeelings.filter((item) => item.isMatched).length} match(es) pinned to top
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Admin panel footer */}
          <footer className="py-8 text-center">
            <p className="text-xs text-[#9a9295]">© 2026 R Petals • Admin Panel</p>
          </footer>
        </div>
      </main>

      {/* View Feeling Modal */}
      {viewingFeeling && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setViewingFeeling(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-[8px_8px_30px_rgba(0,0,0,0.12)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-[#eee9ea] flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">Feeling Details</p>
                <h2 className="text-xl font-semibold mt-1">View Feeling</h2>
              </div>

              <button
                type="button"
                onClick={() => setViewingFeeling(null)}
                className="w-9 h-9 rounded-xl bg-[#faf7f8] text-[#777174] hover:bg-[#f1e9ec] transition flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="w-full h-[280px] rounded-xl bg-[#faf9f9] overflow-hidden flex items-center justify-center border border-[#eee9ea]">
                {viewingFeeling.feelingImage ? (
                  <img
                    src={viewingFeeling.feelingImage}
                    alt={viewingFeeling.feelingName || 'Feeling'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">🌸</span>
                )}
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.12em] text-[#9a9295]">Feeling Name</p>
                <h3 className="text-xl font-semibold text-[#403a3d] mt-1">{viewingFeeling.feelingName}</h3>
              </div>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-[0.12em] text-[#9a9295]">Status</p>
                <p className={`text-sm font-semibold mt-1 ${viewingFeeling.active ? 'text-green-600' : 'text-red-500'}`}>
                  {viewingFeeling.active ? 'Active' : 'Inactive'}
                </p>
              </div>

              <div className="mt-7 pt-5 border-t border-[#eee9ea] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setViewingFeeling(null);
                    openEditModal(viewingFeeling);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#6d5260] text-white text-sm font-semibold hover:bg-[#5d4650] transition flex items-center gap-2"
                >
                  <Pencil size={16} />
                  Edit Feeling
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Feeling Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-[8px_8px_30px_rgba(0,0,0,0.12)]">
            <div className="px-6 py-5 border-b border-[#eee9ea] flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">Feeling Management</p>
                <h2 className="text-xl font-semibold mt-1">Update Feeling</h2>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={isSaving}
                className="w-9 h-9 rounded-xl bg-[#faf7f8] text-[#777174] hover:bg-[#f1e9ec] transition flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image upload column */}
                <div>
                  <label className="text-sm font-semibold text-[#403a3d]">Feeling Image</label>
                  <div className="mt-3">
                    <div className="h-[230px] rounded-xl border border-dashed border-[#ddd5d7] bg-[#faf9f9] overflow-hidden flex items-center justify-center">
                      {previewImage ? (
                        <img src={previewImage} alt="Feeling Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <div className="text-4xl">🌸</div>
                          <p className="text-sm text-[#8a8385] mt-2">No image selected</p>
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
                      disabled={isSaving}
                      className="mt-3 w-full py-2.5 rounded-xl border border-[#ded9da] bg-[#faf7f8] text-sm font-semibold text-[#6d5260] hover:bg-[#f1e9ec] transition disabled:opacity-50"
                    >
                      Change Image
                    </button>

                    <p className="text-xs text-[#9a9295] mt-2">PNG, JPG or WEBP • Maximum 5 MB</p>

                    {errors.image && <p className="text-xs text-red-500 mt-2">{errors.image}</p>}
                  </div>
                </div>

                {/* Form fields column */}
                <div>
                  <label className="text-sm font-semibold text-[#403a3d]">Feeling Name</label>
                  <input
                    type="text"
                    name="feelingName"
                    value={formData.feelingName}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="e.g. Love"
                    className={`mt-2 w-full rounded-xl border bg-[#faf9f9] px-4 py-3 text-sm outline-none transition ${errors.feelingName ? 'border-red-400' : 'border-[#e5e1e2] focus:border-[#6d5260]'
                      }`}
                  />

                  {errors.feelingName && <p className="text-xs text-red-500 mt-1">{errors.feelingName}</p>}

                  {/* Active Toggle Switch */}
                  <div className="mt-6 flex items-center justify-between rounded-xl bg-[#faf9f9] p-4">
                    <div>
                      <p className="text-sm font-semibold text-[#403a3d]">Active</p>
                      <p className="text-xs text-[#8a8385] mt-1">Show this feeling to customers</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleActiveToggle}
                      disabled={isSaving}
                      className={`relative w-12 h-7 rounded-full transition ${formData.active ? 'bg-[#6d5260]' : 'bg-[#d8d2d4]'
                        }`}
                    >
                      <span
                        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition ${formData.active ? 'left-6' : 'left-1'
                          }`}
                      />
                    </button>
                  </div>

                  <div className="mt-5 rounded-xl bg-[#faf9f9] p-4">
                    <p className="text-sm font-semibold text-[#403a3d]">Update Information</p>
                    <p className="text-xs text-[#8a8385] mt-1 leading-5">
                      Update the feeling name, active status, or replace the current image.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Error Message */}
              {errors.submit && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Modal action buttons */}
              <div className="mt-7 pt-5 border-t border-[#eee9ea] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl border border-[#ded9da] text-sm font-semibold text-[#777174] hover:bg-[#faf7f8] transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#6d5260] text-white text-sm font-semibold hover:bg-[#5d4650] transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Pencil size={16} />
                      Update Feeling
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}