import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosInstance";
import {useNavigate, useParams} from "react-router-dom";
import DragDropUpload from "../../../components/ProductCreatePage/DragDropUpload";
import {BASE_URL} from "../../../api/apiConfig";
import {Input, Modal} from "antd";

const EditProductPage = () => {
    const { id } = useParams();



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
    
    const [isIngModalVisible, setIsIngModalVisible] = useState(false);
    const[newIngredient, setNewIngredient] = useState({
        name: "",
        imageFile : null
    });


    useEffect(() => {
        if (!id) return;

        axiosInstance.get(`/api/Products/id/${id}`)
            .then(res => {
                const current = res.data;
                const { productImages } = res.data;
                // console.log("current", current);
                // console.log("productImages", productImages);
                //setProductData({...productData, name : current.name,slug : current.slug, price:current.price , weight:current.weight , categoryId: current.category.id});
                
                
                
                const updatedFileList = productImages?.map((image) => ({
                    uid: image.id.toString(),
                    name: image.name,
                    url: `${BASE_URL}/images/800_${image.name}`,
                    originFileObj: new File([new Blob([''])],image.name,{type: 'old-image'})
                })) || [];

                setImages(updatedFileList);
                setProductData({
                    ...productData,
                    ...current,
                    categoryId: current.category.id,
                    productSizeId: current.productSize.id,
                    ingredientIds: current.ingredients.map(pi => pi.id)
                });

            })
            .catch(err => console.error("Error loading product", err));
    }, [id]);

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
    const showIngModal = () => {
        setIsIngModalVisible(true);
    };

    const handleIngModalOk = async () => {
        try {
            const res = await axiosInstance.post("/api/Products/ingredients", newIngredient, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            const newIng = res.data;
            setIngredients(prev => [...prev, newIng]);
            setIsIngModalVisible(false);
        } catch (error) {
            console.log("Помилка при створенні інгредієнта");
        }
    };

    const handleIngModalCancel = () => {
        setIsIngModalVisible(false);
        newIngredient.name = "";
        newIngredient.imageFile = null;
    };


    const handleEditProduct = async () => {
        try {
            //console.log("Images", images);
            productData.id=id;
            productData.imageFiles = images.map(x=>x.originFileObj);
            console.log("productData", productData);
            const res = await axiosInstance.put("/api/Products/edit", productData, {
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
            <h2 className="mb-4">Змінити продукту</h2>
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
                        {/*<ImageUploaderSortable images={images} setImages={setImages} />*/}
                        <DragDropUpload fileList={images} setFileList={setImages} />


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
                        <button className="btn btn-success" onClick={handleEditProduct}>
                            Оновити продукт
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
                    <div
                        onClick={() => showIngModal()}
                        style={{
                            cursor: "pointer",
                            userSelect: "none",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            border: "1px solid black",
                            backgroundColor: "gray",
                            marginRight: 8,
                            marginBottom: 8
                        }}
                    >+
                    </div>
                    {productData.ingredientIds.length === 0 && (
                        <span className="text-muted">Жодного інгредієнта не додано</span>
                    )}
                    
                </div>
            </div>
            <Modal
                title="Додати інгредієнт"
                open={isIngModalVisible}
                onOk={handleIngModalOk}
                onCancel={handleIngModalCancel}
                okText="Додати"
                cancelText="Скасувати"
            >
                <Input
                    placeholder="Назва інгредієнта"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                />

                <Input
                    type="file"
                    className={`form-control mt-4`}
                    onChange={(e) => setNewIngredient({...newIngredient, imageFile: e.target.files[0]})}
                    accept="image/*"

                />
            </Modal>
        </div>
    );
};

export default EditProductPage;