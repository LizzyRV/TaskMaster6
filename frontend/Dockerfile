# Dockerfile del frontend

# Etapa 1: Construcción
FROM node:18 AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package*.json /app/

# Instalar dependencias
RUN npm install --production

# Copiar el resto del código del proyecto
COPY . /app

# Copiar el archivo de entorno (asegúrate de que existe)
COPY .env.docker /app/.env

# Compilar la aplicación
RUN npm run build

# Etapa 2: Servir la aplicación con una imagen más ligera
FROM node:18-slim
WORKDIR /app

# Copiar la carpeta 'build' del contenedor anterior
COPY --from=build /app/build /app/build

# Instalar 'serve' para servir la aplicación
RUN npm install -g serve

# Exponer el puerto 3000
EXPOSE 3000

# Comando para servir la aplicación
CMD ["serve", "-s", "build", "-l", "3000"]
