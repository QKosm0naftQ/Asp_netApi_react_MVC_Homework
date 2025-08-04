import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axiosInstance from "../../../api/axiosInstance";
import { BASE_URL } from "../../../api/apiConfig";

import { Category } from "../../../models/Category";

import BaseTextInput from "../../../components/Common/BaseTextInput";
import BaseFileInput from "../../../components/Common/BaseFileInput";

const CategoriesEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axiosInstance.get(`/api/Categories/${id}`);
                const categoryData = Category.fromJson(response.data);
                setCategory(categoryData);
            } catch (error) {
                console.error("Помилка завантаження категорії:", error);
            }
        };

        fetchCategory();
    }, [id]);
    
    if (!category) {
        return <div>Завантаження...</div>;
    }

    const onHandleChange = (e) => {
        setCategory(new Category(
            category.id,
            e.target.name === 'name' ? e.target.value : category.name,
            e.target.name === 'slug' ? e.target.value : category.slug,
            category.image
        ));
    };


    const onHandleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setCategory(new Category(
                category.id,
                category.name,
                category.slug,
                files[0]
            ));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = category.toFormData();
            await axiosInstance.put(`/api/Categories/${id}`, formData);
            navigate("..");
        } catch (error) {
            console.error("Помилка оновлення категорії:", error);
        }
    };

    return (
        <>
            <h1 className="text-center">Редагувати категорію</h1>
            <form onSubmit={handleSubmit} className="col-md-6 offset-md-3">
                <BaseTextInput
                    label="Назва"
                    field="name"
                    value={category.name}
                    onChange={onHandleChange}
                />
                <BaseTextInput
                    label="Url-Slug"
                    field="slug"
                    value={category.slug}
                    onChange={onHandleChange}
                />
                <BaseFileInput
                    label="Оберіть фото"
                    field="image"
                    onChange={onHandleFileChange}
                />
                {category.image && typeof category.image === 'string' && (
                    <div className="mb-3">
                        <img
                            src={`${BASE_URL}/images/200_${category.image}`}
                            alt={category.name}
                            width={75}
                        />
                    </div>
                )}
                <button type="submit" className="btn btn-primary">Зберегти зміни</button>
            </form>
        </>
    );
};

export default CategoriesEditPage;