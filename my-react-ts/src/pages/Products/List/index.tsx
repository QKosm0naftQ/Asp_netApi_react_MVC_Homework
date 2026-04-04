import React from 'react';
import { Row, Col, Typography, Breadcrumb } from 'antd';
import { useSearchParams, Link } from 'react-router-dom'; // Додай ці імпорти
import { useGetAllProductsQuery } from "../../../services/apiProducts.ts";
import ProductCard from "../../../components/ui/card/ProductCard.tsx";
import LoadingOverlay from "../../../components/ui/loading/LoadingOverlay.tsx";

const { Title } = Typography;

export const ProductsPage: React.FC = () => {
  const { data: products, isLoading, isError } = useGetAllProductsQuery();
  const [searchParams] = useSearchParams();

  // 1. Дістаємо категорію та пошуковий запит з URL
  const categorySlug = searchParams.get("category");
  const searchQuery = searchParams.get("search")?.toLowerCase();

  if (isError) return <p>Помилка при завантаженні продуктів</p>;

  // 2. Фільтруємо продукти (Хитрість: робимо все в одному масиві)
  const filteredProducts = products
    ? products.filter((product) => {
      // Фільтр по категорії
      const matchesCategory = categorySlug ? product.category?.slug === categorySlug : true;
      // Фільтр по пошуку
      const matchesSearch = searchQuery ? product.name.toLowerCase().includes(searchQuery) : true;

      return matchesCategory && matchesSearch;
    })
    : [];

  // Видаляємо дублікати за слагом (як у тебе було)
  const uniqueProducts = filteredProducts.filter((product, index, self) =>
    index === self.findIndex((p) => p.slug === product.slug)
  );

  // Знаходимо назву категорії для BreadCrumbs
  const currentCategoryName = categorySlug && uniqueProducts.length > 0
    ? uniqueProducts[0].category?.name
    : null;

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div style={{ padding: '24px 50px' }}>

        {/* ПУНКТ 5: BreadCrumbs (Хлібні крихти) */}
        <Breadcrumb className="mb-4" items={[
          { title: <Link to="/">Головна</Link> },
          { title: <Link to="/products">Меню</Link> },
          categorySlug ? { title: currentCategoryName } : null,
        ].filter(Boolean) as any} />

        <Title level={2} className="mb-4">
          {searchQuery ? `Результати пошуку: "${searchQuery}"` : (currentCategoryName || "Наше меню")}
        </Title>

        {uniqueProducts.length > 0 ? (
          <div style={{ padding: '24px' }}>
            {/* gutter={[горизонтальний, вертикальний]} відступ між картками */}
            <Row gutter={[24, 24]} justify="start">
              {uniqueProducts.map((product) => (
                <Col
                  key={product.id}
                  xs={24}   // 100% ширини на мобільних (1 в ряд)
                  sm={12}   // 50% ширини на планшетах (2 в ряд)
                  md={8}    // 33% ширини на ноутбуках (3 в ряд)
                  lg={6}    // 25% ширини на моніторах (4 в ряд)
                  xl={6}    // фіксуємо 4 в ряд навіть на дуже великих екранах
                >
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <p style={{ textAlign: 'center', marginTop: 50 }}>Товарів не знайдено</p>
        )}
      </div>
    </>
  );
};

export default ProductsPage;
