import { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import {BASE_URL} from "../../api/apiConfig";
import { Category } from '../../models/Category'; 

const CategoriesPage = () => {

    const [count, setCount] = useState(0);
    const [list, setList] = useState([]);

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
    
    
    
    return (
        <div>
            <h1 className={"text-center"}>Категорії</h1>
            
            <Link to={"create"} className={"btn btn-primary"}>Додати</Link>
            
            {list.length === 0 ? <h1>Список пустий :(</h1> :
                <table className="table">
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>slug</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.slug}</td>
                                <td><img src={`${BASE_URL}/images/200_${item.image}`} alt={item.name} width={75} /></td>
                                <td>
                                    <Link to={`edit/${item.id}`} className={"btn btn-primary"}>Edit</Link>
                                </td>
                                <td>
                                    <button className={"btn btn-danger"} onClick={() => handleDelete(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </div>
    );


}



export default CategoriesPage;