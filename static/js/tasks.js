/**
 * Tasks.js - Task Management System
 *
 * Provides functionality for task list, filtering,
 * sorting and task operations.
 */

$(document).ready(function() {
    // Initialize components
    initializeTaskComponents();

    // Add event listeners
    setupTaskEventListeners();
});

/**
 * Initialize task-related UI components
 */
function initializeTaskComponents() {
    // Initialize Fomantic-UI dropdowns
    $('.ui.dropdown').dropdown();

    // Initialize date pickers
    $('.date-picker').each(function() {
        $(this).calendar({
            type: 'date',
            formatter: {
                date: function(date) {
                    if (!date) return '';
                    return date.toLocaleDateString('en-US');
                }
            }
        });
    });

    // Initialize tooltips
    $('[data-tooltip]').popup();

    // Initialize checkboxes
    $('.ui.checkbox').checkbox();

    // Add visual effects
    $('.task-item').addClass('fade-in');
}

/**
 * Set up task-related event listeners
 */
function setupTaskEventListeners() {
    // Task item selection
    $('.task-item').on('click', function(e) {
        if (!$(e.target).hasClass('task-action')) {
            const taskId = $(this).data('task-id');
            viewTaskDetails(taskId);
        }
    });

    // Task filter form submission
    $('#task-filter-form').on('submit', function(e) {
        e.preventDefault();
        applyTaskFilters();
    });

    // Task status quick update
    $('.status-dropdown').dropdown({
        onChange: function(value) {
            const taskId = $(this).closest('.task-item').data('task-id');
            updateTaskStatus(taskId, value);
        }
    });

    // Task priority quick update
    $('.priority-dropdown').dropdown({
        onChange: function(value) {
            const taskId = $(this).closest('.task-item').data('task-id');
            updateTaskPriority(taskId, value);
        }
    });

    // Task delete confirmation
    $('.delete-task-button').on('click', function() {
        const taskId = $(this).data('task-id');

        // Show confirmation modal
        $('#delete-confirmation-modal')
            .modal({
                closable: false,
                onApprove: function() {
                    deleteTask(taskId);
                }
            })
            .modal('show');
    });

    // Export tasks button
    $('#export-tasks-button').on('click', function() {
        exportTasks();
    });
}

/**
 * View task details
 * @param {number} taskId - The ID of the task to view
 */
function viewTaskDetails(taskId) {
    // In a real app, this would fetch task details via AJAX
    $.ajax({
        url: `/api/tasks/${taskId}/`,
        method: 'GET',
        success: function(data) {
            // Populate modal with task data
            $('#task-modal-title').text(data.title);
            $('#task-modal-description').text(data.description || 'No description');
            $('#task-modal-status').dropdown('set selected', data.status);
            $('#task-modal-priority').dropdown('set selected', data.priority);

            if (data.due_date) {
                const dueDate = new Date(data.due_date);
                $('#task-modal-due-date').val(dueDate.toISOString().split('T')[0]);
            } else {
                $('#task-modal-due-date').val('');
            }

            // Set task ID for form submission
            $('#edit-task-form').data('task-id', taskId);

            // Show modal
            $('#task-details-modal').modal('show');
        },
        error: function() {
            // Show error toast
            $('body').toast({
                class: 'error',
                message: 'Error loading task details'
            });
        }
    });
}

/**
 * Apply task filters based on form values
 */
function applyTaskFilters() {
    const status = $('#status-filter').val();
    const category = $('#category-filter').val();
    const priority = $('#priority-filter').val();
    const dateFrom = $('#date-from-filter').val();
    const dateTo = $('#date-to-filter').val();

    // Build query string
    let queryParams = [];
    if (status) queryParams.push(`status=${status}`);
    if (category) queryParams.push(`category=${category}`);
    if (priority) queryParams.push(`priority=${priority}`);
    if (dateFrom) queryParams.push(`date_from=${dateFrom}`);
    if (dateTo) queryParams.push(`date_to=${dateTo}`);

    // Redirect to filtered URL
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    window.location.href = `/tasks/${queryString}`;
}

/**
 * Update task status
 * @param {number} taskId - The ID of the task to update
 * @param {string} status - The new status
 */
