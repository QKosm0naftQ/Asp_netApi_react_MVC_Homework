import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {store} from "./store";
import {ThemeProvider} from "./context/ThemeContext.tsx";
import {AppWrapper} from "./components/common/PageMeta.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById('root')!).render(
    <>
        <ThemeProvider>
            <AppWrapper>
                <Provider store={store}>
                    <GoogleOAuthProvider clientId="43836669824-r6om0ehmc9t0ig84b1sk21a8qsfa98vc.apps.googleusercontent.com">
                    <App/>
                    </GoogleOAuthProvider>
                </Provider>
            </AppWrapper>
        </ThemeProvider>
    </>,
)