//import logo from './logo.svg';
import './App.css';
import CategoriesPage from './Pages/categories';
import {Route, Routes} from "react-router-dom";
import Layout from "./components/Layout";
import NoMatch from "./Pages/NoMatch";
import HomePage from "./Pages/Home";
import CategoriesCreatePage from "./Pages/categories/Create"
import CategoriesEditPage from "./Pages/categories/Edit"
const App = () => {
    return (
//<CategoriesPage />
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path={"categories"}>
                        <Route index element={<CategoriesPage />} />
                        <Route path={"create"} element={<CategoriesCreatePage />} />
                        <Route path={"edit/:id"} element={<CategoriesEditPage />} />
                    </Route>
                    
                    <Route path="*" element={<NoMatch />} />
                </Route>
            </Routes>
        </>
    );
    
    //return (
    //<div className="App">
    //  <header className="App-header">
    //    <img src={logo} className="App-logo" alt="logo" />
    //    <p>
    //      Edit <code>src/App.js</code> and save to reload.
    //    </p>
    //    <a
    //      className="App-link"
    //      href="https://reactjs.org"
    //      target="_blank"
    //      rel="noopener noreferrer"
    //    >
    //      Learn React
    //    </a>
    //  </header>
    //</div>
  //);
}

export default App;
