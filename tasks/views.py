from django.shortcuts import render
from django.db.models import Count, Case, When, IntegerField
from django.utils import timezone
from .models import Task, TaskCategory


def dashboard(request):
    """View for the dashboard page"""
    # Get task statistics
    task_stats = {
        'total': Task.objects.count(),
        'pending': Task.objects.filter(status='pending').count(),
        'in_progress': Task.objects.filter(status='in_progress').count(),
        'completed': Task.objects.filter(status='completed').count(),
        'overdue': Task.objects.filter(due_date__lt=timezone.now()).exclude(status='completed').count(),
    }

    # Get task categories with counts
    categories = TaskCategory.objects.annotate(
        task_count=Count('task'),
        pending_count=Count(
            Case(
                When(task__status='pending', then=1),
                output_field=IntegerField()
            )
        )
    )

    # Get recent tasks
    recent_tasks = Task.objects.exclude(status='completed').order_by('-created_at')[:5]

    # Get upcoming due tasks
    upcoming_tasks = Task.objects.exclude(status__in=['completed', 'canceled']).filter(
        due_date__gte=timezone.now()
    ).order_by('due_date')[:5]

    context = {
        'task_stats': task_stats,
        'categories': categories,
        'recent_tasks': recent_tasks,
        'upcoming_tasks': upcoming_tasks,
    }

    return render(request, 'tasks/dashboard.html', context)


def api_categories(request):
    """API endpoint to get categories with counts"""
    categories = TaskCategory.objects.annotate(
        task_count=Count('task')
    ).values('id', 'name', 'color', 'task_count')

    from django.http import JsonResponse
    return JsonResponse(list(categories), safe=False)