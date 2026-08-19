'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
    Store,
    MapPin,
    Building2,
    MapPinned,
    Loader2,
    CheckCircle2,
    LocateFixed,
    User,
    Phone,
    Mail,
    Globe,
    ArrowLeft,
    Navigation,
    Search,
    X
} from 'lucide-react';

import AdminSidebar from '@/app/admin/components/AdminSidebar';
import { apiFetch } from '@/lib/auth';

export default function RegisterStoresPage() {

    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [loading, setLoading] = useState(false);

    const [gpsLoading, setGpsLoading] = useState(false);

    const [addressLoading, setAddressLoading] =
        useState(false);

    const [pincodeLoading, setPincodeLoading] =
        useState(false);

    const [error, setError] = useState('');

    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({

        shopName: '',
        shopkeeperName: '',
        mobile: '',
        email: '',
        country: 'India',

        address: '',
        city: '',
        state: '',
        pincode: '',

        latitude: '',
        longitude: ''
    });


    // =========================================================
    // CLEAR ALERTS
    // =========================================================

    const clearAlerts = () => {

        setError('');
        setMessage('');
    };


    // =========================================================
    // UPDATE FORM
    // =========================================================

    const updateForm = (changes) => {

        setFormData((prev) => ({
            ...prev,
            ...changes
        }));
    };


    // =========================================================
    // HANDLE INPUT CHANGE
    // =========================================================

    const handleChange = async (e) => {

        const {
            name,
            value
        } = e.target;

        clearAlerts();


        // -----------------------------------------------------
        // MOBILE
        // -----------------------------------------------------

        if (name === 'mobile') {

            const digits = value
                .replace(/\D/g, '')
                .slice(0, 10);

            updateForm({
                mobile: digits
            });

            return;
        }


        // -----------------------------------------------------
        // PINCODE
        // -----------------------------------------------------

        if (name === 'pincode') {

            const digits = value
                .replace(/\D/g, '')
                .slice(0, 6);

            updateForm({

                pincode: digits,

                city: '',
                state: '',

                latitude: '',
                longitude: ''
            });


            if (digits.length === 6) {

                await fetchPincodeDetails(
                    digits
                );
            }

            return;
        }


        // -----------------------------------------------------
        // ADDRESS
        // -----------------------------------------------------

        if (name === 'address') {

            updateForm({

                address: value,

                // Address change hua hai,
                // isliye old coordinates invalid hain.

                latitude: '',
                longitude: ''
            });

            return;
        }


        // -----------------------------------------------------
        // NORMAL FIELD
        // -----------------------------------------------------

        updateForm({
            [name]: value
        });
    };


    // =========================================================
    // FETCH PINCODE DETAILS
    // =========================================================

    const fetchPincodeDetails = async (pincode) => {

        try {

            setPincodeLoading(true);

            setError('');
            setMessage('');


            const response = await fetch(
                `https://api.postalpincode.in/pincode/${pincode}`
            );


            if (!response.ok) {

                throw new Error(
                    'Unable to verify pincode.'
                );
            }


            const data =
                await response.json();


            if (
                data?.[0]?.Status !== 'Success' ||
                !data?.[0]?.PostOffice?.length
            ) {

                updateForm({

                    city: '',
                    state: '',

                    latitude: '',
                    longitude: ''
                });


                setError(
                    'Invalid pincode. Please enter a valid Indian pincode.'
                );

                return;
            }


            const postOffice =
                data[0].PostOffice[0];


            updateForm({

                city:
                    postOffice?.District || '',

                state:
                    postOffice?.State || '',

                latitude: '',
                longitude: ''
            });


            setMessage(
                `Pincode verified: ${postOffice?.District || ''
                }, ${postOffice?.State || ''
                }`
            );


        } catch (err) {

            console.error(
                'Pincode API error:',
                err
            );


            updateForm({

                city: '',
                state: '',

                latitude: '',
                longitude: ''
            });


            setError(
                err?.message ||
                'Unable to fetch city and state from pincode.'
            );


        } finally {

            setPincodeLoading(false);
        }
    };

    // FIND LOCATION BY ADDRESS

    const getAddressLocation = async () => {

        clearAlerts();

        if (!formData.address.trim()) {
            setError('Please enter shop address.');
            return;
        }

        if (!formData.city.trim()) {
            setError('Please enter city.');
            return;
        }

        if (!formData.state.trim()) {
            setError('Please enter state.');
            return;
        }

        if (!/^\d{6}$/.test(formData.pincode)) {
            setError('Please enter a valid 6 digit pincode.');
            return;
        }

        setAddressLoading(true);

        try {

            const address = formData.address.trim();
            const city = formData.city.trim();
            const state = formData.state.trim();
            const pincode = formData.pincode.trim();

            /*
             * Multiple search queries.
             *
             * Agar pehla exact address fail ho,
             * to next simpler query try hogi.
             */

            const queries = [

                // 1. Full address
                `${address}, ${city}, ${state}, ${pincode}, India`,

                // 2. Address + city + pincode
                `${address}, ${city}, ${pincode}, India`,

                // 3. Address + city + state
                `${address}, ${city}, ${state}, India`,

                // 4. Address + city
                `${address}, ${city}, India`,

                // 5. City + pincode
                `${city}, ${pincode}, India`

            ];


            let foundLocation = null;


            for (const query of queries) {

                console.log(
                    'Nominatim searching:',
                    query
                );


                const url =
                    'https://nominatim.openstreetmap.org/search?' +
                    new URLSearchParams({

                        format: 'jsonv2',

                        q: query,

                        limit: '1',

                        countrycodes: 'in',

                        addressdetails: '1',

                        'accept-language': 'en'

                    }).toString();


                const response = await fetch(
                    url,
                    {
                        method: 'GET',

                        headers: {
                            Accept:
                                'application/json'
                        }
                    }
                );


                if (!response.ok) {
                    continue;
                }


                const results =
                    await response.json();


                if (
                    Array.isArray(results) &&
                    results.length > 0
                ) {

                    foundLocation =
                        results[0];

                    console.log(
                        'Nominatim result:',
                        foundLocation
                    );

                    break;
                }


                /*
                 * Public Nominatim service ke against
                 * rapid multiple requests mat bhejna.
                 */

                await new Promise(
                    resolve =>
                        setTimeout(resolve, 1100)
                );
            }


            if (!foundLocation) {

                setError(
                    'Location could not be found. Please add a nearby landmark or road name.'
                );

                return;
            }


            const latitude =
                foundLocation.lat;

            const longitude =
                foundLocation.lon;


            if (!latitude || !longitude) {

                setError(
                    'Location coordinates were not found.'
                );

                return;
            }


            updateForm({

                latitude:
                    String(latitude),

                longitude:
                    String(longitude)
            });


            setMessage(
                `Location found successfully: ${Number(latitude).toFixed(6)
                }, ${Number(longitude).toFixed(6)
                }`
            );


        } catch (err) {

            console.error(
                'Nominatim error:',
                err
            );

            setError(
                'Unable to find location from address. Please try Current GPS.'
            );

        } finally {

            setAddressLoading(false);
        }
    };


    // =========================================================
    // GET CURRENT GPS LOCATION
    // =========================================================

    const getCurrentLocation = () => {

        clearAlerts();


        if (!navigator.geolocation) {

            setError(
                'Your browser does not support location detection.'
            );

            return;
        }


        setGpsLoading(true);


        navigator.geolocation.getCurrentPosition(

            (position) => {

                const {
                    latitude,
                    longitude
                } = position.coords;


                updateForm({

                    latitude:
                        String(latitude),

                    longitude:
                        String(longitude)
                });


                setMessage(
                    `Current GPS location detected: ${latitude.toFixed(6)
                    }, ${longitude.toFixed(6)
                    }`
                );


                setGpsLoading(false);
            },


            (geoError) => {

                console.error(
                    'GPS error:',
                    geoError
                );


                let errorMessage =
                    'Unable to get your current location.';


                if (
                    geoError.code === 1
                ) {

                    errorMessage =
                        'Location permission denied. Please allow location access in your browser.';
                }


                if (
                    geoError.code === 2
                ) {

                    errorMessage =
                        'Current location is unavailable. Please try again.';
                }


                if (
                    geoError.code === 3
                ) {

                    errorMessage =
                        'Location request timed out. Please try again.';
                }


                setError(
                    errorMessage
                );


                setGpsLoading(false);
            },


            {

                enableHighAccuracy: true,

                timeout: 15000,

                maximumAge: 0
            }
        );
    };


    // =========================================================
    // CLEAR LOCATION
    // =========================================================

    const clearLocation = () => {

        updateForm({

            latitude: '',
            longitude: ''
        });


        setError('');

        setMessage(
            'Shop location cleared. Please select the location again.'
        );
    };


    // =========================================================
    // REGISTER STORE
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        clearAlerts();


        // -----------------------------------------------------
        // SHOP NAME
        // -----------------------------------------------------

        if (!formData.shopName.trim()) {

            setError(
                'Please enter shop name.'
            );

            return;
        }


        // -----------------------------------------------------
        // SHOPKEEPER NAME
        // -----------------------------------------------------

        if (
            !formData.shopkeeperName.trim()
        ) {

            setError(
                'Please enter shopkeeper name.'
            );

            return;
        }


        // -----------------------------------------------------
        // MOBILE
        // -----------------------------------------------------

        if (
            !/^\d{10}$/.test(
                formData.mobile
            )
        ) {

            setError(
                'Please enter a valid 10 digit mobile number.'
            );

            return;
        }


        // -----------------------------------------------------
        // EMAIL
        // -----------------------------------------------------

        if (
            formData.email.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email.trim()
            )
        ) {

            setError(
                'Please enter a valid email address.'
            );

            return;
        }


        // -----------------------------------------------------
        // COUNTRY
        // -----------------------------------------------------

        if (
            !formData.country.trim()
        ) {

            setError(
                'Please select country.'
            );

            return;
        }


        // -----------------------------------------------------
        // ADDRESS
        // -----------------------------------------------------

        if (
            !formData.address.trim()
        ) {

            setError(
                'Please enter shop address.'
            );

            return;
        }


        // -----------------------------------------------------
        // CITY
        // -----------------------------------------------------

        if (
            !formData.city.trim()
        ) {

            setError(
                'Please enter city.'
            );

            return;
        }


        // -----------------------------------------------------
        // STATE
        // -----------------------------------------------------

        if (
            !formData.state.trim()
        ) {

            setError(
                'Please enter state.'
            );

            return;
        }


        // -----------------------------------------------------
        // PINCODE
        // -----------------------------------------------------

        if (
            !/^\d{6}$/.test(
                formData.pincode
            )
        ) {

            setError(
                'Please enter a valid 6 digit pincode.'
            );

            return;
        }


        // -----------------------------------------------------
        // LATITUDE / LONGITUDE
        // -----------------------------------------------------

        if (
            !formData.latitude ||
            !formData.longitude
        ) {

            setError(
                'Please use "Find by Address" or "Use Current GPS" before registering.'
            );

            return;
        }


        // -----------------------------------------------------
        // API URL
        // -----------------------------------------------------

        if (!API_URL) {

            setError(
                'API URL is not configured. Please check NEXT_PUBLIC_API_URL.'
            );

            return;
        }


        try {

            setLoading(true);


            // -------------------------------------------------
            // BACKEND REQUEST
            // -------------------------------------------------

            const response =
                await apiFetch(
                    `${API_URL}/admin/register`,
                    {

                        method: 'POST',

                        headers: {

                            'Content-Type':
                                'application/json',

                            Accept:
                                'application/json'
                        },

                        body:
                            JSON.stringify(
                                formData
                            )
                    }
                );


            let result = {};


            try {

                result =
                    await response.json();

            } catch {

                result = {};
            }


            // -------------------------------------------------
            // RESPONSE ERROR
            // -------------------------------------------------

            if (
                !response.ok ||
                !result?.success
            ) {

                throw new Error(

                    result?.message ||

                    result?.error ||

                    'Store registration failed.'
                );
            }


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            setMessage(
                'Store and shopkeeper registered successfully.'
            );


            // -------------------------------------------------
            // RESET FORM
            // -------------------------------------------------

            setFormData({

                shopName: '',
                shopkeeperName: '',
                mobile: '',
                email: '',

                country: 'India',

                address: '',
                city: '',
                state: '',
                pincode: '',

                latitude: '',
                longitude: ''
            });


        } catch (err) {

            console.error(
                'Store registration error:',
                err
            );


            setError(
                err?.message ||
                'Something went wrong while registering the store.'
            );


        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen bg-[#f7f7f5] text-[#292628]">

            <AdminSidebar />

            <main className="lg:ml-[255px] min-h-screen">

                <header className="h-[82px] bg-white border-b border-[#e9e5e6] px-5 sm:px-8 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[#9a9295]">Store Management</p>
                        <h1 className="text-xl font-semibold mt-1">Register Store</h1>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 rounded-xl bg-[#faf7f8] text-[#6d5260] font-semibold text-xs border border-[#eee9ea] hover:bg-[#f2eaed] transition"
                    >
                        ← Back to Stores
                    </button>
                </header>

                <div className="p-5 sm:p-8">


                    {/* PAGE TITLE */}

                    <div className="mb-8">

                        <p className="text-sm text-[#8a8385]">
                            Store Management
                        </p>

                        <h2 className="text-3xl font-bold mt-1">
                            Register Store
                        </h2>

                        <p className="mt-2 text-sm text-[#8a8385] max-w-2xl">
                            Add store and shopkeeper details with the exact shop location.
                        </p>

                    </div>


                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)] overflow-hidden"
                    >


                        <div className="p-6 sm:p-8 space-y-8">


                            {/* SHOPKEEPER*/}

                            <section>

                                <SectionHeader
                                    icon="👤"
                                    title="Shopkeeper Information"
                                    subtitle="Owner or shopkeeper contact details"
                                />


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                                    <InputField
                                        icon={
                                            <User size={17} />
                                        }
                                        label="Shopkeeper Name"
                                        name="shopkeeperName"
                                        value={
                                            formData.shopkeeperName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter shopkeeper name"
                                        required
                                        disabled={
                                            loading
                                        }
                                    />


                                    <InputField
                                        icon={
                                            <Phone size={17} />
                                        }
                                        label="Mobile Number"
                                        name="mobile"
                                        type="tel"
                                        value={
                                            formData.mobile
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter 10 digit mobile number"
                                        required
                                        disabled={
                                            loading
                                        }
                                    />


                                    <InputField
                                        icon={
                                            <Mail size={17} />
                                        }
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter email address"
                                        disabled={
                                            loading
                                        }
                                    />

                                </div>

                            </section>


                            {/* =================================================
                                STORE INFORMATION
                            ================================================= */}

                            <section className="border-t border-[#f0eded] pt-8">

                                <SectionHeader
                                    icon="🏪"
                                    title="Store Information"
                                    subtitle="Basic store details"
                                />


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                                    <InputField
                                        icon={
                                            <Store size={17} />
                                        }
                                        label="Shop Name"
                                        name="shopName"
                                        value={
                                            formData.shopName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter shop name"
                                        required
                                        disabled={
                                            loading
                                        }
                                    />


                                    {/* COUNTRY */}

                                    <div>

                                        <label className="block text-sm font-semibold text-[#514b4e] mb-2">

                                            Country

                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>

                                        </label>


                                        <div className="relative">

                                            <Globe
                                                size={17}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#91898c] pointer-events-none"
                                            />


                                            <select
                                                name="country"
                                                value={
                                                    formData.country
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    loading
                                                }
                                                className="w-full h-11 rounded-xl border border-[#e4dfe1] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#9b7c8a] focus:ring-2 focus:ring-[#eee5e9]"
                                            >

                                                <option value="India">
                                                    🇮🇳 India
                                                </option>

                                                <option value="United States">
                                                    🇺🇸 United States
                                                </option>

                                                <option value="United Kingdom">
                                                    🇬🇧 United Kingdom
                                                </option>

                                                <option value="Canada">
                                                    🇨🇦 Canada
                                                </option>

                                                <option value="Australia">
                                                    🇦🇺 Australia
                                                </option>

                                                <option value="Other">
                                                    Other
                                                </option>

                                            </select>

                                        </div>

                                    </div>

                                </div>

                            </section>


                            {/* =================================================
                                ADDRESS
                            ================================================= */}

                            <section className="border-t border-[#f0eded] pt-8">

                                <SectionHeader
                                    icon="📍"
                                    title="Store Address"
                                    subtitle="Enter store address and select the shop location"
                                />


                                <div className="space-y-6">


                                    {/* ADDRESS */}

                                    <div>

                                        <label className="block text-sm font-semibold text-[#514b4e] mb-2">

                                            Shop Address

                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>

                                        </label>


                                        <textarea
                                            name="address"
                                            value={
                                                formData.address
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="House / Shop No., Street, Area, Landmark"
                                            rows={3}
                                            disabled={
                                                loading
                                            }
                                            className="w-full rounded-xl border border-[#e4dfe1] bg-white px-4 py-3 text-sm outline-none resize-none focus:border-[#9b7c8a] focus:ring-2 focus:ring-[#eee5e9]"
                                        />

                                    </div>


                                    {/* PINCODE CITY STATE */}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                                        <InputField
                                            icon={
                                                <MapPinned size={17} />
                                            }
                                            label="Pincode"
                                            name="pincode"
                                            value={
                                                formData.pincode
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="6 digit pincode"
                                            required
                                            disabled={
                                                loading
                                            }
                                        />


                                        <InputField
                                            icon={
                                                <Building2 size={17} />
                                            }
                                            label="City"
                                            name="city"
                                            value={
                                                formData.city
                                            }
                                            placeholder="Auto filled"
                                            required
                                            readOnly
                                            disabled={
                                                loading
                                            }
                                        />


                                        <InputField
                                            icon={
                                                <Building2 size={17} />
                                            }
                                            label="State"
                                            name="state"
                                            value={
                                                formData.state
                                            }
                                            placeholder="Auto filled"
                                            required
                                            readOnly
                                            disabled={
                                                loading
                                            }
                                        />

                                    </div>


                                    {/* PINCODE LOADING */}

                                    {pincodeLoading && (

                                        <div className="flex items-center gap-2 text-sm text-[#77636d]">

                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />

                                            Finding city and state...

                                        </div>

                                    )}


                                    {/* =================================================
                                        LOCATION CARD
                                    ================================================= */}

                                    <div className="rounded-2xl border border-[#e8e1e3] bg-[#faf8f9] p-5">


                                        {/* HEADER */}

                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">


                                            <div className="flex items-center gap-3">

                                                <div className="w-11 h-11 rounded-xl bg-[#eee4e8] text-[#694f5c] flex items-center justify-center">🧭</div>


                                                <div>

                                                    <h4 className="font-semibold text-sm">
                                                        Shop Location
                                                    </h4>

                                                    <p className="text-xs text-[#8a8385] mt-1">
                                                        Choose location using address or current GPS
                                                    </p>

                                                </div>

                                            </div>


                                            {/* BUTTONS */}

                                            <div className="flex flex-col sm:flex-row gap-3">


                                                {/* FIND BY ADDRESS */}

                                                <button
                                                    type="button"
                                                    onClick={
                                                        getAddressLocation
                                                    }
                                                    disabled={
                                                        addressLoading ||
                                                        gpsLoading ||
                                                        loading
                                                    }
                                                    className="h-11 px-5 rounded-xl border border-[#694f5c] bg-white text-[#694f5c] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#f7f1f3] transition disabled:opacity-60 disabled:cursor-not-allowed"
                                                >

                                                    {addressLoading ? (

                                                        <>
                                                            <Loader2
                                                                size={17}
                                                                className="animate-spin"
                                                            />

                                                            Finding...

                                                        </>

                                                    ) : (

                                                        <>
                                                            <Search
                                                                size={17}
                                                            />

                                                            Find by Address
                                                        </>

                                                    )}

                                                </button>


                                                {/* CURRENT GPS */}

                                                <button
                                                    type="button"
                                                    onClick={
                                                        getCurrentLocation
                                                    }
                                                    disabled={
                                                        gpsLoading ||
                                                        addressLoading ||
                                                        loading
                                                    }
                                                    className="h-11 px-5 rounded-xl bg-[#694f5c] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#5c4450] transition disabled:opacity-60 disabled:cursor-not-allowed"
                                                >

                                                    {gpsLoading ? (

                                                        <>
                                                            <Loader2
                                                                size={17}
                                                                className="animate-spin"
                                                            />

                                                            Detecting...

                                                        </>

                                                    ) : (

                                                        <>
                                                            <LocateFixed
                                                                size={17}
                                                            />

                                                            Use Current GPS
                                                        </>

                                                    )}

                                                </button>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            LOCATION RESULT
                                        ================================================= */}

                                        {formData.latitude &&
                                            formData.longitude ? (

                                            <div className="mt-5">


                                                {/* SUCCESS */}

                                                <div className="flex items-center justify-between gap-3 rounded-xl border border-[#cfe3d6] bg-[#f0f8f3] px-4 py-3">

                                                    <div className="flex items-center gap-3">

                                                        <div className="w-9 h-9 rounded-full bg-[#dcefe3] flex items-center justify-center">

                                                            <CheckCircle2
                                                                size={19}
                                                                className="text-[#4f725f]"
                                                            />

                                                        </div>


                                                        <div>

                                                            <p className="text-sm font-semibold text-[#4f725f]">
                                                                Location Selected
                                                            </p>

                                                            <p className="text-xs text-[#5d7668] mt-1">
                                                                Latitude and longitude are ready.
                                                            </p>

                                                        </div>

                                                    </div>


                                                    {/* CLEAR */}

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            clearLocation
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                        className="w-9 h-9 rounded-lg flex items-center justify-center text-[#806e75] hover:bg-white transition"
                                                        title="Clear location"
                                                    >

                                                        <X
                                                            size={17}
                                                        />

                                                    </button>

                                                </div>


                                                {/* COORDINATES */}

                                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">


                                                    {/* LATITUDE */}

                                                    <div className="rounded-xl bg-white border border-[#e4dfe1] p-4">

                                                        <div className="flex items-center gap-2">

                                                            <MapPin
                                                                size={16}
                                                                className="text-[#694f5c]"
                                                            />

                                                            <span className="text-xs text-[#8a8385]">
                                                                Latitude
                                                            </span>

                                                        </div>


                                                        <p className="mt-2 text-sm font-semibold text-[#514b4e] break-all">
                                                            {Number(
                                                                formData.latitude
                                                            ).toFixed(6)}
                                                        </p>

                                                    </div>


                                                    {/* LONGITUDE */}

                                                    <div className="rounded-xl bg-white border border-[#e4dfe1] p-4">

                                                        <div className="flex items-center gap-2">

                                                            <MapPin
                                                                size={16}
                                                                className="text-[#694f5c]"
                                                            />

                                                            <span className="text-xs text-[#8a8385]">
                                                                Longitude
                                                            </span>

                                                        </div>


                                                        <p className="mt-2 text-sm font-semibold text-[#514b4e] break-all">
                                                            {Number(
                                                                formData.longitude
                                                            ).toFixed(6)}
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        ) : (

                                            /* NO LOCATION */

                                            <div className="mt-5 rounded-xl border border-dashed border-[#d9cdd1] bg-white px-5 py-5">

                                                <div className="flex items-start gap-3">

                                                    <div className="w-9 h-9 rounded-lg bg-[#f2eaed] flex items-center justify-center shrink-0">

                                                        <LocateFixed
                                                            size={18}
                                                            className="text-[#806e75]"
                                                        />

                                                    </div>


                                                    <div>

                                                        <p className="text-sm font-semibold text-[#5d5357]">
                                                            Location not selected
                                                        </p>

                                                        <p className="text-xs text-[#8a8385] mt-1 leading-5">
                                                            Fill the complete address and click
                                                            <b> Find by Address </b>
                                                            or use
                                                            <b> Current GPS </b>
                                                            to select the shop location.
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        )}


                                        {/* =================================================
                                            OSM ATTRIBUTION
                                        ================================================= */}

                                        <p className="mt-4 text-[11px] text-[#8a8385] text-right">

                                            Location search powered by
                                            {' '}

                                            <a
                                                href="https://www.openstreetmap.org/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline hover:text-[#694f5c]"
                                            >
                                                OpenStreetMap
                                            </a>

                                            {' '}
                                            contributors.

                                        </p>

                                    </div>


                                    {/* =================================================
                                        ERROR
                                    ================================================= */}

                                    {error && (

                                        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold">
                                                !
                                            </div>


                                            <div>

                                                <p className="text-sm font-semibold text-red-700">
                                                    Registration Error
                                                </p>

                                                <p className="mt-1 text-sm text-red-600">
                                                    {error}
                                                </p>

                                            </div>

                                        </div>

                                    )}


                                    {/* =================================================
                                        SUCCESS
                                    ================================================= */}

                                    {message && (

                                        <div className="flex items-start gap-3 rounded-xl border border-[#d9e9df] bg-[#f0f8f3] px-4 py-3">

                                            <CheckCircle2
                                                size={19}
                                                className="mt-0.5 shrink-0 text-[#4f725f]"
                                            />


                                            <div>

                                                <p className="text-sm font-semibold text-[#4f725f]">
                                                    Location Ready
                                                </p>

                                                <p className="mt-1 text-sm text-[#5d7668]">
                                                    {message}
                                                </p>

                                            </div>

                                        </div>

                                    )}

                                </div>

                            </section>

                        </div>


                        {/* =================================================
                            SUBMIT FOOTER
                        ================================================= */}

                        <div className="px-6 py-5 sm:px-8 border-t border-[#f0eded] bg-[#fcfbfb] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">


                            {/* STATUS */}

                            <div className="text-xs text-[#8a8385]">

                                {!formData.latitude ||
                                    !formData.longitude ? (

                                    <div className="flex items-center gap-2">

                                        <LocateFixed
                                            size={15}
                                        />

                                        Location required before registration

                                    </div>

                                ) : (

                                    <div className="flex items-center gap-2 text-[#5d7668]">

                                        <CheckCircle2
                                            size={15}
                                        />

                                        Shop location ready

                                    </div>

                                )}

                            </div>


                            {/* REGISTER */}

                            <button
                                type="submit"

                                disabled={
                                    loading ||
                                    gpsLoading ||
                                    addressLoading ||
                                    !formData.latitude ||
                                    !formData.longitude
                                }

                                className="h-12 px-8 rounded-xl bg-[#694f5c] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#5c4450] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >

                                {loading && (

                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                )}


                                {loading
                                    ? 'Registering...'
                                    : 'Register Store'}

                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}


/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
    icon,
    title,
    subtitle
}) {

    return (

        <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-xl bg-[#f2eaed] text-[#694f5c] flex items-center justify-center">

                {icon}

            </div>


            <div>

                <h3 className="font-semibold">
                    {title}
                </h3>

                <p className="text-xs text-[#8a8385] mt-1">
                    {subtitle}
                </p>

            </div>

        </div>
    );
}


/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
    icon,
    label,
    name,
    value,
    onChange,
    placeholder,
    type = 'text',
    required = false,
    readOnly = false,
    disabled = false
}) {

    return (

        <div>

            <label className="block text-sm font-semibold text-[#514b4e] mb-2">

                {label}

                {required && (

                    <span className="text-red-500 ml-1">
                        *
                    </span>

                )}

            </label>


            <div className="relative">

                {icon && (

                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#91898c] pointer-events-none">

                        {icon}

                    </div>

                )}


                <input

                    type={type}

                    name={name}

                    value={value}

                    onChange={onChange}

                    placeholder={placeholder}

                    readOnly={readOnly}

                    disabled={disabled}

                    required={required}

                    className={`

                        w-full h-11 rounded-xl

                        border border-[#e4dfe1]

                        ${icon
                            ? 'pl-11'
                            : 'px-4'
                        }

                        pr-4

                        text-sm

                        outline-none

                        transition

                        ${readOnly
                            ? 'bg-[#faf9f9] text-[#81797c]'
                            : 'bg-white focus:border-[#9b7c8a] focus:ring-2 focus:ring-[#eee5e9]'
                        }

                        disabled:bg-[#f7f6f6]
                        disabled:text-[#aaa3a5]
                        disabled:cursor-not-allowed

                    `}
                />

            </div>

        </div>
    );
}