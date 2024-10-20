from rest_framework import serializers
from .models import Task, Category
from django.utils import timezone

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'user', 'created']
        read_only_fields = ['user', 'created']  #Lo tomaré del usuario autenticado 

class TaskSerializer(serializers.ModelSerializer):
    created = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    updated = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'expiration_date', 'priority', 'priority_display', 'status', 'category', 'user', 'created', 'updated']
        read_only_fields = ['user', 'created', 'updated']

    def validate_expiration_date(self, value):

        if value <= timezone.now():
            raise serializers.ValidationError("La fecha de vencimiento debe ser una fecha futura.")
        return value

    def create(self, validated_data):
        task = Task.objects.create(**validated_data)
        return task

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
