from rest_framework import serializers
from .models import User
from django.contrib.auth import get_user_model
#from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email','nombre', 'apellido']
        read_only_fields = ['username'] 

#Registrar los campos que se le van a solicitar al usuario
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['nombre', 'apellido','username', 'email', 'password',]
        extra_kwargs = {'password': {'write_only': True}}
    #Campos necesarios para crear el usuario
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            nombre=validated_data.get('nombre', ''),
            apellido=validated_data.get('apellido', '')
        )
        return user
#Cambiar el password
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate(self, data):
        user = self.context['request'].user
        if not user.check_password(data['old_password']):
            raise serializers.ValidationError({"old_password": "Incorrecta"})
        return data
    
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        # Verificar si el correo existe en la base de datos
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No hay ningún usuario con este correo.")
        return value
    
class SetNewPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return data

    def save(self, user):
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user