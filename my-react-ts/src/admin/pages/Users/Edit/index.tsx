import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../../../services/apiUser';
import { APP_ENV } from '../../../../env';

interface EditUserModalProps {
  userId: number;
  open: boolean;
  onClose: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ userId, open, onClose }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  // Отримуємо дані юзера (RTK Query автоматично зробить GET /api/Users/{id})
  const { data: user, isLoading } = useGetUserByIdQuery(userId, { skip: !open });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Заповнюємо форму, коли дані завантажені
  useEffect(() => {
    if (user && open) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
      });
      if (user.image) {
        setFileList([{
          uid: '-1',
          name: 'current.png',
          status: 'done',
          url: `${APP_ENV.IMAGES_400_URL}${user.image}`, // Шлях до фото на сервері
        }]);
      }
    }
  }, [user, open, form]);

  const handleFinish = async (values: any) => {
    const formData = new FormData();
    formData.append('id', userId.toString());
    formData.append('fullName', values.fullName);
    formData.append('email', values.email);

    // Додаємо файл, якщо він був змінений
    if (fileList[0]?.originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }

    try {
      await updateUser(formData).unwrap();
      message.success('Дані оновлено успішно!');
      onClose(); // Закриваємо модалку
    } catch (err) {
      message.error('Помилка при оновленні');
    }
  };

  return (
    <Modal
      title="Редагувати профіль"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} disabled={isLoading}>
        <Form.Item name="fullName" label="Повне ім'я" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Фото користувача">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false} // Зупиняємо автоматичну відправку
            onChange={({ fileList }) => setFileList(fileList.slice(-1))} // Тільки 1 файл
          >
            {fileList.length < 1 && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Завантажити</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Скасувати</Button>
          <Button type="primary" htmlType="submit" loading={isUpdating}>
            Зберегти
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
