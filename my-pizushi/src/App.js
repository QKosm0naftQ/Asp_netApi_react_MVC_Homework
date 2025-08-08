//import logo from './logo.svg';
import './App.css';
import CategoriesPage from './Pages/categories';
import {Route, Routes} from "react-router-dom";
import Layout from "./components/Layout";
import NoMatch from "./Pages/NoMatch";
import HomePage from "./Pages/Home";
import CategoriesCreatePage from "./Pages/categories/Create"
import CategoriesEditPage from "./Pages/categories/Edit"
import Error500 from "./Pages/Error500";
import LoginPage from "./Pages/account/Login";
import {useAuthStore} from "./store/authStore";
import {jwtDecode} from "jwt-decode";
import {useEffect} from "react";
const App = () => {

    const { setUser } = useAuthStore((state) => state);

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            const decoded = jwtDecode(token);
            setUser(decoded);
        }
    },[]);
    
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path={"categories"}>
                        <Route index element={<CategoriesPage />} />
                        <Route path={"create"} element={<CategoriesCreatePage />} />
                        <Route path={"edit/:id"} element={<CategoriesEditPage />} />
                    </Route>
                    <Route path={"login"} element={<LoginPage/>}/>

                    <Route path="500" element={<Error500 />} />
                    
                    <Route path="*" element={<NoMatch />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
