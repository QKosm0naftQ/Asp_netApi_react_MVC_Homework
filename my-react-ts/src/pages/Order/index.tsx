import { useGetUserOrdersQuery } from "../../services/apiOrder.ts"; // Твій сервіс
import { APP_ENV } from "../../env";

const OrderStatusPage = () => {
  // 1. Використовуємо RTK Query замість axios + useEffect
  // Він сам керує isLoading, помилками та кешуванням
  const { data, isLoading, isError } = useGetUserOrdersQuery();

  // Явно вказуємо, що працюємо з масивом
  const orders = (data as unknown as any[]) || [];


  if (isError) return <div className="alert alert-danger">Помилка при завантаженні замовлень.</div>;

  const getStatusBadgeClass = (status: string) => {
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
        orders.map((order: any) => (
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
              {/* Рендеримо товари в замовленні */}
              {order.orderItems?.map((item: any, idx: number) => (
                <div key={idx} className="d-flex align-items-center mb-2">
                  <img
                    // Використовуємо APP_ENV як у CartDrawer
                    src={`${APP_ENV.IMAGES_200_URL}${item.productImage}`}
                    alt={item.productName}
                    className="rounded me-3"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    {item.productName} <span className="text-muted">x {item.count}</span>
                  </div>
                  <div className="fw-bold">{item.priceBuy} ₴</div>
                </div>
              ))}

              <hr />
              <div className="text-end">
                <span className="text-muted me-2">Загальна сума:</span>
                <span className="h5 text-primary">{order.totalPrice} ₴</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderStatusPage;
