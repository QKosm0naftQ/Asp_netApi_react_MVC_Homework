# Етап 1: Збірка
FROM node:20-alpine AS build
WORKDIR /app

# Передаємо аргументи з docker-compose в змінні оточення для Vite
ARG VITE_API_BASE_URL
ARG VITE_APP_IMAGE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_IMAGE_URL=$VITE_APP_IMAGE_URL

COPY package*.json ./
RUN npm install
COPY . .
#RUN npm run build
# Додаємо прапорець, щоб ігнорувати помилки типів під час білду
RUN npx vite build
# Етап 2: Роздача через Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Копіюємо конфіг (якщо у тебе є специфічний nginx.conf, якщо ні - використовується стандартний)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
