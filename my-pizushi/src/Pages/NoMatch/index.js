import { Link } from 'react-router-dom';

const NoMatch = () => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
            <h1 className="display-1 fw-bold text-danger">404</h1>
            <p className="fs-3"> <span className="text-danger">Упс!</span> Сторінку не знайдено.</p>
            <p className="lead">
                Схоже, що такої сторінки не існує або вона була переміщена.
            </p>
            <Link to="/" className="btn btn-primary">
                Повернутися на головну
            </Link>
        </div>
    );
};

export default NoMatch;