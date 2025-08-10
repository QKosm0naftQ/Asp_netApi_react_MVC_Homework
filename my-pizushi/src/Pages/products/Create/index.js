import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosInstance";
import ImageUploaderSortable from "../../../components/ProductCreatePage/ImageUploaderSortable";
import {useNavigate} from "react-router-dom";

const CreateProductPage = () => {
    const [productData, setProductData] = useState({
        name: "",
        slug: "",
        price: "",
        weight: "",
        productSizeId: "",
        categoryId: "",
        ingredientIds: [],

    });
    const [images, setImages] = useState([]);

    const [sizes, setSizes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sizesRes, categoriesRes, ingredientsRes] = await Promise.all([
                    axiosInstance.get("/api/Products/sizes"),
                    axiosInstance.get("/api/Categories"),
                    axiosInstance.get("/api/Products/ingredients"),
                ]);

                console.log("Categories", categoriesRes.data);
                setSizes(Array.isArray(sizesRes.data) ? sizesRes.data : []);
                setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
                setIngredients(Array.isArray(ingredientsRes.data) ? ingredientsRes.data : []);
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        fetchData();
    }, []);

    const handleIngredientToggle = (id) => {
        setProductData(prev => {
            const has = prev.ingredientIds.includes(id);
            let newIds;
            if (has) {
                newIds = prev.ingredientIds.filter(x => x !== id);
            } else {
                newIds = [...prev.ingredientIds, id];
            }
            return { ...prev, ingredientIds: newIds };
        });
    };

    const handleCreateProduct = async () => {
        try {
            productData.imageFiles = images;
            console.log("Send Data server", productData);
            console.log("Send Data server", images);

            const res = await axiosInstance.post("/api/Products/create", productData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            navigate("..");
            console.log("Продукт:", res.data);

        } catch (err) {
            setErrorMessage(err);
            console.error(err);
        }
    };

    return (

        <div className="container mt-5">
            <h2 className="mb-4">Створення продукту</h2>
            <div className="row">

                {errorMessage && (
                    <div className="error">
                        {typeof errorMessage === 'string'
                            ? errorMessage
                            :
                            JSON.stringify(errorMessage)}
                    </div>
                )}


                <div className="col-md-6 mb-4">
                    <div className="border rounded p-3 h-100">
                        <ImageUploaderSortable images={images} setImages={setImages} />
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="border rounded p-3 h-100">
                        <div className="mb-3">
                            <label className="form-label">Назва</label>
                            <input
                                type="text"
                                className="form-control"
                                value={productData.name}
                                onChange={e => setProductData({ ...productData, name: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Слаг (латинськими)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={productData.slug}
                                onChange={e => setProductData({ ...productData, slug: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Вага (г)</label>
                            <input
                                type="number"
                                className="form-control"
                                value={productData.weight}
                                onChange={e => setProductData({ ...productData, weight: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Ціна (грн)</label>
                            <input
                                type="number"
                                className="form-control"
                                value={productData.price}
                                onChange={e => setProductData({ ...productData, price: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Розмір</label>
                            <select
                                className="form-select"
                                value={productData.productSizeId}
                                onChange={e => setProductData({ ...productData, productSizeId: e.target.value })}
                            >
                                <option value="">Оберіть розмір</option>
                                {sizes.map(size => (
                                    <option key={size.id} value={size.id}>
                                        {size.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Категорія</label>
                            <select
                                className="form-select"
                                value={productData.categoryId}
                                onChange={e => setProductData({ ...productData, categoryId: e.target.value })}
                            >
                                <option value="">Оберіть категорію</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="btn btn-success" onClick={handleCreateProduct}>
                            Додати продукт
                        </button>
                    </div>
                </div>
            </div>

            <div className="border rounded p-3 mb-4">
                <h5>Інгредієнти</h5>
                <div className="d-flex flex-wrap gap-3 mb-3">
                    {ingredients.length === 0 && <span>Завантаження інгредієнтів...</span>}
                    {ingredients.length > 0 && ingredients.map(ing => (
                        <div
                            key={ing.id}
                            onClick={() => handleIngredientToggle(ing.id)}
                            style={{
                                cursor: "pointer",
                                userSelect: "none",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                border: productData.ingredientIds.includes(ing.id) ? "2px solid green" : "1px solid #ccc",
                                backgroundColor: productData.ingredientIds.includes(ing.id) ? "#d4f5d4" : "#f9f9f9",
                                marginRight: 8,
                                marginBottom: 8,
                            }}
                        >
                            {ing.name}
                        </div>
                    ))}
                    {productData.ingredientIds.length === 0 && (
                        <span className="text-muted">Жодного інгредієнта не додано</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateProductPage;