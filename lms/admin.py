from django.contrib import admin
from .models import User, Formation, Module, Lesson, Enrollment, LessonProgress, Certificate

# Enregistrement simple de tous les modèles
admin.site.register(User)
admin.site.register(Formation)
admin.site.register(Module)
admin.site.register(Lesson)
admin.site.register(Enrollment)
admin.site.register(LessonProgress)
admin.site.register(Certificate)