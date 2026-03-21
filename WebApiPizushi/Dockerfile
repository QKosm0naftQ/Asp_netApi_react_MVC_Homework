# Stage 1: Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

# 1. Копіюємо файл проекту. 
# Шлях вказано відносно Asp_netApi_react_MVC_Homework (бо це наш context)
COPY ["WebApiPizushi/WebApiPizushi/WebApiPizushi.csproj", "WebApiPizushi/WebApiPizushi/"]
RUN dotnet restore "WebApiPizushi/WebApiPizushi/WebApiPizushi.csproj"

# 2. Копіюємо всі інші файли (Core, Domain і т.д.)
COPY . .

# 3. Переходимо саме в папку з .csproj для публікації
WORKDIR "/source/WebApiPizushi/WebApiPizushi"
RUN dotnet publish -c Release -o /app

# Stage 2: Final image for runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Копіюємо зібраний додаток
COPY --from=build /app .

# Запускаємо (переконайся, що назва dll збігається)
ENTRYPOINT ["dotnet", "WebApiPizushi.dll"]
