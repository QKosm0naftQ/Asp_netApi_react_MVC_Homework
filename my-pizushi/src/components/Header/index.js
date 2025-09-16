import {NavLink, useNavigate} from "react-router-dom";
import {useAuthStore} from "../../store/authStore";
import {BASE_URL} from "../../api/apiConfig";
import {useCartStore} from "../../store/cartStore";

import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {Button, Modal} from "antd";

const Header = () => {
    const navigate = useNavigate();


    const items = useCartStore((state) => state.items);

    const [isCartModalVisible, setIsCartModalVisible] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const removeItem = useCartStore((state) => state.removeItem);

    const { user, logout } = useAuthStore((state) => state);


    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const handleLogout = () => {
        logout();
        navigate("/");
    }

    const showCartModal = (id) => {
        setIsCartModalVisible(true);
    };

    const handleCartModalOk = () => {
        handleCartModalCancel();
    };

    const handleCartModalCancel = () => {
        setIsCartModalVisible(false);
    };

    const handleIncrement = (productId, quantity) => {
        addItem(productId, quantity + 1);
    };

    const handleDecrement = (productId, quantity) => {
        if (quantity > 1) {
            addItem(productId, quantity - 1);
        } else {
            console.log("REMOVE");
            removeItem(productId);
        }
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className={"container"}>
                <NavLink className="navbar-brand" to={"/"}>Піца і суші</NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink to="/categories" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                                Категорії
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/products" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                                Продукти
                            </NavLink>
                        </li>
                    </ul>

                    <ul className="navbar-nav ms-auto">

                        {user ? (
                            <div className="flex items-center gap-2">
                                <img src={`${BASE_URL}/images/50_${user.image}`} alt="Avatar" className="rounded-circle mx-3" />
                                <span className={"mx-3 text-white"}>{user.email}</span>
                                <button className={"mx-3 btn btn btn-light"} onClick={handleLogout}>Вийти</button>
                            </div>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <NavLink to="/register" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                                        Реєстрація
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink to="/login" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                                        Вхід
                                    </NavLink>
                                </li>
                            </>
                        )}
                        <li className="nav-item position-relative">
                            <button onClick={showCartModal} className="btn btn-dark mt-2 position-relative">
                                <FontAwesomeIcon icon={faShoppingCart} />
                                {totalCount > 0 && (
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                        style={{ fontSize: "0.6rem" }}
                                    >
                                        {totalCount}
                                    </span>
                                )}
                            </button>
                        </li>

                    </ul>
                </div>
            </div>
            <Modal
                title="Ваш кошик"
                open={isCartModalVisible}
                onOk={handleCartModalOk}
                onCancel={handleCartModalCancel}
                okText="Оформити"
                cancelText="Закрити"
                width={700}
            >
                {items.length === 0 ? (
                    <p>Кошик порожній</p>
                ) : (
                    <div>
                        {items.map(item => (
                            <div className="d-flex align-items-center mb-3 border-bottom pb-2">
                                <NavLink to={`products/product/${item.productId}`} onClick={()=>{setIsCartModalVisible(false)}}>
                                    <img src={`${BASE_URL}/images/200_${item.imageName}`} alt={item.name} width="50"  className="me-3"/>
                                </NavLink>

                                <div className="flex-grow-1">
                                    <div><strong>{item.name}</strong></div>
                                    <div className="text-muted">{item.categoryName}</div>
                                    <div>Ціна: {item.price} грн</div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <Button onClick={() => handleDecrement(item.productId, item.quantity)}>-</Button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <Button onClick={() => handleIncrement(item.productId, item.quantity)}>+</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </nav>
    )
}

export default Header;