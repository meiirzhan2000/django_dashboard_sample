from django.urls import path
from . import views

app_name = 'tasks'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('tasks/', views.task_list, name='task_list'),
    path('tasks/<int:task_id>/update-status/', views.update_task_status, name='update_task_status'),

    # Task form URLs
    path('tasks/new/', views.create_task, name='create_task'),
    path('tasks/<int:task_id>/edit/', views.update_task, name='update_task'),
    path('tasks/<int:task_id>/delete/', views.delete_task, name='delete_task'),

    # API endpoints
    path('api/categories/', views.api_categories, name='api_categories'),
]