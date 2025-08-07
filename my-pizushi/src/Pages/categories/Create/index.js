import {useState} from "react";
import {useNavigate} from "react-router-dom";

import axiosInstance from "../../../api/axiosInstance";
import {BASE_URL} from "../../../api/apiConfig";

import BaseTextInput from "../../../components/Common/BaseTextInput";
import BaseFileInput from "../../../components/Common/BaseFileInput";

import * as Yup from "yup";
import {useFormik} from "formik";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Назва обов'язкова!"),
    slug: Yup.string().required("Slug обов'язковий!"),
    Image: Yup.mixed().nullable()
});
const CategoriesCreatePage = () => {
    const [serverErrors, setServerErrors] = useState([]);

    const initValues = {
        name: "",
        slug: "",
        Image: null,
    };

    const handleFormikSubmit = async (values) => {
        console.log("Submit formik", values);
        setServerErrors([]);
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('slug', values.slug);
            if (values.Image) {
                formData.append('Image', values.Image);
            }
            var result = await axiosInstance.post(`${BASE_URL}/api/categories`, formData);
            console.log("Server result", result);
            navigate("..");

        } catch(error) {
            if (error.response) {
                console.log("Server Error Data:", error.response.data);
                setServerErrors(error.response.data);
            } else {
                setServerErrors([{
                    field: "global",
                    error: error.message || "Сталася невідома помилка"
                }]);
            }
        }
    }

    const formik = useFormik({
        initialValues: initValues,
        onSubmit: handleFormikSubmit,
        validationSchema: validationSchema,
    });

    const {values, handleSubmit, errors, touched, handleChange, setFieldValue} = formik;

    const navigate = useNavigate();

    const onHandleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setFieldValue("Image", files[0]);
        }
        else {
            setFieldValue("Image", null);
        }
    }

    return (
        <>
            <h1 className={"text-center"}>Додати категорію</h1>
            <form onSubmit={handleSubmit} className={"col-md-6 offset-md-3"}>
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
                    error={errors.Image}
                    touched={touched.Image}
                    onChange={onHandleFileChange}
                />

                {serverErrors && serverErrors.errors && (
                    <div className="alert alert-danger">
                        {Object.entries(serverErrors.errors).map(([fieldName, errorMessages]) => (
                            <div key={fieldName} className="text-danger">
                                {`${fieldName}: ${errorMessages[0]}`}
                            </div>
                        ))}
                    </div>
                )}




                <button type="submit" className="btn btn-primary">Додати</button>
            </form>
        </>
    )
}

export default CategoriesCreatePage