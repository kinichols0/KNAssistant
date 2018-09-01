import { Component } from '@angular/core';
import { TaskManagerComponent } from '../../components/task-manager/task-manager.component';
import { ExpenseManagerComponent } from '../../components/expense-manager/expense-manager.component';
import { ViewMode } from '../../core/enums/view-mode.enum';
@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent{
    title: string = 'KN Assistant';
    widgetViewMode: ViewMode = ViewMode.Widget;
}