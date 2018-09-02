import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskManagerComponent } from './components/task-manager/task-manager.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpenseManagerComponent } from './components/expense-manager/expense-manager.component';
import { NotesManagerComponent } from './components/notes-manager/notes-manager.component';

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'task-manager', component: TaskManagerComponent },
    { path: 'expense-manager', component: ExpenseManagerComponent },
    { path: 'notes-manager', component: NotesManagerComponent },
    { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports:[ RouterModule ]
})
export class RoutingModule { }