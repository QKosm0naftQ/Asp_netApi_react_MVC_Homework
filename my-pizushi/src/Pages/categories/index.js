import { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import {BASE_URL} from "../../api/apiConfig";
import { Category } from '../../models/Category';

import { usePagination } from './Pagination/usePagination';
import CategoryPagination from './Pagination';

const CategoriesPage = () => {

    const [count, setCount] = useState(0);
    const [list, setList] = useState([]);
    //Фільтер для пошуку 
    const [filters, setFilters] = useState({
        name: "",
        slug: "",
        pageSize: 5
    });
    
    useEffect(() => {
        axiosInstance.get("/api/Categories")
            .then(res => {
                const { data } = res;
                //console.log("res", res.data);
                const categories = data.map(item => Category.fromJson(item));
                setList(categories);
            }).catch(err => console.log("Proble<:", err));
        //console.log("userEeffect", " - After render");
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цю категорію?")) return;

        try {
            await axiosInstance.delete(`/api/Categories/${id}`);
            setList(prev => prev.filter(item => item.id !== id));
            alert("Категорію успішно видалено");
        } catch (err) {
            console.error("Помилка при видаленні:", err);
            alert("Не вдалося видалити категорію.");
        }
    };

    const filteredList = list.filter(item =>
        item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        item.slug.toLowerCase().includes(filters.slug.toLowerCase())
    );
    
    // Пагінація
    const {
        currentPage,
        totalPages,
        currentItems,
        itemsPerPage,
        totalItems,
        handlePageChange
    } = usePagination(filteredList, filters.pageSize);

    // {console.log("currentPage", currentPage);}
    // {console.log(" currentItems", currentItems);}
    // {console.log("totalItems", totalItems);}
    // {console.log("itemsPerPage", itemsPerPage);}
    // {console.log("totalPages", totalPages);}
    // {console.log("list", list);}
    
    
    return (
        <div>
            <h1 className={"text-center"}>Категорії</h1>
            {/*Форма*/}
            {/* Форма пошуку */}
            <form className="row mb-4 shadow rounded bg-light p-3" onSubmit={e => e.preventDefault()}>
                <div className="col-md-4">
                    <label className="form-label">Назва</label>
                    <input
                        type="text"
                        className="form-control"
                        value={filters.name}
                        onChange={e => setFilters({ ...filters, name: e.target.value })}
                        placeholder="Пошук по назві"
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Slug</label>
                    <input
                        type="text"
                        className="form-control"
                        value={filters.slug}
                        onChange={e => setFilters({ ...filters, slug: e.target.value })}
                        placeholder="Пошук по slug"
                    />
                </div>

                <div className="col-md-2">
                    <label className="form-label">Елементів на сторінці</label>
                    <select
                        className="form-select"
                        value={filters.pageSize}
                        onChange={e => setFilters({ ...filters, pageSize: Number(e.target.value) })}
                    >
                        {[5, 10, 20, 50].map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-2 d-flex align-items-end">
                    <button
                        type="button"
                        className="btn btn-info"
                        onClick={() => setFilters({ name: "", slug: "", pageSize: 5 })}
                    >
                        Очистити
                    </button>
                </div>
            </form>
            {/*Форма*/}
            <Link to={"create"} className={"btn btn-primary"}>Додати</Link>

            {list.length === 0 ? (
                <h1>Список пустий :(</h1>
            ) : (
                <div className="row g-3">
                    {currentItems.map((item) => (
                        <div className="col-md-3 col-sm-6" key={item.id}>
                            <div className="card shadow-sm h-100">
                                <img
                                    src={`${BASE_URL}/images/200_${item.image}`}
                                    className="card-img-top"
                                    alt={item.name}
                                    style={{ objectFit: 'cover', height: '200px' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text text-muted">Slug: {item.slug}</p>
                                </div>
                                <div className="card-footer d-flex justify-content-between">
                                    <Link to={`edit/${item.id}`} className="btn btn-sm btn-primary">
                                        Edit
                                    </Link>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CategoryPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
            />
        </div>
    );


}



export default CategoriesPage;