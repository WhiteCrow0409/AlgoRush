# Generated by Django 5.2.3 on 2025-06-17 07:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='link',
        ),
        migrations.AddField(
            model_name='question',
            name='constraints',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='question',
            name='description',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='question',
            name='examples',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='question',
            name='hints',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='question',
            name='problem_code',
            field=models.CharField(default='', max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='difficulty',
            field=models.CharField(choices=[('Easy', 'Easy'), ('Medium', 'Medium'), ('Hard', 'Hard')], default='Easy', max_length=20),
        ),
        migrations.AlterField(
            model_name='question',
            name='title',
            field=models.CharField(default='', max_length=300),
        ),
    ]
