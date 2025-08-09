import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosInstance from "../../../api/axiosInstance";
import {BASE_URL} from "../../../api/apiConfig";
import {Spinner} from "react-bootstrap";

const ProductPage = () => {
    const { id } = useParams();
    const [currentProduct, setProduct] = useState();
    const [allProducts, setAllProducts] = useState();
    const navigate = useNavigate();

    console.log("id",id);
    useEffect(() => {
        if (!id) return;

        axiosInstance.get(`/api/Products/id/${id}`)
            .then(res => {
                const current = res.data;
                setProduct(current);
                console.log("current",current);
                return axiosInstance.get(`/api/Products/slug/${current.slug}`);
            })
            .then(res => {
                const {data} = res;
                console.log("data",data);
                setAllProducts(data);
            })
            .catch(err => console.error("Error loading product", err));
    }, [id]);
    if (!currentProduct || !allProducts) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }
    return (
        <div className=" col-md-9 offset-md-2 d-flex justify-content-center align-items-center" style={{ marginTop: "7%" }}>
            <div className="row">

                <div className="col-md-6">
                    <div id="productCarousel" className="carousel slide" data-bs-ride="false">

                        <div className="carousel-indicators">
                            {currentProduct?.productImages?.map((img, index) => (
                                <button
                                    key={img.id}
                                    type="button"
                                    data-bs-target="#productCarousel"
                                    data-bs-slide-to={index}
                                    className={index === 0 ? "active" : ""}
                                    aria-current={index === 0 ? "true" : undefined}
                                ></button>
                            ))}
                        </div>

                        <div className="carousel-inner">
                            {currentProduct?.productImages?.map((img, index) => (
                                <div key={img.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                    <img
                                        src={`${BASE_URL}/images/800_${img.name}`}
                                        className="d-block w-300 rounded-3"
                                        alt={`Product slide ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#productCarousel"
                            data-bs-slide="prev"
                        >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        </button>
                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#productCarousel"
                            data-bs-slide="next"
                        >
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>


                <div className="col-md-4 mb-5" style={{ marginLeft: "3%" }}>
                    <h2>{currentProduct.name}</h2>
                    <br/>
                    <h6 >Інгредієнти</h6>

                    <div className="d-flex flex-wrap ">
                        {currentProduct?.ingredients?.map((ing) => (
                            <div key={ing.id} className="d-flex align-items-center me-3 mb-2 border rounded-3 p-2">
                                <img
                                    src={`${BASE_URL}/images/200_${ing.image}`}
                                    alt={ing.name}
                                    width={20}
                                    height={20}
                                    className="me-2 rounded-circle"
                                />
                                <span>{ing.name}</span>
                            </div>
                        ))}
                    </div>
                    <br/>

                    <div className="d-flex justify-content-between mt-3">
                        <div className={"fw-bold fs-4"}>Вага: {currentProduct.weight}гр</div>
                        <div className={"fw-bold fs-4"}><strong></strong> {currentProduct.price} грн</div>
                    </div>


                    <div className="mt-4 d-flex flex-row flex-wrap align-items-center">
                        {allProducts.map(product => (
                            <div className="form-check me-3" key={product.id}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id={`size-${product.id}`}
                                    name="size"
                                    checked={product.id === currentProduct.id}
                                    onChange={() => navigate(`/products/product/${product.id}`)}
                                />
                                <label className="form-check-label" htmlFor={`size-${product.id}`}>
                                    {product.productSize?.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};


export default ProductPage;