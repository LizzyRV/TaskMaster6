# Usar una imagen oficial de Python como imagen base
FROM python:3.11

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el archivo de dependencias (requirements.txt)
COPY requirements.txt /app/

# Instalar las dependencias del proyecto
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el contenido del proyecto al contenedor
COPY . /app

# Exponer el puerto 8000 para la aplicación Django
EXPOSE 8000

# Comando para ejecutar Gunicorn en producción
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
