# Task Dashboard

A modern task management dashboard built with Django, Fomantic-UI, and DevExpress JS.

## Features

- **Intuitive Dashboard**: Get a quick overview of all your tasks with statistics and charts
- **Task Management**: Create, update, and delete tasks with a user-friendly interface
- **Categorization**: Organize tasks by categories with custom colors
- **Priority Levels**: Set priority levels from low to urgent
- **Status Tracking**: Track task status (pending, in progress, completed, canceled)
- **Due Dates**: Set and manage task deadlines with visual indicators for overdue tasks
- **Filtering & Sorting**: Easily find tasks with advanced filtering and sorting options
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Backend**: Django 5.2
- **Frontend**: 
  - Fomantic-UI for UI components and layout
  - DevExpress JS for interactive charts and data grid
  - jQuery for DOM manipulation and AJAX
  - LESS for CSS preprocessing
- **Data Visualization**: DevExpress charts for task distribution and timelines

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/task-dashboard.git
cd task-dashboard
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Install LESS (requires Node.js and npm):
```bash
npm install -g less
```

5. Compile LESS files:
```bash
lessc static/less/main.less static/css/main.css
```

6. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

7. Create initial categories (optional):
```bash
python manage.py shell
```
```python
from tasks.models import TaskCategory
TaskCategory.objects.create(name="Work", color="#3498db")
TaskCategory.objects.create(name="Personal", color="#2ecc71")
TaskCategory.objects.create(name="Education", color="#9b59b6")
TaskCategory.objects.create(name="Health", color="#e74c3c")
exit()
```

8. Create a superuser:
```bash
python manage.py createsuperuser
```

9. Run the development server:
```bash
python manage.py runserver
```

10. Access the application at http://127.0.0.1:8000/

## Usage

1. **Dashboard**: View task statistics, recent tasks, and upcoming deadlines
2. **Task List**: View, filter, and manage all tasks
3. **Create Task**: Add new tasks with details like title, description, category, etc.
4. **Edit Task**: Update task details and status
5. **Delete Task**: Remove tasks you no longer need

## Project Structure

```
task_dashboard/
├── manage.py
├── task_dashboard/         # Project settings and configuration
├── tasks/                  # Main app
│   ├── models.py           # Task and Category models
│   ├── views.py            # View functions 
│   ├── forms.py            # Form classes
│   └── urls.py             # URL patterns
├── templates/              # HTML templates
│   ├── base.html           # Base template with common layout
│   └── tasks/              # Task-specific templates
├── static/                 # Static files
│   ├── css/                # Compiled CSS files
│   ├── less/               # LESS source files
│   └── js/                 # JavaScript files
└── README.md               # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Django](https://www.djangoproject.com/) - The web framework used
- [Fomantic-UI](https://fomantic-ui.com/) - UI components
- [DevExpress JS](https://js.devexpress.com/) - Data visualization and grid components
- [jQuery](https://jquery.com/) - JavaScript library
- [LESS](http://lesscss.org/) - CSS preprocessor
