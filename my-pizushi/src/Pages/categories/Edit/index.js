import {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";

import axiosInstance from "../../../api/axiosInstance";
import { BASE_URL } from "../../../api/apiConfig";
import { Category } from "../../../models/Category";

import BaseTextInput from "../../../components/Common/BaseTextInput";
import BaseFileInput from "../../../components/Common/BaseFileInput";

import * as Yup from "yup";
import { useFormik } from "formik";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Назва обов'язкова!!"),
    slug: Yup.string().required("Slug обов'язковий!!"),
    Image: Yup.mixed().nullable()
});

const CategoriesEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [serverErrors, setServerErrors] = useState([]);

    const formik = useFormik({
        initialValues: {
            id: "",
            name: "",
            slug: "",
            image: null
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new Category(
                    values.id,
                    values.name,
                    values.slug,
                    values.image
                ).toFormData();
                
                const myData = await axiosInstance.put(`/api/Categories/${id}`, formData);
                navigate("..");
            } catch (error) {
                console.error("Помилка оновлення категорії:", error);
                setServerErrors(error.response.data);
            }
        }
    });

    const {
        values,
        handleSubmit,
        errors,
        touched,
        handleChange,
        setFieldValue,
        setValues
    } = formik;

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axiosInstance.get(`/api/Categories/${id}`);
                const categoryData = Category.fromJson(response.data);
                // Оновлюємо formik значення
                setValues({
                    id: categoryData.id,
                    name: categoryData.name,
                    slug: categoryData.slug,
                    image: categoryData.image
                });
                setServerErrors([]);
            } catch (error) {
                console.error("Помилка завантаження категорії:", error);
            }
        };

        fetchCategory();
    }, [id, setValues]);

    const onHandleFileChange = (e) => {
        const files = e.currentTarget.files;
        if (files && files.length > 0) {
            setFieldValue("image", files[0]);
        }
    };

    return (
        <>
            <h1 className="text-center">Редагувати категорію</h1>
            <form onSubmit={handleSubmit} className="col-md-6 offset-md-3">
                <BaseTextInput
                    label={"Назва"}
                    field={"name"}
                    error={errors.name}
                    touched={touched.name}
                    value={values.name}
                    onChange={handleChange}
                />

                <BaseTextInput
                    label={"Url-Slug"}
                    field={"slug"}
                    error={errors.slug}
                    touched={touched.slug}
                    value={values.slug}
                    onChange={handleChange}
                />

                <BaseFileInput
                    label={"Оберіть фото"}
                    field={"Image"}
                    error={errors.image}
                    touched={touched.image}
                    onChange={onHandleFileChange}
                />

                {typeof values.image === "string" && (
                    <div className="mb-3">
                        <img
                            src={`${BASE_URL}/images/200_${values.image}`}
                            alt={values.name}
                            width={75}
                        />
                    </div>
                )}
                
                {serverErrors && serverErrors.errors && (
                    <div className="alert alert-danger">
                        {Object.entries(serverErrors.errors).map(([fieldName, errorMessages]) => (
                            <div key={fieldName} className="text-danger">
                                {`${fieldName}: ${errorMessages[0]}`}
                            </div>
                        ))}
                    </div>
                )}

                <button type="submit" className="btn btn-primary">
                    Зберегти зміни
                </button>
            </form>
        </>
    );
};

export default CategoriesEditPage;
