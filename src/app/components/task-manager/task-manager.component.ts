import { Component, OnInit, Input } from '@angular/core';
import { TaskItem } from '../../core/models/task-item.model';
import { TaskService } from '../../core/services/task.service';
import { ViewMode } from '../../core/enums/view-mode.enum';
import { BaseLogService } from '../../core/models/base-log-service.model';
import { TaskStatus } from '../../core/enums/task-status.enum';

@Component({
  selector: 'task-manager',
  templateUrl: './task-manager.component.html'
})
export class TaskManagerComponent implements OnInit {
    @Input() isReadOnly: boolean = false;
    @Input() viewMode: ViewMode = ViewMode.Page;

    taskText: string = '';
    showAddTaskDisplay: boolean = false;
    addTaskBtnText: string = "Add";
    loadingTasks: boolean = true;
    taskViewItems: any[] = [];
    disableAddTask: boolean = false;

    taskStatus = TaskStatus;
    statusOptions: any[] = [
        { Text: "Not Started", Value: TaskStatus.NotStarted },
        { Text: "In Progress", Value: TaskStatus.InProgress },
        { Text: "Completed", Value: TaskStatus.Completed }
    ];

    constructor(private taskService: TaskService, private $log: BaseLogService) { }

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks(): void {
        this.toggleTaskLoading(true);
        this.taskService.getTasks().subscribe(response => {
            this.setTaskListItems(response.body);
            this.toggleTaskLoading(false);
        });
    };

    toggleTaskLoading(show: boolean): void {
        if(show){
            this.loadingTasks = true;            
        } else {
            this.loadingTasks = false;
        }
    }

    addTask(): void {
        if (this.taskText.trim() == '') return;

        this.disableAddTask = true;
        this.addTaskBtnText = "Saving...";

        let task: TaskItem = new TaskItem();
        task.taskText = this.taskText;
        task.status = TaskStatus.NotStarted;
        
        this.taskService.createTask(task).subscribe(response => {
            this.disableAddTask = false;
            this.addTaskBtnText = "Add";
            this.taskText = "";
            this.loadTasks();
        });
    }

    deleteTask(task: TaskItem): void {
        this.taskService.deleteTask(task.id).subscribe(response => {
            this.loadTasks();
        });
    }

    showEditView(taskViewItem: any, index: number): void {
        taskViewItem.editBtnText = "Update";
        taskViewItem.disableEditInputs = false;
        taskViewItem.editText = taskViewItem.task.taskText;
        taskViewItem.editStatus = taskViewItem.task.status;
        taskViewItem.showActions = false;
        taskViewItem.showEditView = true;
    }

    saveEditView(taskViewItem: any, index: number): void {
        taskViewItem.disableEditInputs = true;
        taskViewItem.editBtnText = "Saving...";
        taskViewItem.task.taskText = taskViewItem.editText;
        taskViewItem.task.status = taskViewItem.editStatus;
        this.taskService.updateTask(taskViewItem.task).subscribe(response => {
            taskViewItem.task = response.body;
            this.hideEditView(taskViewItem, index);
        });
    }

    hideEditView(taskViewItem: any, index: number): void {
        taskViewItem.showEditView = false;
        taskViewItem.showActions = true;
    }

    setTaskListItems(tasks: TaskItem[]): any {
        this.taskViewItems = [];
        if(tasks && tasks.length > 0) {
            for(var i = 0; i < tasks.length; i++) {
                this.taskViewItems.push({
                    task: tasks[i],
                    editText: null,
                    editStatus: null,
                    showEditView: false,
                    showActions: true,
                    editBtnText: null,
                    disableEditInputs: false
                });
            }
        }
    }

    percentOfStatus(status: TaskStatus): number {
        let num: number = 0;
        if(this.taskViewItems && this.taskViewItems.length > 0) {
            let numberCompleted: number = this.taskViewItems.filter((item) => {
                return item.task.status == status;
            }).length;
            num = numberCompleted / this.taskViewItems.length;
        }
        return num;
    };
}
