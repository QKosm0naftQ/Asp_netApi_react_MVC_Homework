import { Card, Col, Tooltip, Image } from 'antd';
import { APP_ENV } from "../../../env";
import { createUpdateCartLocal, type ICartItem } from "../../../store/cartSlice.ts";
import { useAppDispatch, useAppSelector } from "../../../store";


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
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const { items } = useAppSelector(state => state.cart);

  //
  const handleAddToCart = async (product: any) => {
    if (!product) return;

    const newItem: ICartItem = {
      productId: product.id,
      quantity: 1,
      sizeName: product?.productSize?.name ?? "",
      price: product?.price ?? product.price,
      imageName: product?.productImages?.[0]?.name ?? product.productImages?.[0]?.name ?? "",
      categoryId: product.category.id,
      categoryName: product.category.name,
      name: product.name,
    };

    const newItems: ICartItem[] = items.length > 0 ? [...items] : [];
    const index = items!.findIndex(cartItem => cartItem.productId === newItem.productId);
    if (index >= 0) {
      newItems[index].quantity! = newItem.quantity!;

      if (newItems[index].quantity! <= 0) {
        newItems.splice(index, 1);
      }
    } else {
      newItems.push(newItem);
    }
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(newItems));
    }
    else {
      //запит на сервер, а потім уже оновляю cart

    }
    dispatch(createUpdateCartLocal(newItems));
  };

  return (
    <Col xs={24} sm={12} md={8} lg={6}>
      <div className="h-full flex">
        <Card
          hoverable
          className="w-full flex flex-col"
          cover={
            mainImage ? (
              <img
                alt={product.name}
                src={`${APP_ENV.IMAGES_400_URL}${mainImage}`}
                className="h-[200px] object-cover"
              />
            ) : null
          }
          title={product.name}
        >
          <div className="flex flex-col justify-between flex-1">
            <div>
              <p><strong>Ціна:</strong> {product.price} грн</p>
              <p><strong>Вага:</strong> {product.weight} г</p>

              {product.productSize && (
                <p><strong>Розмір:</strong> {product.productSize.name}</p>
              )}

              {ingredients.length > 0 && (
                <div>
                  <strong>Інгредієнти:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {visible.map((ingredient) => (
                      <Tooltip title={ingredient.name} key={ingredient.id}>
                        <Image
                          src={`${APP_ENV.IMAGES_400_URL}${ingredient.image}`}
                          alt={ingredient.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                          preview={false}
                        />
                      </Tooltip>
                    ))}

                    {hidden.length > 0 && (
                      <Tooltip
                        title={
                          <div className="flex flex-wrap gap-2">
                            {hidden.map((ingredient) => (
                              <Tooltip title={ingredient.name} key={ingredient.id}>
                                <Image
                                  src={`${APP_ENV.IMAGES_400_URL}${ingredient.image}`}
                                  alt={ingredient.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                  preview={false}
                                />
                              </Tooltip>
                            ))}
                          </div>
                        }
                      >
                        <div
                          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold cursor-pointer text-sm leading-none shrink-0 self-center"
                        >
                          +{hidden.length}
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </div>
              )}

              <button className={"bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-5 rounded-full"} onClick={() => handleAddToCart(product)}>В кошик</button>
            </div>
          </div>
        </Card>
      </div>
    </Col>
  );
};

export default ProductCard;
