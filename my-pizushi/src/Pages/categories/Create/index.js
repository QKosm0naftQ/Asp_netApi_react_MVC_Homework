import {useState} from "react";
import {useNavigate} from "react-router-dom";

import axiosInstance from "../../../api/axiosInstance";
import {BASE_URL} from "../../../api/apiConfig";

import BaseTextInput from "../../../components/Common/BaseTextInput";
import BaseFileInput from "../../../components/Common/BaseFileInput";

const CategoriesCreatePage = () => {

    const [form, setForm] = useState({
        name: "",
        slug: "",
        imageFile: null,
    });

    const navigate = useNavigate();

    // const [errors, setErrors] = useState({})

    const onHandleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const onHandleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setForm({...form, [e.target.name]: files[0]});
        }
        else {
            setForm({...form, [e.target.name]: null});
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Name", form.name);
        formData.append("Slug", form.slug);
        if (form.imageFile) {
            formData.append("Image", form.imageFile);
        }
        try {
            const result = await axiosInstance.post(`${BASE_URL}/api/categories`, formData);
            console.log("Server result", result);
            navigate("..");

        } catch(error) {
            console.error("Send request error", error);
            console.log("Response data:", error.response?.data);
        }
        // console.log("Submit data", form);
    }

    return (
        <>
            <h1 className={"text-center"}>Додати категорію</h1>
            <form onSubmit={handleSubmit} className={"col-md-6 offset-md-3"}>
                <BaseTextInput
                    label={"Назва"}
                    field={"name"}
                    value={form.name}
                    onChange={onHandleChange}
                />
                <BaseTextInput
                    label={"Url-Slug"}
                    field={"slug"}
                    value={form.slug}
                    onChange={onHandleChange}
                />
                <BaseFileInput
                    label={"Оберіть фото"}
                    field={"imageFile"}
                    onChange={onHandleFileChange}
                />
                <button type="submit" className="btn btn-primary">Додати</button>
            </form>
        </>
    )
}

export default CategoriesCreatePage