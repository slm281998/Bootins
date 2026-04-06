from django.db import models

# import uuid
from django.contrib.auth.models import AbstractUser
import uuid, site

# 1. Gestion des Utilisateurs
# 1. Gestion des Utilisateurs
class User(AbstractUser):
    email = models.EmailField(unique=True)
    
    # Ajoute ce champ pour correspondre au Frontend React
    is_admin = models.BooleanField(default=False)
    
    # Tu peux garder le role si tu veux, mais is_admin est plus simple pour les permissions DRF
    ROLE_CHOICES = (
        ('ADMIN', 'Administrateur'),
        ('LEARNER', 'Apprenant'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='LEARNER')
    
    USERNAME_FIELD = 'email'
    # 'email' est déjà dans USERNAME_FIELD, on l'enlève de REQUIRED_FIELDS
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def save(self, *args, **kwargs):
        # Logique auto : si is_admin est vrai, le rôle devient ADMIN
        if self.is_admin:
            self.role = 'ADMIN'
            self.is_staff = True # Pour qu'il puisse aussi accéder au /admin de Django
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

# 2. Structure Pédagogique
class Formation(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    cover_image = models.ImageField(upload_to='formations/covers/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Module(models.Model):
    formation = models.ForeignKey(Formation, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(help_text="Ordre d'affichage du module")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.formation.title} - {self.title}"

class Lesson(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    content = models.TextField(help_text="Texte avec éditeur simple")
    video_url = models.URLField(blank=True, null=True, help_text="Lien YouTube ou Vimeo") 
    order = models.PositiveIntegerField(help_text="Ordre d'affichage de la leçon")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

# 3. Suivi de Progression
class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    formation = models.ForeignKey(Formation, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)
    progress_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    class Meta:
        unique_together = ('user', 'formation')

    def __str__(self):
        return f"{self.user.email} - {self.formation.title}"

class LessonProgress(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='lesson_progresses')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('enrollment', 'lesson')

# 4. Certificats
class Certificate(models.Model):
    enrollment = models.OneToOneField(Enrollment, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True) # Token unique infalsifiable [cite: 473]
    issued_at = models.DateTimeField(auto_now_add=True)
    pdf_file = models.FileField(upload_to='certificates/', null=True, blank=True)

    def __str__(self):
        return f"Certificat - {self.enrollment.user.email} - {self.enrollment.formation.title}"
