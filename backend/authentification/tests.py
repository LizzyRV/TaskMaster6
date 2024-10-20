from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from authentification.models import User


#Validar la implementación del Login
class AuthAPITestCase(APITestCase):
    #Crea un usuario para las pruebas
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password = 'testpassword',
            nombre = 'prueba',
            apellido = 'prueba2'
        )
        self.login_url= reverse('token_obtain_pair') # Se asume que se está usando TokenObtainPairView. path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login

    def test_login_incorrecto_data_real(self):
        #Datos correctos para hacer login
        data = {
            'username': 'eliza',
            'password': '123456'
        }
        response = self.client.post(self.login_url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_correcto(self):
        #Datos correctos para hacer login
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post(self.login_url, data)

        #Verificar que el código de estado sea 200 Ok
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data) # Verifica que el token de acceso esté presente en la re
#Creará una base de datos exclusiva para hacer la prueba, falla con los datos reales porque él no los encontrará en la nueva base de datos
    
    def test_login_incorrecto(self):
        # Datos incorrectos para hacer login
        data = {
            'username': 'eliza',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, data)

        #Verificar que el código de estado sea 401 Unauthorized
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)