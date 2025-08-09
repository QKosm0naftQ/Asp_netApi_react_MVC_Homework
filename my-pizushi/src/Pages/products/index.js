import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import {BASE_URL} from "../../api/apiConfig";
import {Card,Button,Col,Row,Spinner,Container} from "react-bootstrap";


const ProductsPage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [groupedProducts, setGroupedProducts] = useState([]);

    useEffect(() => {
        axiosInstance.get("/api/Products")
            .then(res => {
                const { data } = res;
                console.log('Get list of products', data);
                setList(data);
                groupBySlug(data);
            })
            .catch(err => console.error('Error loading products', err))
            .finally(() => setLoading(false));
    }, []);

    const groupBySlug = (items) => {
        const grouped = Object.values(items.reduce((acc, item) => {
            if (!acc[item.slug]) {
                acc[item.slug] = {
                    ...item,
                    sizes: [],
                };
            }
            acc[item.slug].sizes.push({
                sizeName: item.productSize?.name,
                price: item.price,
                id: item.id
            });
            console.log("acc",acc);
            return acc;

        }, {}));

        setGroupedProducts(grouped);
    };

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <Container className="my-4">
            <h2 className="mb-4 text-center">Продукти</h2>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {groupedProducts.map(product => (
                    <Col key={product.slug}>
                        <Card className="h-100">
                            <Card.Img
                                variant="top"
                                src={`${BASE_URL}/images/800_${product.productImages?.[0]?.name}`}
                                alt={product.name}
                                style={{ objectFit: 'cover', height: '180px' }}
                            />
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>{product.name}</Card.Title>

                                {product.sizes?.map((size, index) => (
                                    <div key={index} className="d-flex justify-content-between">
                                        <span>{size.sizeName}</span>
                                        <strong>{size.price} грн</strong>
                                    </div>
                                ))}
                                <br/>
                                <div className="mt-auto d-grid">
                                    <Button variant="primary">
                                        <Link to={`product/${product.id}`} className={"text-white text-decoration-none"}>Show</Link>
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ProductsPage;