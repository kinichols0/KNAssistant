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

    public spinnerConfig: any = {
        bdColor: "rgba(255,255,255,0.8)",
        size: "medium",
        color: "#000000",
        type: "ball-beat",
        loadingText: 'Loading tasks using a loader...'
    };

    constructor(private taskService: TaskService, private $log: LogService) 
    { }

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks(): void {
        this.toggleTaskLoading(true);
        this.taskService.getTasks().subscribe(response => {
            this.tasks = response.body;
            this.toggleTaskLoading(false);
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

    toggleTaskLoading(show: boolean): void {
        if(show){
            this.loadingTasks = true;            
        } else {
            this.loadingTasks = false;
        }
    }

    addTask(): void {
        this.showSavingState();
        if (this.taskText.trim() != '') {
            let task: TaskItem = new TaskItem();
            task.taskText = this.taskText;
            task.done = false;
            this.taskService.createTask(task).subscribe(response => {
                this.closeAddTask();
                this.loadTasks();
            });
            return;
        }
        this.closeAddTask();
    }

    deleteTask(task: TaskItem): void {
        this.taskService.deleteTask(task.id).subscribe(response => {
            this.loadTasks();
        });
    }
}
