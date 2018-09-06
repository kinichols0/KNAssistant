import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { RoutingModule } from './app.module.routing';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './components/app.component';
import { TaskManagerComponent } from './components/task-manager/task-manager.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpenseManagerComponent } from './components/expense-manager/expense-manager.component';
import { NotesManagerComponent } from './components/notes-manager/notes-manager.component';
import { KnInMemeroryDbService } from './core/services/kn-in-memory-db.service';

import { BaseLogService } from './core/models/base-log-service.model';
import { LogService } from './core/services/log.service';

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
    RoutingModule,
    ChartsModule,
    NgbModule
  ],
  providers: [
    { provide: BaseLogService, useClass: LogService }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
