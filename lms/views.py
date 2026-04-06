from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.http import FileResponse
from rest_framework_simplejwt.views import TokenObtainPairView
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor
from google import genai  # Nouvel import officiel 2026
from rest_framework.decorators import api_view, permission_classes
from .models import Formation, User, Module, Lesson, Enrollment, LessonProgress
from .serializers import (
    FormationSerializer, LessonSerializer, ModuleSerializer, RegisterSerializer, 
    EnrollmentSerializer, UserMiniSerializer
)

from rest_framework.decorators import api_view, permission_classes

# --- AUTHENTIFICATION ---

class MyTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        print(f"Tentative de connexion pour : {request.data.get('email')}")
        return super().post(request, *args, **kwargs)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "email": request.user.email,
            "is_admin": request.user.is_admin,
        })

# --- FORMATIONS ---

class FormationListView(generics.ListAPIView):
    queryset = Formation.objects.all()
    serializer_class = FormationSerializer

class FormationDetailView(generics.RetrieveAPIView):
    queryset = Formation.objects.all()
    serializer_class = FormationSerializer

class EnrollView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        formation = get_object_or_404(Formation, pk=pk)
        enrollment, created = Enrollment.objects.get_or_create(
            user=request.user, 
            formation=formation
        )
        return Response({"message": "Inscription réussie !"}, status=status.HTTP_201_CREATED)

# --- PROGRESSION ET LEÇONS ---

class CompleteLessonView(APIView):
    """
    Vue pour marquer une leçon comme terminée et mettre à jour la progression.
    Appelée par React via : api.post(`lessons/${id}/complete/`)
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, lesson_id):
        # 1. Récupérer la leçon
        lesson = get_object_or_404(Lesson, id=lesson_id)
        
        # 2. Récupérer l'inscription en passant par le module (Correction AttributeError)
        enrollment = get_object_or_404(
            Enrollment, 
            user=request.user, 
            formation=lesson.module.formation
        )
        
        # 3. Créer ou récupérer la progression de cette leçon
        progress, created = LessonProgress.objects.get_or_create(
            enrollment=enrollment,
            lesson=lesson
        )
        
        progress.is_completed = True
        progress.completed_at = timezone.now()
        progress.save()
        
        # 4. Mise à jour du pourcentage global
        # On compte toutes les leçons de TOUS les modules de la formation
        all_lessons = Lesson.objects.filter(module__formation=enrollment.formation)
        total_count = all_lessons.count()
        
        completed_count = LessonProgress.objects.filter(
            enrollment=enrollment, 
            is_completed=True
        ).count()
        
        if total_count > 0:
            percentage = (completed_count / total_count) * 100
            enrollment.progress_percentage = min(percentage, 100)
            if enrollment.progress_percentage >= 100:
                enrollment.is_completed = True
            enrollment.save()

        return Response({
            "status": "success", 
            "progress": enrollment.progress_percentage,
            "completed": enrollment.is_completed
        }, status=200)

class DashboardView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user)

# --- CERTIFICAT ---

class DownloadCertificateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, enrollment_id):
        enrollment = get_object_or_404(Enrollment, id=enrollment_id, user=request.user)
        
        if not enrollment.is_completed:
            return Response({"error": "Formation non terminée"}, status=400)

        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=landscape(A4))
        width, height = landscape(A4)

        # Design
        p.setStrokeColor(HexColor('#4F46E5'))
        p.setLineWidth(5)
        p.rect(1*cm, 1*cm, width-2*cm, height-2*cm)
        p.setFont("Helvetica-Bold", 40)
        p.drawCentredString(width/2, height - 5*cm, "CERTIFICAT DE RÉUSSITE")
        p.setFont("Helvetica", 20)
        p.drawCentredString(width/2, height - 8*cm, "Ce document atteste que")
        p.setFont("Helvetica-Bold", 30)
        p.drawCentredString(width/2, height - 10*cm, f"{request.user.first_name} {request.user.last_name}")
        p.setFont("Helvetica", 20)
        p.drawCentredString(width/2, height - 12*cm, "a complété avec succès la formation :")
        p.setFont("Helvetica-Oblique", 24)
        p.drawCentredString(width/2, height - 14*cm, f"« {enrollment.formation.title} »")
        p.setFont("Helvetica", 12)
        p.drawString(3*cm, 3*cm, f"Délivré le : {timezone.now().strftime('%d/%m/%Y')}")
        p.drawRightString(width - 3*cm, 3*cm, "L'équipe pédagogique BOOTINS")

        p.showPage()
        p.save()
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename=f"Certificat_{enrollment.formation.title}.pdf")

# --- ADMINISTRATION ---

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserMiniSerializer
    permission_classes = [IsAdminUser]

class ChangeUserRoleView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.is_admin = request.data.get('is_admin', user.is_admin)
        user.save()
        return Response({"message": "Rôle mis à jour"})

class LessonCreateView(generics.CreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAdminUser]

# lms/views.py

class UserDeleteView(APIView):
    permission_classes = [IsAdminUser] # Sécurité : Seul un admin peut supprimer

    def delete(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        
        # Empêcher un admin de se supprimer lui-même par erreur
        if user == request.user:
            return Response(
                {"error": "Vous ne pouvez pas supprimer votre propre compte depuis ici."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        user.delete()
        return Response({"message": "Utilisateur supprimé avec succès"}, status=status.HTTP_200_OK)

# Vue pour créer un module lié à une formation
class ModuleCreateView(generics.CreateAPIView):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [IsAdminUser]

# Vue pour créer un utilisateur (Admin)
class AdminUserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer # On réutilise le serializer d'inscription
    permission_classes = [IsAdminUser]

# Vue pour modifier un utilisateur
class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserMiniSerializer # Ou un serializer dédié à l'édition
    permission_classes = [IsAdminUser]
    
# Remplace par ta clé API de Google AI Studio
client = genai.Client(api_key="AIzaSyBic2QEZAHmvy3jkPssEezMIV_wR9tFen4")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chatbot_response(request):
    user_message = request.data.get('message')
    
    if not user_message:
        return Response({"error": "Message vide"}, status=400)

    try:
        # ---- CES LIGNES DOIVENT ÊTRE DÉCALÉES ----
        response = client.models.generate_content(
            model="gemini-2.0-flash", 
            contents=user_message
        )
        return Response({"reply": response.text})
        # ------------------------------------------
        
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg:
            # Message sympa pour le jury/l'utilisateur
            reply = "Je reçois trop de messages d'un coup ! 🤯 Attends 30 secondes et repose-moi ta question."
        else:
            reply = "Désolé, je rencontre une petite fatigue technique."
        
        return Response({"reply": reply}, status=200)