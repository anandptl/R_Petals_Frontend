'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
    ArrowLeft,
    Save,
    Loader2,
    Image as ImageIcon,
    Upload,
    X
} from 'lucide-react';

import AdminSidebar from '@/app/admin/components/AdminSidebar';

import {
    apiFetch,
    initializeAuthSession
} from '@/lib/auth';


export default function UpdateProductPage() {

    const router = useRouter();
    const params = useParams();

    const productId = params?.id;

    const API_URL =
        process.env.NEXT_PUBLIC_API_URL || '';


    // =========================================================
    // STATES
    // =========================================================

    const [loading, setLoading] =
        useState(true);

    const [checking, setChecking] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [imageUploading, setImageUploading] =
        useState(false);

    const [error, setError] =
        useState('');

    const [success, setSuccess] =
        useState('');

    const [product, setProduct] =
        useState(null);


    const [form, setForm] = useState({
        productName: '',
        description: '',
        price: '',
        active: true
    });


    // New selected images

    const [selectedImages, setSelectedImages] =
        useState([]);


    // Preview URLs

    const [previewUrls, setPreviewUrls] =
        useState([]);


    // =========================================================
    // AUTH + LOAD PRODUCT
    // =========================================================

    useEffect(() => {

        if (!productId) {
            return;
        }


        const init = async () => {

            try {

                await initializeAuthSession();

                const token =
                    localStorage.getItem(
                        'accessToken'
                    );

                const role =
                    localStorage.getItem(
                        'role'
                    );


                if (!token) {

                    router.replace(
                        `/login?redirect=/admin/products/update/${productId}`
                    );

                    return;
                }


                if (role !== 'ADMIN') {

                    router.replace('/');

                    return;
                }


                setChecking(false);

                await loadProduct();

            } catch (err) {

                console.error(
                    'AUTH ERROR:',
                    err
                );

                setError(
                    'Unable to initialize admin session.'
                );

                setChecking(false);
                setLoading(false);

            }

        };


        init();

    }, [productId]);


    // =========================================================
    // LOAD PRODUCT
    // =========================================================

    const loadProduct = async () => {

        try {

            setLoading(true);
            setError('');


            const response =
                await apiFetch(
                    `${API_URL}/admin/products/${productId}`,
                    {
                        method: 'GET'
                    }
                );


            if (response.status === 401) {

                router.replace(
                    `/login?redirect=/admin/products/update/${productId}`
                );

                return;
            }


            const result =
                await response.json();


            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    result.error ||
                    'Product not found'
                );

            }


            const data =
                result.data;


            setProduct(data);


            setForm({
                productName:
                    data.productName || '',

                description:
                    data.description || '',

                price:
                    data.price ?? '',

                active:
                    data.active ?? true
            });


        } catch (err) {

            console.error(
                'Load product error:',
                err
            );


            setError(
                err.message ||
                'Unable to load product'
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // FORM CHANGE
    // =========================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm(previous => ({
            ...previous,
            [name]: value
        }));


        setError('');
        setSuccess('');

    };


    // =========================================================
    // ACTIVE TOGGLE
    // =========================================================

    const toggleActive = () => {

        setForm(previous => ({
            ...previous,
            active: !previous.active
        }));


        setError('');
        setSuccess('');

    };


    // =========================================================
    // PRODUCT UPDATE
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');
        setSuccess('');


        if (!form.productName.trim()) {

            setError(
                'Product name is required.'
            );

            return;
        }


        if (!form.description.trim()) {

            setError(
                'Description is required.'
            );

            return;
        }


        if (
            form.price === '' ||
            Number(form.price) < 0
        ) {

            setError(
                'Please enter a valid price.'
            );

            return;
        }


        try {

            setSaving(true);


            const updateData = {

                productName:
                    form.productName.trim(),

                description:
                    form.description.trim(),

                price:
                    Number(form.price),

                active:
                    form.active

            };


            const response =
                await apiFetch(
                    `${API_URL}/admin/update/${productId}`,
                    {
                        method: 'PUT',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify(
                                updateData
                            )
                    }
                );


            if (response.status === 401) {

                router.replace(
                    `/login?redirect=/admin/products/update/${productId}`
                );

                return;
            }


            const result =
                await response.json();


            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    result.error ||
                    'Failed to update product'
                );

            }


            setProduct(result.data);

            setSuccess(
                'Product details updated successfully.'
            );


        } catch (err) {

            console.error(
                'Update product error:',
                err
            );


            setError(
                err.message ||
                'Unable to update product'
            );

        } finally {

            setSaving(false);

        }

    };


    // =========================================================
    // SELECT IMAGES
    // =========================================================

    const handleImageChange = (e) => {

        const files =
            Array.from(
                e.target.files || []
            );


        if (files.length === 0) {
            return;
        }


        if (files.length > 6) {

            setError(
                'Maximum 6 images are allowed.'
            );

            e.target.value = '';

            return;
        }


        // Check image type

        const invalidFile =
            files.find(
                file =>
                    !file.type.startsWith(
                        'image/'
                    )
            );


        if (invalidFile) {

            setError(
                'Only image files are allowed.'
            );

            e.target.value = '';

            return;
        }


        // Remove old preview URLs

        previewUrls.forEach(
            url =>
                URL.revokeObjectURL(url)
        );


        const urls =
            files.map(
                file =>
                    URL.createObjectURL(
                        file
                    )
            );


        setSelectedImages(files);

        setPreviewUrls(urls);

        setError('');
        setSuccess('');

    };


    // =========================================================
    // REMOVE SELECTED IMAGE
    // =========================================================

    const removeSelectedImage = (index) => {

        const newFiles =
            selectedImages.filter(
                (_, i) =>
                    i !== index
            );


        const newUrls =
            previewUrls.filter(
                (_, i) =>
                    i !== index
            );


        if (previewUrls[index]) {

            URL.revokeObjectURL(
                previewUrls[index]
            );

        }


        setSelectedImages(
            newFiles
        );

        setPreviewUrls(
            newUrls
        );

    };


    // =========================================================
    // CLEAR SELECTED IMAGES
    // =========================================================

    const clearSelectedImages = () => {

        previewUrls.forEach(
            url =>
                URL.revokeObjectURL(url)
        );


        setSelectedImages([]);

        setPreviewUrls([]);

    };


    // =========================================================
    // UPDATE IMAGES
    // =========================================================

    const handleImageUpdate = async () => {

        if (
            selectedImages.length === 0
        ) {

            setError(
                'Please select at least one image.'
            );

            return;
        }


        try {

            setImageUploading(true);

            setError('');
            setSuccess('');


            const formData =
                new FormData();


            selectedImages.forEach(
                file => {

                    formData.append(
                        'images',
                        file
                    );

                }
            );


            const response =
                await apiFetch(
                    `${API_URL}/admin/update/${productId}/images`,
                    {
                        method: 'PUT',

                        body: formData
                    }
                );


            if (response.status === 401) {

                router.replace(
                    `/login?redirect=/admin/products/update/${productId}`
                );

                return;
            }


            const result =
                await response.json();


            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    result.error ||
                    'Failed to update images'
                );

            }


            setProduct(
                result.data
            );


            clearSelectedImages();


            setSuccess(
                'Product images updated successfully.'
            );


        } catch (err) {

            console.error(
                'Image update error:',
                err
            );


            setError(
                err.message ||
                'Unable to update images'
            );

        } finally {

            setImageUploading(false);

        }

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (
        checking ||
        loading
    ) {

        return (

            <div
                className="
                    min-h-screen
                    bg-[#f7f7f5]
                    flex
                    items-center
                    justify-center
                "
            >

                <Loader2
                    size={38}
                    className="
                        animate-spin
                        text-[#694f5c]
                    "
                />

            </div>

        );

    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div
            className="
                min-h-screen
                bg-[#f7f7f5]
                text-[#292628]
            "
        >

            <AdminSidebar />


            <main
                className="
                    lg:ml-[255px]
                    min-h-screen
                "
            >

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <header
                    className="
                        h-[82px]
                        bg-white
                        border-b
                        border-[#e9e5e6]
                        px-5
                        sm:px-8
                        flex
                        items-center
                        justify-between
                        sticky
                        top-0
                        z-20
                    "
                >

                    <div>

                        <p
                            className="
                                text-xs
                                uppercase
                                tracking-[0.16em]
                                text-[#9a9295]
                            "
                        >
                            Catalog & Inventory
                        </p>


                        <h1
                            className="
                                text-xl
                                font-semibold
                                mt-1
                            "
                        >
                            Update Product
                        </h1>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                '/admin/products/all'
                            )
                        }
                        className="
                            h-10
                            px-4
                            rounded-xl
                            bg-[#faf7f8]
                            text-[#6d5260]
                            font-semibold
                            text-xs
                            border
                            border-[#eee9ea]
                            hover:bg-[#f2eaed]
                            transition
                        "
                    >

                        ← Back to Products

                    </button>

                </header>


                {/* =====================================================
                    CONTENT
                ===================================================== */}

                <div
                    className="
                        p-5
                        sm:p-8
                        max-w-[1100px]
                    "
                >

                    {/* TITLE */}

                    <div>

                        <p
                            className="
                                text-sm
                                text-[#8a8385]
                            "
                        >
                            Product Management
                        </p>


                        <h2
                            className="
                                text-3xl
                                font-bold
                                mt-1
                            "
                        >
                            Update Product
                        </h2>


                        <p
                            className="
                                text-sm
                                text-[#8a8385]
                                mt-2
                            "
                        >
                            Update product information,
                            images and status.
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div
                            className="
                                mt-6
                                rounded-xl
                                border
                                border-[#f0d8dc]
                                bg-[#fff5f6]
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                text-[#9b5360]
                            "
                        >

                            {error}

                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div
                            className="
                                mt-6
                                rounded-xl
                                border
                                border-[#d7eadf]
                                bg-[#f3faf5]
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                text-[#47745a]
                            "
                        >

                            {success}

                        </div>

                    )}


                    {/* =================================================
                        PRODUCT FORM
                    ================================================= */}

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="
                            mt-8
                            bg-white
                            rounded-2xl
                            p-6
                            sm:p-8
                            shadow-[4px_4px_14px_rgba(0,0,0,0.04),-4px_-4px_14px_rgba(255,255,255,0.8)]
                        "
                    >

                        {/* CATEGORY */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-5
                            "
                        >

                            <ReadOnlyField
                                label="Category"
                                value={
                                    product?.categoryName
                                }
                            />


                            <ReadOnlyField
                                label="SubCategory"
                                value={
                                    product?.subCategoryName
                                }
                            />

                        </div>


                        {/* PRODUCT + PRICE */}

                        <div
                            className="
                                mt-5
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-5
                            "
                        >

                            <InputField
                                label="Product Name"
                                name="productName"
                                value={
                                    form.productName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter product name"
                                disabled={
                                    saving ||
                                    imageUploading
                                }
                            />


                            <InputField
                                label="Price"
                                name="price"
                                type="number"
                                value={
                                    form.price
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter price"
                                disabled={
                                    saving ||
                                    imageUploading
                                }
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div
                            className="mt-5"
                        >

                            <label
                                className="
                                    block
                                    text-sm
                                    font-semibold
                                    mb-2
                                "
                            >
                                Description
                            </label>


                            <textarea
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={
                                    handleChange
                                }
                                rows={5}
                                disabled={
                                    saving ||
                                    imageUploading
                                }
                                placeholder="Enter product description"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[#e4dfe1]
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    resize-none
                                    focus:border-[#9b808c]
                                    focus:ring-2
                                    focus:ring-[#694f5c]/10
                                "
                            />

                        </div>


                        {/* STATUS */}

                        <div
                            className="
                                mt-6
                                rounded-xl
                                bg-[#faf8f9]
                                p-4
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                    "
                                >
                                    Product Status
                                </p>


                                <p
                                    className="
                                        text-xs
                                        text-[#8a8385]
                                        mt-1
                                    "
                                >
                                    Enable or disable this
                                    product.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    toggleActive
                                }
                                disabled={
                                    saving ||
                                    imageUploading
                                }
                                className={`
                                    relative
                                    w-12
                                    h-7
                                    rounded-full
                                    transition
                                    ${
                                        form.active
                                            ? 'bg-[#694f5c]'
                                            : 'bg-[#c7c0c3]'
                                    }
                                `}
                            >

                                <span
                                    className={`
                                        absolute
                                        top-1
                                        w-5
                                        h-5
                                        bg-white
                                        rounded-full
                                        transition-all
                                        ${
                                            form.active
                                                ? 'left-6'
                                                : 'left-1'
                                        }
                                    `}
                                />

                            </button>

                        </div>


                        {/* =================================================
                            PRODUCT IMAGES
                        ================================================= */}

                        <div
                            className="
                                mt-8
                                pt-7
                                border-t
                                border-[#eee9ea]
                            "
                        >

                            {/* IMAGE HEADER */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                    gap-4
                                "
                            >

                                <div>

                                    <h3
                                        className="
                                            text-lg
                                            font-semibold
                                        "
                                    >
                                        Product Images
                                    </h3>


                                    <p
                                        className="
                                            text-xs
                                            text-[#8a8385]
                                            mt-1
                                        "
                                    >
                                        Existing product images
                                    </p>

                                </div>


                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >

                                    <span
                                        className="
                                            text-xs
                                            font-semibold
                                            text-[#694f5c]
                                            bg-[#f4eff1]
                                            px-3
                                            py-1.5
                                            rounded-lg
                                        "
                                    >
                                        {
                                            product?.images?.length ||
                                            0
                                        } Images
                                    </span>


                                    {/* CHOOSE IMAGE */}

                                    <label
                                        className="
                                            cursor-pointer
                                            h-10
                                            px-4
                                            rounded-xl
                                            bg-[#694f5c]
                                            text-white
                                            text-xs
                                            font-semibold
                                            flex
                                            items-center
                                            gap-2
                                            hover:bg-[#5b4350]
                                            transition
                                        "
                                    >

                                        <Upload
                                            size={15}
                                        />

                                        Choose Images

                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={
                                                handleImageChange
                                            }
                                            disabled={
                                                imageUploading
                                            }
                                        />

                                    </label>

                                </div>

                            </div>


                            {/* EXISTING IMAGES */}

                            <div
                                className="
                                    mt-5
                                    grid
                                    grid-cols-2
                                    sm:grid-cols-3
                                    md:grid-cols-4
                                    gap-4
                                "
                            >

                                {product?.images?.length > 0 ? (

                                    product.images.map(
                                        (
                                            image,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    image.id ||
                                                    index
                                                }
                                                className="
                                                    relative
                                                    aspect-square
                                                    rounded-xl
                                                    overflow-hidden
                                                    border
                                                    border-[#e4dfe1]
                                                    bg-[#f5f2f3]
                                                "
                                            >

                                                <img
                                                    src={
                                                        image.imageUrl
                                                    }
                                                    alt={
                                                        product.productName
                                                    }
                                                    className="
                                                        w-full
                                                        h-full
                                                        object-cover
                                                    "
                                                />


                                                {image.primary && (

                                                    <span
                                                        className="
                                                            absolute
                                                            left-2
                                                            top-2
                                                            text-[10px]
                                                            font-semibold
                                                            bg-[#694f5c]
                                                            text-white
                                                            px-2
                                                            py-1
                                                            rounded-md
                                                        "
                                                    >
                                                        Primary
                                                    </span>

                                                )}

                                            </div>

                                        )
                                    )

                                ) : (

                                    <div
                                        className="
                                            col-span-full
                                            h-36
                                            rounded-xl
                                            bg-[#faf8f9]
                                            flex
                                            flex-col
                                            items-center
                                            justify-center
                                            text-[#aaa1a5]
                                        "
                                    >

                                        <ImageIcon
                                            size={30}
                                        />


                                        <p
                                            className="
                                                text-sm
                                                mt-2
                                            "
                                        >
                                            No images available
                                        </p>

                                    </div>

                                )}

                            </div>


                            {/* =================================================
                                NEW IMAGE PREVIEW
                            ================================================= */}

                            {selectedImages.length > 0 && (

                                <div
                                    className="
                                        mt-7
                                        rounded-2xl
                                        border
                                        border-[#e9e0e4]
                                        bg-[#fcfafb]
                                        p-5
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-3
                                        "
                                    >

                                        <div>

                                            <h4
                                                className="
                                                    text-sm
                                                    font-semibold
                                                "
                                            >
                                                New Images
                                            </h4>


                                            <p
                                                className="
                                                    text-xs
                                                    text-[#8a8385]
                                                    mt-1
                                                "
                                            >
                                                These images will
                                                replace the existing
                                                images.
                                            </p>

                                        </div>


                                        <button
                                            type="button"
                                            onClick={
                                                clearSelectedImages
                                            }
                                            disabled={
                                                imageUploading
                                            }
                                            className="
                                                text-xs
                                                font-semibold
                                                text-[#a0505d]
                                                flex
                                                items-center
                                                gap-1
                                            "
                                        >

                                            <X
                                                size={14}
                                            />

                                            Clear

                                        </button>

                                    </div>


                                    {/* PREVIEW GRID */}

                                    <div
                                        className="
                                            mt-5
                                            grid
                                            grid-cols-2
                                            sm:grid-cols-3
                                            md:grid-cols-4
                                            gap-4
                                        "
                                    >

                                        {selectedImages.map(
                                            (
                                                file,
                                                index
                                            ) => (

                                                <div
                                                    key={
                                                        `${file.name}-${index}`
                                                    }
                                                    className="
                                                        relative
                                                        aspect-square
                                                        rounded-xl
                                                        overflow-hidden
                                                        border-2
                                                        border-[#694f5c]
                                                        bg-[#f5f2f3]
                                                    "
                                                >

                                                    <img
                                                        src={
                                                            previewUrls[
                                                                index
                                                            ]
                                                        }
                                                        alt={
                                                            file.name
                                                        }
                                                        className="
                                                            w-full
                                                            h-full
                                                            object-cover
                                                        "
                                                    />


                                                    {/* REMOVE */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeSelectedImage(
                                                                index
                                                            )
                                                        }
                                                        disabled={
                                                            imageUploading
                                                        }
                                                        className="
                                                            absolute
                                                            right-2
                                                            top-2
                                                            w-7
                                                            h-7
                                                            rounded-full
                                                            bg-white
                                                            text-[#a0505d]
                                                            shadow
                                                            flex
                                                            items-center
                                                            justify-center
                                                        "
                                                    >

                                                        <X
                                                            size={14}
                                                        />

                                                    </button>


                                                    {index === 0 && (

                                                        <span
                                                            className="
                                                                absolute
                                                                left-2
                                                                bottom-2
                                                                text-[10px]
                                                                font-semibold
                                                                bg-[#694f5c]
                                                                text-white
                                                                px-2
                                                                py-1
                                                                rounded-md
                                                            "
                                                        >
                                                            Primary
                                                        </span>

                                                    )}

                                                </div>

                                            )
                                        )}

                                    </div>


                                    {/* UPDATE IMAGES */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleImageUpdate
                                        }
                                        disabled={
                                            imageUploading
                                        }
                                        className="
                                            mt-5
                                            h-11
                                            px-6
                                            rounded-xl
                                            bg-[#694f5c]
                                            text-white
                                            text-sm
                                            font-semibold
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            hover:bg-[#5b4350]
                                            transition
                                            disabled:opacity-60
                                        "
                                    >

                                        {imageUploading ? (

                                            <>
                                                <Loader2
                                                    size={17}
                                                    className="
                                                        animate-spin
                                                    "
                                                />

                                                Updating Images...
                                            </>

                                        ) : (

                                            <>
                                                <Upload
                                                    size={17}
                                                />

                                                Update Images
                                            </>

                                        )}

                                    </button>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            BOTTOM BUTTONS
                        ================================================= */}

                        <div
                            className="
                                mt-8
                                pt-6
                                border-t
                                border-[#eee9ea]
                                flex
                                justify-end
                                gap-3
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        '/admin/products/all'
                                    )
                                }
                                disabled={
                                    saving ||
                                    imageUploading
                                }
                                className="
                                    h-12
                                    px-6
                                    rounded-xl
                                    border
                                    border-[#ded7da]
                                    bg-white
                                    text-sm
                                    font-semibold
                                    text-[#694f5c]
                                    hover:bg-[#faf7f8]
                                    transition
                                    disabled:opacity-50
                                "
                            >

                                Cancel

                            </button>


                            <button
                                type="submit"
                                disabled={
                                    saving ||
                                    imageUploading
                                }
                                className="
                                    h-12
                                    px-7
                                    rounded-xl
                                    bg-[#694f5c]
                                    text-white
                                    text-sm
                                    font-semibold
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    hover:bg-[#5b4350]
                                    transition
                                    disabled:opacity-60
                                "
                            >

                                {saving ? (

                                    <>
                                        <Loader2
                                            size={17}
                                            className="
                                                animate-spin
                                            "
                                        />

                                        Updating...

                                    </>

                                ) : (

                                    <>
                                        <Save
                                            size={17}
                                        />

                                        Update Product

                                    </>

                                )}

                            </button>

                        </div>

                    </form>


                    {/* FOOTER */}

                    <footer
                        className="
                            py-8
                            text-center
                        "
                    >

                        <p
                            className="
                                text-xs
                                text-[#9a9295]
                            "
                        >
                            © 2026 R Petals • Admin Panel
                        </p>

                    </footer>

                </div>

            </main>

        </div>

    );

}


// =========================================================
// INPUT FIELD
// =========================================================

function InputField({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    disabled
}) {

    return (

        <div>

            <label
                className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                "
            >
                {label}
            </label>


            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className="
                    w-full
                    h-12
                    rounded-xl
                    border
                    border-[#e4dfe1]
                    bg-white
                    px-4
                    text-sm
                    outline-none
                    focus:border-[#9b808c]
                    focus:ring-2
                    focus:ring-[#694f5c]/10
                    disabled:bg-[#faf8f9]
                "
            />

        </div>

    );

}


// =========================================================
// READ ONLY FIELD
// =========================================================

function ReadOnlyField({
    label,
    value
}) {

    return (

        <div>

            <label
                className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                "
            >
                {label}
            </label>


            <div
                className="
                    w-full
                    h-12
                    rounded-xl
                    border
                    border-[#e8e3e5]
                    bg-[#faf8f9]
                    px-4
                    flex
                    items-center
                    text-sm
                    text-[#6f686b]
                "
            >

                {value || '-'}

            </div>

        </div>

    );

}