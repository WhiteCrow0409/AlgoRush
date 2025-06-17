from django.db import models

class Question(models.Model):
    title = models.CharField(max_length=300, default="")
    problem_code = models.CharField(max_length=50, unique=True, default="")
    difficulty = models.CharField(
        max_length=20,
        choices=[
            ('Easy', 'Easy'),
            ('Medium', 'Medium'),
            ('Hard', 'Hard'),
        ],
        default='Easy'
    )
    description = models.TextField(default="")
    examples = models.JSONField(default=list)
    constraints = models.TextField(default="")
    tags = models.JSONField(default=list)
    hints = models.TextField(blank=True, null=True)
    solution_code = models.TextField(default="", help_text="Correct solution code for comparison")

    def __str__(self):
        return f"{self.problem_code} - {self.title}"
