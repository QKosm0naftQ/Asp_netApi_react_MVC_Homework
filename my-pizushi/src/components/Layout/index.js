import {Outlet} from "react-router-dom";
import Header from "../Header";

const Layout = () => {
    return (
        <>
            {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
            <Header/>

            <div className="container">
                <Outlet/>
            </div>
    
        </>
    );
}
export default Layout;