function updateTaskStatus(taskId, status) {
    $.ajax({
        url: `/tasks/${taskId}/update-status/`,
        method: 'POST',
        data: {
            status: status,
            csrfmiddlewaretoken: document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        success: function() {
            // Show success toast
            $('body').toast({
                class: 'success',
                message: 'Task status updated'
            });

            // Update UI
            const statusDisplay = {
                'pending': 'Pending',
                'in_progress': 'In Progress',
                'completed': 'Completed',
                'canceled': 'Canceled'
            };

            const statusClass = {
                'pending': 'blue',
                'in_progress': 'yellow',
                'completed': 'green',
                'canceled': 'grey'
            };

            const $taskItem = $(`.task-item[data-task-id="${taskId}"]`);
            const $statusBadge = $taskItem.find('.status-badge');

            $statusBadge
                .removeClass('pending in-progress completed canceled')
                .addClass(status)
                .text(statusDisplay[status]);

            // If task is completed, apply visual feedback
            if (status === 'completed') {
                $taskItem.addClass('completed-task');
            } else {
                $taskItem.removeClass('completed-task');
            }
        },
        error: function() {
            // Show error toast
            $('body').toast({
                class: 'error',
                message: 'Error updating task status'
            });
        }
    });
}

/**
 * Update task priority
 * @param {number} taskId - The ID of the task to update
 * @param {number} priority - The new priority level
 */
function updateTaskPriority(taskId, priority) {
    $.ajax({
        url: `/api/tasks/${taskId}/update-priority/`,
        method: 'POST',
        data: {
            priority: priority,
            csrfmiddlewaretoken: document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        success: function() {
            // Show success toast
            $('body').toast({
                class: 'success',
                message: 'Task priority updated'
            });

            // Update UI
            const priorityDisplay = {
                '1': 'Low',
                '2': 'Medium',
                '3': 'High',
                '4': 'Urgent'
            };

            const priorityClass = {
                '1': 'grey',
                '2': 'blue',
                '3': 'orange',
                '4': 'red'
            };

            const priorityIcon = {
                '1': 'circle outline',
                '2': 'dot circle outline',
                '3': 'exclamation triangle',
                '4': 'exclamation circle'
            };

            const $taskItem = $(`.task-item[data-task-id="${taskId}"]`);
            const $priorityBadge = $taskItem.find('.priority-badge');
            const $priorityIcon = $taskItem.find('.priority-icon');

            $priorityBadge
                .removeClass('grey blue orange red')
                .addClass(priorityClass[priority])
                .text(priorityDisplay[priority]);

            $priorityIcon
                .removeClass('circle outline dot circle outline exclamation triangle exclamation circle')
                .addClass(priorityIcon[priority] + ' ' + priorityClass[priority]);
        },
        error: function() {
            // Show error toast
            $('body').toast({
                class: 'error',
                message: 'Error updating task priority'
            });
        }
    });
}

/**
 * Delete a task
 * @param {number} taskId - The ID of the task to delete
 */
function deleteTask(taskId) {
    $.ajax({
        url: `/api/tasks/${taskId}/`,
        method: 'DELETE',
        data: {
            csrfmiddlewaretoken: document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        success: function() {
            // Show success toast
            $('body').toast({
                class: 'success',
                message: 'Task deleted successfully'
            });

            // Remove from UI with animation
            $(`.task-item[data-task-id="${taskId}"]`)
                .fadeOut(300, function() {
                    $(this).remove();
                });
        },
        error: function() {
            // Show error toast
            $('body').toast({
                class: 'error',
                message: 'Error deleting task'
            });
        }
    });
}

/**
 * Export tasks in various formats
 */
function exportTasks() {
    // Show export options modal
    $('#export-options-modal')
        .modal({
            closable: false,
            onApprove: function() {
                const format = $('#export-format').val();
                const filters = window.location.search; // Get current filters

                // Redirect to export endpoint
                window.location.href = `/tasks/export/${format}/${filters}`;
            }
        })
        .modal('show');
}

/**
 * Format due date with visual indicators
 * @param {string} dateString - ISO date string
 * @return {string} Formatted HTML for the due date
 */
function formatDueDate(dateString) {
    if (!dateString) return 'No due date';

    const dueDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format date as Month Day, Year
    const formattedDate = dueDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // Check if overdue
    if (dueDate < today) {
        return `<span class="overdue-date"><i class="exclamation triangle icon"></i> ${formattedDate} (Overdue)</span>`;
    }

    // Check if due today
    if (dueDate.toDateString() === today.toDateString()) {
        return `<span class="due-today"><i class="calendar check icon"></i> Today</span>`;
    }

    // Check if due tomorrow
    if (dueDate.toDateString() === tomorrow.toDateString()) {
        return `<span class="due-tomorrow"><i class="calendar alternate icon"></i> Tomorrow</span>`;
    }

    return formattedDate;
}

/**
 * Calculate and display task statistics
 */
function updateTaskStatistics() {
    $.ajax({
        url: '/api/tasks/statistics/',
        method: 'GET',
        success: function(data) {
            // Update statistics counters
            $('#total-tasks-counter').text(data.total);
            $('#pending-tasks-counter').text(data.pending);
            $('#in-progress-tasks-counter').text(data.in_progress);
            $('#completed-tasks-counter').text(data.completed);
            $('#overdue-tasks-counter').text(data.overdue);

            // Update completion rate
            const completionRate = data.total > 0 ?
                Math.round((data.completed / data.total) * 100) : 0;

            $('#completion-rate-progress')
                .progress('set percent', completionRate)
                .find('.progress').text(completionRate + '%');
        }
    });
}