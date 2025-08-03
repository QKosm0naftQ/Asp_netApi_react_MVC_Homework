import { useEffect, useState } from 'react';
import axios from 'axios';
const CategoriesPage = () => {

    const [count, setCount] = useState(0);
    const [list, setList] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5126/api/Categories")
            .then(res => {
                const { data } = res;
                console.log("res", res.data);
                setList(data);
            }).catch(err => console.log("Proble<:", err));
        console.log("userEeffect", " - After render");
    }, []);
    return (
        <div>
            <h1 className={"text-center"}>Hello world</h1>
            <h1>Categories</h1>
            <p>This is the categories page.</p>
            {list.length === 0 ? <h1>List empty</h1> :
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
                                <td><img src={`http://localhost:5126/images/400_${item.image}`} alt={item.name} width={75} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </div>
    );
}
export default CategoriesPage;