import React from 'react';
import { Card, Col, Tooltip, Image } from 'antd';
import { Link } from 'react-router-dom'; // Додаємо Link для переходу на товар
import { APP_ENV } from "../../../env";
import { useAppSelector } from "../../../store";
import type { ICartItem } from "../../../store/localCartSlice.ts";
import { useCart } from "../../../hooks/useCart.ts";

interface Ingredient {
  id: number;
  name: string;
  image: string;
}

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    weight: number;
    productSize?: { name: string };
    ingredients?: Ingredient[];
    productImages?: { name: string }[];
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainImage = product.productImages?.[0]?.name;
  const ingredients = product.ingredients || [];
  const visible = ingredients.slice(0, 2);
  const hidden = ingredients.slice(2);
  const { user } = useAppSelector(state => state.auth);

  const { cart, addToCart } = useCart(user != null);

  const isInCart = cart.some(item =>
    product && item.productId === product.id
  );

  const handleAddToCart = async () => {
    if (!product) return;

    const newItem: ICartItem = {
      id: product.id,
      productId: product.id,
      quantity: 1,
      sizeName: product.productSize?.name ?? "",
      price: product.price,
      imageName: product.productImages?.[0]?.name ?? "",
      categoryId: 0,
      categoryName: "",
      name: product.name,
    };

    await addToCart(newItem);
  };

  return (
    <Card
      hoverable
      className="w-full flex flex-col h-full shadow-sm hover:shadow-md transition-shadow"
      // Використовуємо styles для Ant Design 5+, щоб тіло картки розтягувалося
      styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' } }}
      cover={
        <div className="h-[200px] w-full overflow-hidden bg-gray-100">
          {mainImage ? (
            <img
              alt={product.name}
              src={`${APP_ENV.IMAGES_400_URL}${mainImage}`}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Немає фото
            </div>
          )}
        </div>
      }
    >
      <div className="flex flex-col h-full flex-1">
        {/* Назва товару як посилання */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-lg font-bold text-gray-800 hover:text-orange-500 transition-colors mb-2 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="space-y-1 mb-4 text-sm text-gray-600">
          <p><strong>Ціна:</strong> <span className="text-orange-600 font-bold">{product.price} грн</span></p>
          <p><strong>Вага:</strong> {product.weight} г</p>

          {product.productSize && (
            <p><strong>Розмір:</strong> {product.productSize.name}</p>
          )}

          {/* Інгредієнти */}
          {ingredients.length > 0 && (
            <div className="mt-3">
              <p className="font-semibold mb-2">Інгредієнти:</p>
              <div className="flex flex-wrap gap-2">
                {visible.map((ingredient) => (
                  <Tooltip title={ingredient.name} key={ingredient.id}>
                    <Image
                      src={`${APP_ENV.IMAGES_400_URL}${ingredient.image}`}
                      alt={ingredient.name}
                      width={35}
                      height={35}
                      className="rounded-full border border-gray-200 object-cover"
                      preview={false}
                    />
                  </Tooltip>
                ))}

                {hidden.length > 0 && (
                  <Tooltip
                    title={
                      <div className="flex flex-wrap gap-2 p-1">
                        {hidden.map((ingredient) => (
                          <div key={ingredient.id} className="flex flex-col items-center">
                            <img
                              src={`${APP_ENV.IMAGES_400_URL}${ingredient.image}`}
                              alt={ingredient.name}
                              className="w-8 h-8 rounded-full border border-white"
                            />
                            <span className="text-[10px] text-white">{ingredient.name}</span>
                          </div>
                        ))}
                      </div>
                    }
                  >
                    <div className="w-[35px] h-[35px] rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-gray-300 transition-colors">
                      +{hidden.length}
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Кнопка завжди внизу завдяки mt-auto */}
        <button
          className={`w-full py-2 px-4 rounded-full font-bold transition-all mt-auto shadow-sm ${isInCart
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600 active:scale-95"
            }`}
          onClick={!isInCart ? handleAddToCart : undefined}
        >
          {isInCart ? "Вже в кошику" : "В кошик"}
        </button>
      </div>
    </Card>
  );
};

export default ProductCard;
