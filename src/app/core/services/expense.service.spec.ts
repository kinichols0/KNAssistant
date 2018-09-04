import { TestBed, async, inject } from '@angular/core/testing';
import { } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Response, ResponseOptions, Headers, ConnectionBackend, Http, Connection, 
    XHRBackend, 
    RequestOptions} from '@angular/http';

import { ExpenseService } from './expense.service';
import { BaseLogService } from '../models/base-log-service.model';
import { LogService } from './log.service';
import { Expense } from '../models/expense.model';

describe('Expense service', () => {
    let service: ExpenseService;
    let httpClient: HttpClient;
    let httpTestingCtrl: HttpTestingController;
    let $log: LogService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [
                { provide: BaseLogService, use: LogService },
                { provide: APP_BASE_HREF, useValue: "/" },
                ExpenseService
            ]
        });

        $log = TestBed.get(LogService);
        service = TestBed.get(ExpenseService);
        httpTestingCtrl = TestBed.get(HttpTestingController);
    }));

    it('should return Expenses for successful GET request', async(() => {
        const mockData: Expense[] = [
            { expenseId: '1', expenseName: 'Mortgage', expenseCost: 750 },
            { expenseId: '2', expenseName: 'BGE', expenseCost: 150 }
        ];

        service.getExpenses().subscribe(response => {
            console.log(response.body);
            expect(response.body.length).toBe(2);
        });

        const req = httpTestingCtrl.expectOne('/api/expense', 'call to /api/expense');

        expect(req.request.method).toBe('GET');

        req.flush({
            body: JSON.stringify(mockData),
            status: 200,
            statusText: 'OK'
        });

        httpTestingCtrl.verify();
    }));
});