# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY fancy-store-client/package*.json ./
RUN npm install
COPY fancy-store-client/ ./
RUN npm run build

# Stage 2: Build the ASP.NET Core backend
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /src
COPY ["FancyStore.API/FancyStore.API.csproj", "FancyStore.API/"]
RUN dotnet restore "FancyStore.API/FancyStore.API.csproj"
COPY ["FancyStore.API/", "FancyStore.API/"]
WORKDIR "/src/FancyStore.API"
RUN dotnet publish "FancyStore.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Serve the combined application
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=backend-build /app/publish .
# Copy the built React app into the wwwroot folder of the ASP.NET Core API
COPY --from=frontend-build /frontend/dist ./wwwroot

EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "FancyStore.API.dll"]
