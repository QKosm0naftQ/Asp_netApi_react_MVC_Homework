import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { BASE_URL } from "../../../api/apiConfig";
import LoadingOverlay from "../../../components/Common/LoadingOverlay";

const ProfilePage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Виклик твого API (переконайся, що шлях правильний)
        const response = await axiosInstance.get(`${BASE_URL}/api/Order/list`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) return <LoadingOverlay />;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Нове": return "bg-primary";
      case "Завершено": return "bg-success";
      case "Скасовано (вручну)": return "bg-danger";
      default: return "bg-secondary";
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Історія замовлень</h2>
      {orders.length === 0 ? (
        <div className="alert alert-light">Замовлень поки немає.</div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card mb-3 border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <div>
                <strong>Замовлення №{order.id}</strong>
                <span className="text-muted ms-3">
                  {new Date(order.dateCreated).toLocaleDateString('uk-UA')}
                </span>
              </div>
              <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="card-body">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="d-flex align-items-center mb-2">
                  <img
                    src={`${BASE_URL}/images/50_${item.productImage}`}
                    alt={item.productName}
                    className="rounded me-3"
                    style={{ width: '40px' }}
                  />
                  <div className="flex-grow-1">
                    {item.productName} x {item.count}
                  </div>
                  <div>{item.priceBuy} грн</div>
                </div>
              ))}
              <hr />
              <div className="text-end">
                <span className="text-muted me-2">Разом:</span>
                <span className="h5 text-primary">{order.totalPrice} грн</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProfilePage;
