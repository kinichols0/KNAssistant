import { Component, OnInit, Input } from '@angular/core';
import { TaskItem } from '../../core/models/task-item.model';
import { TaskService } from '../../core/services/task.service';
import { ViewMode } from '../../core/enums/view-mode.enum';
import { LogService } from '../../core/models/log-service.model';

@Component({
  selector: 'task-manager',
  templateUrl: './task-manager.component.html'
})
export class TaskManagerComponent implements OnInit {
    @Input() isReadOnly: boolean = false;
    @Input() viewMode: ViewMode = ViewMode.Page;

    tasks: TaskItem[] = [];
    taskText: string = '';
    showAddTaskDisplay: boolean = false;
    updateTaskBtnText: string;
    updateTaskBtnDisabled: boolean;
    loadingTasks: boolean = true;

    constructor(private taskSvc: TaskService, private $log: LogService) 
    { }

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks(): void {
        this.loadingTasks = true;
        this.taskSvc.getTasks().subscribe(response => {
            this.tasks = response.body;
            this.loadingTasks = false;
        });
    };

    showAddTask(): void {
        this.updateTaskBtnText = "Add";
        this.updateTaskBtnDisabled = false;
        this.showAddTaskDisplay = true;
    }

    closeAddTask(): void {
        this.taskText = '';
        this.showAddTaskDisplay = false;
    }

    showSavingState(): void {
        this.updateTaskBtnDisabled = true;
        this.updateTaskBtnText = "Saving...";
    }

    addTask(): void {
        this.showSavingState();
        if (this.taskText.trim() != '') {
            let task: TaskItem = new TaskItem();
            task.taskText = this.taskText;
            task.done = false;
            this.taskSvc.createTask(task).subscribe(response => {
                this.closeAddTask();
                this.loadTasks();
            });
            return;
        }
        this.closeAddTask();
    }
}
