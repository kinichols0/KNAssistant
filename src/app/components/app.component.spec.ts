import { TestBed, async } from '@angular/core/testing';
import { RoutingModule } from '../app.module.routing';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from '../components/app.component';
import { TaskManagerComponent } from '../components/task-manager/task-manager.component';
import { NavigationBarComponent } from '../components/navigation-bar/navigation-bar.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { ExpenseManagerComponent } from '../components/expense-manager/expense-manager.component';
import { NotesManagerComponent } from '../components/notes-manager/notes-manager.component';
import { KnInMemeroryDbService } from '../core/services/kn-in-memory-db.service';

import { BaseLogService } from '../core/models/base-log-service.model';
import { LogService } from '../core/services/log.service';

describe('AppComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavigationBarComponent,
        TaskManagerComponent,
        DashboardComponent,
        ExpenseManagerComponent,
        NotesManagerComponent
      ],
      imports: [
        FormsModule,
        HttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(KnInMemeroryDbService, { dataEncapsulation: false }),
        RoutingModule,
        ChartsModule
      ],
      providers: [
        { provide: BaseLogService, useClass: LogService },
        { provide: APP_BASE_HREF, useValue : '/' }
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('KN Assistant');
  }));

  //it('should render title in a h1 tag', async(() => {
  //  const fixture = TestBed.createComponent(AppComponent);
  //  fixture.detectChanges();
  //  const compiled = fixture.debugElement.nativeElement;
  //  expect(compiled.querySelector('h1').textContent).toContain('Welcome to KN Assistant!');
  //}));

});
