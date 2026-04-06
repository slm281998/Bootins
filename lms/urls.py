from django.urls import path
from .views import (
    FormationListView, FormationDetailView, MyTokenObtainPairView, 
    CompleteLessonView, RegisterView, DashboardView, 
    EnrollView, DownloadCertificateView, UserProfileView,
    UserListView, ChangeUserRoleView, LessonCreateView, 
    UserDeleteView, ModuleCreateView, AdminUserCreateView, UserUpdateView, chatbot_response # <--- On importe les vues Admin
)

urlpatterns = [
    # AUTHENTIFICATION
    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('user/profile/', UserProfileView.as_view(), name='user_profile'),
    path('user/dashboard/', DashboardView.as_view(), name='user_dashboard'),
    path('formations/', FormationListView.as_view(), name='formation_list'),
    path('formations/<int:pk>/', FormationDetailView.as_view(), name='formation_detail'),
    path('formations/<int:pk>/enroll/', EnrollView.as_view(), name='enroll_formation'),
    path('lessons/<int:lesson_id>/complete/', CompleteLessonView.as_view(), name='complete_lesson'),
    path('enrollment/<int:enrollment_id>/certificate/', DownloadCertificateView.as_view(), name='download_certificate'),
    path('chatbot/', chatbot_response, name='chatbot'),

    # --- ROUTES ADMINISTRATION ---
    path('admin/users/', UserListView.as_view(), name='admin_user_list'),
    path('admin/users/<int:pk>/role/', ChangeUserRoleView.as_view(), name='admin_change_role'),
    path('admin/lessons/create/', LessonCreateView.as_view(), name='admin_lesson_create'),
    path('admin/modules/create/', ModuleCreateView.as_view(), name='admin_module_create'),
    path('admin/users/create/', AdminUserCreateView.as_view(), name='admin_user_create'),
    path('admin/users/<int:pk>/update/', UserUpdateView.as_view(), name='admin_user_update'),
    path('admin/users/<int:pk>/delete/', UserDeleteView.as_view(), name='admin_user_delete'),
]