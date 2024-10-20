from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from authentification.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from taskmaster.models import Task, Category
from django.utils import timezone
from datetime import timedelta


class TaskAPITestCase(APITestCase):
    def setUp(self):

        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            nombre='prueba',
            apellido='prueba2'
        )

        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

  
        self.task_url = reverse('task-list-create')  
        self.category_url = reverse('category-list-create') 

        self.category = Category.objects.create(name="Trabajo", user=self.user)

    def test_crear_tarea(self):

        data = {
            "name": "Nueva Tarea",
            "description": "Descripción de la tarea",
            "expiration_date": (timezone.now() + timedelta(days=1)).isoformat(),
            "priority": "P",
            "status": "Pendiente",
            "category": self.category.id
        }
        response = self.client.post(self.task_url, data)
 
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 1)
        self.assertEqual(Task.objects.get().name, "Nueva Tarea")

    def test_crear_tarea_fecha_vencida(self):
  
        data = {
            "name": "Tarea con fecha pasada",
            "description": "Esta tarea debería fallar",
            "expiration_date": (timezone.now() - timedelta(days=1)).isoformat(),
            "priority": "P",
            "status": "Pendiente",
            "category": self.category.id
        }
        response = self.client.post(self.task_url, data, format='json')
        
      
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('expiration_date', response.data)

    def test_actualizar_tarea(self):
   
        task = Task.objects.create(
            user=self.user,
            name="Tarea a actualizar",
            description="Descripción inicial",
            expiration_date=timezone.now() + timedelta(days=1),
            priority="R",
            status="Pendiente",
            category=self.category
        )
        update_url = reverse('task-detail', kwargs={'pk': task.id})
        data = {
            "name": "Tarea Actualizada",
            "description": "Descripción actualizada",
            "expiration_date": (timezone.now() + timedelta(days=2)).isoformat(),
            "priority": "N",
            "status": "En progreso",
            "category": self.category.id
        }
        response = self.client.put(update_url, data)
       
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        task.refresh_from_db()
        self.assertEqual(task.name, "Tarea Actualizada")
        self.assertEqual(task.status, "En progreso")

    def test_eliminar_tarea(self):
       
        task = Task.objects.create(
            user=self.user,
            name="Tarea a eliminar",
            description="Esta tarea será eliminada",
            expiration_date=timezone.now() + timedelta(days=1),
            priority="R",
            status="Pendiente",
            category=self.category
        )
        delete_url = reverse('task-detail', kwargs={'pk': task.id})  
        response = self.client.delete(delete_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Task.objects.count(), 0)

    def test_crear_categoria(self):
   
        data = {
            "name": "Personal"
        }
        response = self.client.post(self.category_url, data)
    
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 2)  

    def test_filtrar_tareas_por_categoria(self):
      
        nueva_categoria = Category.objects.create(name="Hogar", user=self.user)
        Task.objects.create(
            user=self.user,
            name="Tarea del hogar",
            description="Tarea en la categoría Hogar",
            expiration_date=timezone.now() + timedelta(days=1),
            priority="N",
            status="Pendiente",
            category=nueva_categoria
        )
        
        response = self.client.get(self.task_url, {'category': nueva_categoria.id})
   
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['category'], nueva_categoria.id)
