from rest_framework import serializers
from .models import User, Formation, Module, Lesson, Enrollment
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password')

    # Dans ton RegisterSerializer
    def create(self, validated_data):
        # On crée l'utilisateur en utilisant l'email comme 'username'
        user = User.objects.create_user(
            username=validated_data['email'], # On définit le username avec l'email
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
    
# 1. Serializer pour les infos minimales de l'utilisateur
class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'is_admin']

# 2. Serializer pour les Leçons (Très important pour le CoursePlayer !)
class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'video_url', 'order']

from .models import Module as FormationModule # On le renomme pour éviter les conflits

class ModuleSerializer(serializers.ModelSerializer):
    # 'lessons' doit être le related_name dans ton modèle Lesson
    lessons = LessonSerializer(many=True, read_only=True) 

    class Meta:
        model = Module
        fields = ['id', 'title', 'order', 'formation', 'lessons'] # <--- Ajoute 'lessons' ici

class FormationSerializer(serializers.ModelSerializer):
    # CRUCIAL : 'modules' doit correspondre au related_name dans ton modèle Module
    modules = ModuleSerializer(many=True, read_only=True)
    class Meta:
        model = Formation
        fields = ['id', 'title', 'modules', 'cover_image']

# 4. Version allégée de la Formation (pour ne pas surcharger le Dashboard)
class DashboardFormationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formation
        fields = ['id', 'title', 'cover_image']

# 5. Serializer pour les Inscriptions (Dashboard)
class EnrollmentSerializer(serializers.ModelSerializer):
    formation = DashboardFormationSerializer(read_only=True)
    user_details = UserMiniSerializer(source='user', read_only=True) 

    class Meta:
        model = Enrollment
        fields = ['id', 'formation', 'user_details', 'progress_percentage', 'is_completed', 'enrolled_at']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # On ajoute les infos personnalisées dans le Token
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['is_admin'] = user.is_admin
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # On ajoute les infos dans la réponse JSON directe pour React
        data['user'] = {
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'email': self.user.email,
            'is_admin': self.user.is_admin,
        }
        return data

# serializers.py
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'is_admin'] # <--- IS_ADMIN DOIT ÊTRE ICI
        
