# Use the official .NET 10 SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["FancyStore.API/FancyStore.API.csproj", "FancyStore.API/"]
RUN dotnet restore "FancyStore.API/FancyStore.API.csproj"

# Copy the rest of the application code
COPY ["FancyStore.API/", "FancyStore.API/"]

# Set the working directory to the API project
WORKDIR "/src/FancyStore.API"

# Publish the application in Release mode
RUN dotnet publish "FancyStore.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use the official ASP.NET Core runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Copy the compiled output from the build stage
COPY --from=build /app/publish .

# Set up the environment variables for hosting
# Render will automatically map the required ports, but ASP.NET Core 8+ defaults to 8080
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Start the application
ENTRYPOINT ["dotnet", "FancyStore.API.dll"]
