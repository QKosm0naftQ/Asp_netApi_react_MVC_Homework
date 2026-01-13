import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router";
import UserLayout from "./layout/user/UserLayout.tsx";
import UserHomePage from "./pages/OtherPage/UserHomePage.tsx";
import AdminLayout from "./layout/admin/AdminLayout.tsx";
import DashboardHome from "./pages/Dashboard/DashboardHome.tsx";
import CategoriesListPage from "./pages/Categories";
import NotFound from "./pages/OtherPage/NotFound.tsx";
import CategoriesCreatePage from "./pages/Categories/create";
import CategoriesEditPage from "./pages/Categories/edit";
import LoginPage from "./pages/Account/Login";
import RequireAdmin from "./components/ProtectedRoute/RequireAdmin.tsx";
import RegistrationPage from "./pages/Account/register";
import ProductsPage from "./pages/Products/List";

import AdminProductListPage from "./admin/pages/Products/List/AdminProductListPage.tsx";
import AdminProductCreatePage from "./admin/pages/Products/Create/AdminProductCreatePage.tsx";

import ForgotPasswordPage from "./pages/Account/ForgotPassword";

import ForgotSuccessPage from "./pages/Account/ForgotSuccess.tsx";
import { ResetPasswordPage } from "./pages/Account/ResetPassword";

import UserListPage from "./admin/pages/Users";

const App: React.FC = () => {

  return (
    <>
      <Router>
        <Routes>
          {/*<Route index element={<UserLayout>}></Route>*/}

          <Route path="/" element={<UserLayout />}>
            <Route index element={<UserHomePage />} />
            <Route path={'login'} element={<LoginPage />} />
            <Route path={'forgot-password'} element={<ForgotPasswordPage />} />
            <Route path="forgot-success" element={<ForgotSuccessPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="register" element={<RegistrationPage />} />
            <Route path="products" element={<ProductsPage />} />
          </Route>

          <Route path="admin" element={<RequireAdmin />}>
            <Route element={<AdminLayout />}>
              <Route path="home" element={<DashboardHome />} />

              <Route path="categories">
                <Route index element={<CategoriesListPage />} />
                <Route path={'create'} element={<CategoriesCreatePage />} />
                <Route path={'edit/:id'} element={<CategoriesEditPage />} />
              </Route>

              <Route path="products">
                <Route index element={<AdminProductListPage />} />
                <Route path={'create'} element={<AdminProductCreatePage />} />
              </Route>
              <Route path="users">
                <Route index element={<UserListPage />}></Route>
              </Route>
            </Route>
          </Route>


          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
