# Generated by Django 5.2.3 on 2025-06-17 13:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_question_examples'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='solution_code',
            field=models.TextField(default='', help_text='Correct solution code for comparison'),
        ),
    ]
