from django import forms
from .models import Task, TaskCategory


class TaskForm(forms.ModelForm):
    """Form for creating and updating tasks"""

    class Meta:
        model = Task
        fields = ['title', 'description', 'category', 'status', 'priority', 'due_date']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Enter task description'}),
            'due_date': forms.DateTimeInput(
                attrs={'class': 'datetime-picker', 'placeholder': 'Select due date'},
                format='%Y-%m-%d %H:%M'
            ),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Make the category field a ModelChoiceField with a queryset
        self.fields['category'].queryset = TaskCategory.objects.all()
        self.fields['category'].required = False

        # Add placeholders and classes
        self.fields['title'].widget.attrs.update({'placeholder': 'Enter task title'})

        # Make certain fields not required
        self.fields['due_date'].required = False