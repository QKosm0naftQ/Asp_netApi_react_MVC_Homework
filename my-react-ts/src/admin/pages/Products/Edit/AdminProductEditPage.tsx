import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useEditProductMutation,
  useGetProductByIdQuery,
  useGetIngredientsQuery,
  useGetSizesQuery,
} from "../../../../services/apiProducts.ts";
import { useGetAllCategoriesQuery } from "../../../../services/apiCategory.ts";
import type { IProductEdit } from "../../../../services/types.ts";
import type { UploadFile } from "antd";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Typography,
  message,
} from "antd";
import LoadingOverlay from "../../../../components/ui/loading/LoadingOverlay.tsx";
import DragDropUpload from "../../../../components/ui/images/DragDropUpload.tsx";
import type { RcFile } from "antd/es/upload";
import { APP_ENV } from "../../../../env";

const { Title } = Typography;

const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Отримуємо ID з URL
  const [form] = Form.useForm();
  const [images, setImages] = useState<UploadFile[]>([]);
  const [ingredientIds, setIngredientIds] = useState<number[]>([]);

  const navigate = useNavigate();

  // Завантаження даних
  const { data: product, isLoading: isProductLoading } = useGetProductByIdQuery(id || "");
  const { data: sizes = [] } = useGetSizesQuery();
  const { data: categories = [] } = useGetAllCategoriesQuery();
  const { data: ingredients = [] } = useGetIngredientsQuery();
  const [editProduct, { isLoading: isEditLoading }] = useEditProductMutation();

  // Ефект для заповнення форми даними, коли вони прийдуть з сервера
  useEffect(() => {
    if (product) {
      // Заповнюємо форму, перетворюючи об'єкти в ID
      form.setFieldsValue({
        name: product.name,
        slug: product.slug,
        price: product.price,
        weight: product.weight,
        // Замість product.categoryId (якого нема), беремо id з об'єкта category
        categoryId: product.category?.id,
        productSizeId: product.productSize?.id,
      });

      // Витягуємо ID інгредієнтів з масиву об'єктів
      if (product.productIngredients) {
        const ids = product.productIngredients.map(ing => ing.id);
        setIngredientIds(ids);
      }

      // Встановлюємо фото (якщо воно є в першому елементі масиву зображень)
      if (product.productImages && product.productImages.length > 0) {
        const mainImage = product.productImages[0].name;
        setImages([
          {
            uid: '-1',
            name: mainImage,
            status: 'done',
            url: `${APP_ENV.IMAGES_400_URL}${mainImage}`,
          },
        ]);
      }
    }
  }, [product, form]);

  const handleIngredientToggle = (id: number) => {
    setIngredientIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onFinish = async (values: any) => {
    try {
      const imageFiles = images
        .map((f) => f.originFileObj)
        .filter((f): f is RcFile => f instanceof File);

      const dto: IProductEdit = {
        id: Number(id),
        name: values.name,
        slug: values.slug,
        price: values.price,
        weight: values.weight,
        categoryId: values.categoryId,
        productSizeId: values.productSizeId,
        ingredientIds: ingredientIds,
        imageFiles: imageFiles.length > 0 ? imageFiles : undefined
      };

      await editProduct(dto).unwrap();
      message.success("Зміни збережено!");
      navigate('/admin/products');
    } catch (err) {
      message.error("Помилка при збереженні");
    }
  };

  if (isProductLoading) return <LoadingOverlay />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Title level={3}>Редагування продукту №{id}</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="border rounded-2xl p-4 h-full">
            <DragDropUpload fileList={images} setFileList={setImages} />
            <p className="text-gray-400 text-xs mt-2 text-center">
              Якщо не завантажувати нове фото, залишиться старе
            </p>
          </div>

          <div className="border rounded-2xl p-4 h-full">
            <Form.Item
              label="Назва"
              name="name"
              rules={[{ required: true, message: "Введіть назву" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Слаг (латинськими)"
              name="slug"
              rules={[{ required: true, message: "Введіть слаг" }]}
            >
              <Input />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Вага (г)"
                name="weight"
                rules={[{ required: true, message: "Введіть вагу" }]}
              >
                <InputNumber className="w-full" min={0} />
              </Form.Item>

              <Form.Item
                label="Ціна (грн)"
                name="price"
                rules={[{ required: true, message: "Введіть ціну" }]}
              >
                <InputNumber className="w-full" min={0} />
              </Form.Item>
            </div>

            <Form.Item
              label="Розмір"
              name="productSizeId"
              rules={[{ required: true, message: "Оберіть розмір" }]}
            >
              <Select placeholder="Оберіть розмір">
                {sizes.map((size) => (
                  <Select.Option key={size.id} value={size.id}>
                    {size.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Категорія"
              name="categoryId"
              rules={[{ required: true, message: "Оберіть категорію" }]}
            >
              <Select placeholder="Оберіть категорію">
                {categories.map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-10"
              >
                Зберегти зміни
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>

      <div className="border rounded-2xl p-4 bg-white">
        <h5 className="text-lg font-semibold mb-3">Інгредієнти</h5>
        <div className="flex flex-wrap gap-3">
          {ingredients.map((ing) => {
            const selected = ingredientIds.includes(ing.id);
            return (
              <div
                key={ing.id}
                onClick={() => handleIngredientToggle(ing.id)}
                className={`cursor-pointer px-4 py-1.5 rounded-full border transition-all ${selected
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                  }`}
              >
                {ing.name}
              </div>
            );
          })}
        </div>
      </div>

      {(isEditLoading) && <LoadingOverlay />}
    </div>
  );
};

export default AdminProductEditPage;
