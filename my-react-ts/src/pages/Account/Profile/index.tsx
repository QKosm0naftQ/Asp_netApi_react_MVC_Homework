import React from "react";
import { Tabs, Card, Form, Input, Button, Upload, message, Typography, Spin, Alert } from "antd";
import { UserOutlined, ShoppingOutlined, LockOutlined, UploadOutlined } from "@ant-design/icons";
import { useGetUserOrdersQuery } from "../../../services/apiOrder.ts";
import { useUpdateUserMutation } from "../../../services/apiUser.ts";
import { useForgotPasswordMutation } from "../../../services/apiAccount.ts";
import { useAppSelector } from "../../../store";
import { APP_ENV } from "../../../env";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: ordersData, isLoading: isOrdersLoading, isError } = useGetUserOrdersQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [forgotPassword, { isLoading: isSendingEmail }] = useForgotPasswordMutation();

  const orders = (ordersData as unknown as any[]) || [];

  // --- Логіка оновлення профілю ---
  const onFinish = async (values: any) => {
    // 1. Отримуємо ID. 
    // Переконайся, що в Redux після логіну в об'єкті user є поле id!
    const userId = user?.id;

    if (!userId) {
      message.error("Помилка: ID користувача не знайдено в системі.");
      console.log("Current user object in Redux:", user);
      return;
    }

    const formData = new FormData();
    // Використовуємо великі літери, як у твоєму Swagger (Id, FullName, Email, Image)
    formData.append("Id", String(userId));
    formData.append("FullName", values.fullName);
    formData.append("Email", user?.email || "");

    if (values.image?.file?.originFileObj) {
      formData.append("Image", values.image.file.originFileObj);
    }

    try {
      // Викликаємо мутацію
      await updateUser(formData).unwrap();
      message.success("Дані успішно оновлено!");
    } catch (err: any) {
      console.error("Update error:", err);
      // Якщо бекенд повернув помилку валідації
      const errorMsg = err.data?.errors?.Id || "Помилка при оновленні профілю";
      message.error(errorMsg);
    }
  };

  // --- Логіка запиту на зміну пароля ---
  const handlePasswordReset = async () => {
    try {
      await forgotPassword({ email: user?.email || "" }).unwrap();
      message.success("Інструкції надіслано на вашу пошту!");
    } catch (err) {
      message.error("Не вдалося надіслати запит.");
    }
  };

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
      <Title level={2} className="mb-4">Особистий кабінет</Title>

      <Tabs defaultActiveKey="orders" size="large" type="card">

        {/* 1. ВКЛАДКА ЗАМОВЛЕНЬ (Твій готовий код) */}
        <Tabs.TabPane tab={<span><ShoppingOutlined /> Мої замовлення</span>} key="orders">
          <div className="mt-4">
            {isOrdersLoading ? (
              <Spin size="large" className="d-block mx-auto" />
            ) : isError ? (
              <Alert message="Помилка завантаження замовлень" type="error" />
            ) : orders.length === 0 ? (
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
                    {order.orderItems?.map((item: any, idx: number) => (
                      <div key={idx} className="d-flex align-items-center mb-2">
                        <img
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
        </Tabs.TabPane>

        {/* 2. ВКЛАДКА РЕДАГУВАННЯ ДАНИХ */}
        <Tabs.TabPane tab={<span><UserOutlined /> Профіль</span>} key="profile">
          <Card className="mt-4 border-0 shadow-sm" title="Редагування особистих даних">
            <Form layout="vertical" onFinish={onFinish} initialValues={{ fullName: user?.name }}>
              <Form.Item name="fullName" label="Прізвище та Ім'я" rules={[{ required: true }]}>
                <Input size="large" prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item label="Email (не редагується)">
                <Input size="large" value={user?.email} disabled />
              </Form.Item>

              <Form.Item name="image" label="Фото профілю">
                <Upload maxCount={1} beforeUpload={() => false} listType="picture">
                  <Button icon={<UploadOutlined />}>Вибрати нове фото</Button>
                </Upload>
              </Form.Item>

              <Button type="primary" htmlType="submit" size="large" loading={isUpdating}>
                Зберегти зміни
              </Button>
            </Form>
          </Card>
        </Tabs.TabPane>

        {/* 3. ВКЛАДКА БЕЗПЕКИ */}
        <Tabs.TabPane tab={<span><LockOutlined /> Безпека</span>} key="security">
          <Card className="mt-4 border-0 shadow-sm" title="Налаштування безпеки">
            <div className="p-3">
              <Title level={5}>Зміна пароля</Title>
              <Text className="d-block mb-3">
                Для зміни пароля ми надішлемо вам посилання для підтвердження на вашу пошту <b>{user?.email}</b>.
              </Text>
              <Button
                type="primary"
                danger
                icon={<LockOutlined />}
                onClick={handlePasswordReset}
                loading={isSendingEmail}
              >
                Скинути та змінити пароль
              </Button>
            </div>
          </Card>
        </Tabs.TabPane>

      </Tabs>
    </div>
  );
};

export default ProfilePage;
