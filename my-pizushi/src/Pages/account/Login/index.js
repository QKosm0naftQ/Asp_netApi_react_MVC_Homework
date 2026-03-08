import axiosInstance from "../../../api/axiosInstance";
import {BASE_URL} from "../../../api/apiConfig";
import { useFormik } from "formik";
import * as Yup from "yup";

import {useAuthStore} from "../../../store/authStore";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {mapServerErrorsToFormik} from "../../../helpers/formikErrorHelper";
import {EmailInput} from "../../../components/Common/EmailInput";
import {PasswordInput} from "../../../components/Common/PasswordInput";
import {jwtDecode} from "jwt-decode";
import LoadingOverlay from "../../../components/Common/LoadingOverlay";

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Введіть правильний формат, наприклад ex@gmail.com").required("Пошта не може бути порожньою"),
    password: Yup.string().required("Пароль не може бути порожнім")
});

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const { setUser, user } = useAuthStore((state) => state);
    console.log("User authenticated", user);

    const initValues = {
        email: "",
        password: ""
    };

    const handleFormikSubmit = async (values) => {
        setIsLoading(true);
        console.log("Submit formik", values);
        try {
            var result = await axiosInstance.post(`${BASE_URL}/api/Account/login`, values);
            console.log("Server result", result);

            const token = result.data.token;

            localStorage.setItem("jwt", token);

            const decoded = jwtDecode(token);
            setUser(decoded);
            //
            // console.log("Decoded", decoded);
            //
            navigate("/");

            setIsLoading(false);

        } catch(err) {
            console.error("Send request error", err);

            mapServerErrorsToFormik(err, setErrors);

            setIsLoading(false);
        }
    }

    const formik = useFormik({
        initialValues: initValues,
        onSubmit: handleFormikSubmit,
        validationSchema: validationSchema,
    });

    const {values, handleSubmit, errors, touched, setErrors, handleChange, setFieldValue} = formik;

    const navigate = useNavigate();

    return (
        <>
            {errors.general && (
                <div className="alert alert-danger" role="alert">
                    {errors.general}
                </div>
            )}

            <h1 className={"text-center"}>Вхід</h1>
            <form onSubmit={handleSubmit} noValidate className={"col-md-6 offset-md-3"}>
                <EmailInput
                    label="Email"
                    field="email"
                    error={errors.email}
                    touched={touched.email}
                    value={values.email}
                    onChange={handleChange}
                />

                <PasswordInput
                    label="Пароль"
                    field="password"
                    error={errors.password}
                    touched={touched.password}
                    value={values.password}
                    onChange={handleChange}
                />

                <button type="submit" className="btn btn-primary">Увійти</button>

                {isLoading && <LoadingOverlay />}
            </form>
        </>
    );
};

export default LoginPage;