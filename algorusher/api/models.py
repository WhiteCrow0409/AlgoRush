from django.db import models

class Question(models.Model):
    title = models.CharField(max_length=300, default="")  # 🔧 Added default
    problem_code = models.CharField(max_length=50, unique=True, default="")  # 🔧 Added default
    difficulty = models.CharField(
        max_length=20,
        choices=[
            ('Easy', 'Easy'),
            ('Medium', 'Medium'),
            ('Hard', 'Hard'),
        ],
        default='Easy'  # 🔧 Added default
    )
    description = models.TextField(default="")  # 🔧 Added default
    examples = models.JSONField(default=list)  # 🔧 Added default
    constraints = models.TextField(default="")
    tags = models.JSONField(default=list)
    hints = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.problem_code} - {self.title}"
