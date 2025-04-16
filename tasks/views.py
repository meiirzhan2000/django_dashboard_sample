from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib import messages
from django.views.decorators.http import require_POST
from django.utils import timezone
from django.db.models import Count, Case, When, IntegerField
from .models import Task, TaskCategory
from .forms import TaskForm


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


def task_list(request):
    """View for listing and filtering tasks"""
    # Filter parameters
    status = request.GET.get('status', None)
    category = request.GET.get('category', None)
    priority = request.GET.get('priority', None)

    # Base queryset
    tasks = Task.objects.all()

    # Apply filters
    if status:
        tasks = tasks.filter(status=status)
    if category:
        tasks = tasks.filter(category_id=category)
    if priority:
        tasks = tasks.filter(priority=priority)

    # Get all categories for the filter dropdown
    categories = TaskCategory.objects.all()

    context = {
        'tasks': tasks.order_by('-priority', 'due_date'),
        'categories': categories,
        'status_choices': Task.STATUS_CHOICES,
        'priority_choices': Task.PRIORITY_CHOICES,
        'selected_status': status,
        'selected_category': category,
        'selected_priority': priority,
    }

    return render(request, 'tasks/task_list.html', context)


@require_POST
def update_task_status(request, task_id):
    """View for updating task status via AJAX"""
    task = get_object_or_404(Task, id=task_id)
    new_status = request.POST.get('status')

    if new_status in dict(Task.STATUS_CHOICES):
        task.status = new_status
        task.save()
        return JsonResponse({'success': True, 'new_status': new_status})

    return JsonResponse({'success': False, 'error': 'Invalid status'}, status=400)


def create_task(request):
    """View for creating a new task"""
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)

            # Handle the "no due date" checkbox
            if request.POST.get('no_due_date'):
                task.due_date = None

            task.save()
            messages.success(request, f'Task "{task.title}" created successfully!')
            return redirect('tasks:task_list')
    else:
        form = TaskForm()

    # Get all categories for the dropdown
    categories = TaskCategory.objects.all()

    context = {
        'form': form,
        'categories': categories,
        'status_choices': Task.STATUS_CHOICES,
        'priority_choices': Task.PRIORITY_CHOICES,
    }

    return render(request, 'tasks/task_form.html', context)


def update_task(request, task_id):
    """View for updating an existing task"""
    task = get_object_or_404(Task, id=task_id)

    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            task = form.save(commit=False)

            # Handle the "no due date" checkbox
            if request.POST.get('no_due_date'):
                task.due_date = None

            task.save()
            messages.success(request, f'Task "{task.title}" updated successfully!')
            return redirect('tasks:task_list')
    else:
        form = TaskForm(instance=task)

    # Get all categories for the dropdown
    categories = TaskCategory.objects.all()

    context = {
        'form': form,
        'task': task,
        'categories': categories,
        'status_choices': Task.STATUS_CHOICES,
        'priority_choices': Task.PRIORITY_CHOICES,
    }

    return render(request, 'tasks/task_form.html', context)


def delete_task(request, task_id):
    """View for deleting a task"""
    task = get_object_or_404(Task, id=task_id)

    if request.method == 'POST':
        task_title = task.title
        task.delete()
        messages.success(request, f'Task "{task_title}" deleted successfully!')
        return redirect('tasks:task_list')

    # If not POST, redirect to task list
    return redirect('tasks:task_list')


def api_categories(request):
    """API endpoint to get categories with counts"""
    categories = TaskCategory.objects.annotate(
        task_count=Count('task')
    ).values('id', 'name', 'color', 'task_count')

    return JsonResponse(list(categories), safe=False)