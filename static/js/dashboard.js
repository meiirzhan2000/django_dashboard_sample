/**
 * Dashboard.js - Task Management Dashboard
 *
 * Enhances the dashboard functionality with interactive charts,
 * data visualization and user interactions.
 */

$(document).ready(function() {
    // Initialize all UI components
    initializeDashboard();

    // Add event listeners
    setupEventListeners();
});

/**
 * Initialize dashboard UI components
 */
function initializeDashboard() {
    // Initialize Fomantic-UI components
    $('.ui.dropdown').dropdown();
    $('.ui.accordion').accordion();

    // Initialize tooltips for elements with data-tooltip attribute
    $('[data-tooltip]').each(function() {
        $(this).popup({
            content: $(this).data('tooltip')
        });
    });

    // Add animation classes
    $('.ui.segment').addClass('fade-in');
    $('.ui.statistics .statistic').each(function(index) {
        $(this).css('animation-delay', (index * 0.1) + 's');
        $(this).addClass('fade-in');
    });

    // Responsive adjustments
    handleResponsiveLayout();
}

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
    // Task card click
    $('.task-item').on('click', function() {
        const taskId = $(this).data('task-id');
        showTaskDetails(taskId);
    });

    // Category filter
    $('.category-filter').on('click', function() {
        const categoryId = $(this).data('category-id');
        filterByCategory(categoryId);
    });

    // Window resize handler
    $(window).on('resize', function() {
        handleResponsiveLayout();
    });

    // Quick status update
    $('.status-update-dropdown').dropdown({
        onChange: function(value, text, $choice) {
            const taskId = $(this).data('task-id');
            updateTaskStatus(taskId, value);
        }
    });
}

/**
 * Show task details in a modal
 * @param {number} taskId - The ID of the task to display
 */
function showTaskDetails(taskId) {
    // In a real application, this would fetch task details via AJAX
    // For demo purposes, we'll simulate it
    $.ajax({
        url: `/api/tasks/${taskId}/`,
        method: 'GET',
        success: function(data) {
            // Populate modal with task data
            $('#task-modal-title').text(data.title);
            $('#task-modal-description').text(data.description);
            $('#task-modal-status').val(data.status);

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
 * Filter tasks by category
 * @param {number} categoryId - The category ID to filter by
 */
function filterByCategory(categoryId) {
    window.location.href = `/tasks/?category=${categoryId}`;
}

/**
 * Update task status
 * @param {number} taskId - The ID of the task to update
 * @param {string} status - The new status value
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
                message: 'Task status updated successfully'
            });

            // Refresh the card UI
            $(`[data-task-id="${taskId}"]`).find('.status-badge')
                .removeClass('pending in-progress completed canceled')
                .addClass(status)
                .text(status.replace('_', ' ').toUpperCase());
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
 * Handle responsive layout adjustments
 */
function handleResponsiveLayout() {
    const windowWidth = $(window).width();

    if (windowWidth < 768) {
        // Mobile adjustments
        $('.ui.statistics').removeClass('four').addClass('one');
        $('.dashboard-widget').parent().removeClass('eight').addClass('sixteen wide column');
    } else {
        // Desktop layout
        $('.ui.statistics').removeClass('one').addClass('four');
        $('.dashboard-widget').parent().removeClass('sixteen').addClass('eight wide column');
    }
}

/**
 * Format dates in a user-friendly way
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    if (!date) return 'No date';

    if (typeof date === 'string') {
        date = new Date(date);
    }

    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diff === 0) {
        return 'Today';
    } else if (diff === 1) {
        return 'Yesterday';
    } else if (diff > 1 && diff <= 7) {
        return `${diff} days ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}