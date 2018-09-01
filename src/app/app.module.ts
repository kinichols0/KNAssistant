import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { RoutingModule } from './app.module.routing';

import { AppComponent } from './components/app.component';
import { TaskManagerComponent } from './components/task-manager/task-manager.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpenseManagerComponent } from './components/expense-manager/expense-manager.component';
import { NotesManagerComponent } from './components/notes-manager/notes-manager.component';
import { KnInMemeroryDbService } from './core/services/kn-in-memory-db.service';

import { LogService } from './core/models/log-service.model';
import { LoggerService } from './core/services/logger.service';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    TaskManagerComponent,
    DashboardComponent,
    ExpenseManagerComponent,
    NotesManagerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(KnInMemeroryDbService, { dataEncapsulation: false }),
    RoutingModule
  ],
  providers: [
    { provide: LogService, useClass: LoggerService }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
