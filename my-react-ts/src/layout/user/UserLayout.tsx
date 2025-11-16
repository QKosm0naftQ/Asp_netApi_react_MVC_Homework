import {Link, Outlet} from "react-router";

const UserLayout: React.FC = () => {
    return (
        <div className="min-h-screen w-full flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
            <header className="w-full py-6 px-8 bg-orange-500 text-white shadow-md flex justify-between">
                <h1 className="text-xl font-semibold">FoodDelivery</h1>
                <Link to={"/admin/home"}>Адмінка</Link>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <Outlet />
            </main>

            <footer className="w-full py-3 px-6 bg-gray-100 text-sm text-center dark:bg-gray-800 dark:text-gray-300">
                © 2025 FoodDelivery. Усі права захищено.
            </footer>
        </div>
    );
};

export default UserLayout;