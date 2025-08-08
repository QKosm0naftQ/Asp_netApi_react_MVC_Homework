import React from 'react';

const Error500 = () => {
    return (
        <div className="container mt-5 text-center">
            <h1 className="display-1">500</h1>
            <h2>Internal Server Error</h2>
            <p className="lead">Щось пішло не так на сервері. Спробуйте оновити сторінку або повернутися пізніше.</p>
            <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
            >
                Оновити сторінку
            </button>
        </div>
    );
};

export default Error500; 