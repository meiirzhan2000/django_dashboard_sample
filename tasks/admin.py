from django.contrib import admin
from .models import Task, TaskCategory

@admin.register(TaskCategory)
class TaskCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'color')
    search_fields = ('name',)

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'priority', 'due_date', 'created_at')
    list_filter = ('status', 'priority', 'category')
    search_fields = ('title', 'description')
    date_hierarchy = 'created_at'