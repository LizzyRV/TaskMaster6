from django.urls import path
from .views import RegisterView, UserProfileView, ChangePasswordView, PasswordResetRequestView, PasswordResetCompleteView, PasswordResetConfirmView, LogoutView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView  


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
  
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('logout/', LogoutView.as_view(), name='logout'),
]


urlpatterns += [
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password-reset-complete/', PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]
