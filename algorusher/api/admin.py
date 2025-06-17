from django.contrib import admin
from .models import Question

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("problem_code", "title", "difficulty")
    search_fields = ("title", "tags", "company_tags")
    list_filter = ("difficulty",)
