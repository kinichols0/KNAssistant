import { TestBed, async, inject } from '@angular/core/testing';
import { } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Response, ResponseOptions, Headers, ConnectionBackend, Http, Connection, 
    XHRBackend, 
    RequestOptions} from '@angular/http';

import { ExpenseService } from './expense.service';
import { BaseLogService } from '../../models/base-log-service.model';
import { LogService } from '../log.service';
import { Expense } from '../../models/expense.model';

describe('Expense service', () => {
    let service: ExpenseService;
    let httpClient: HttpClient;
    let httpTestingCtrl: HttpTestingController;
    let $log: LogService;

    beforeEach(async(() => {
        // Testing module, test version of NgModule
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [
                { provide: BaseLogService, use: LogService },
                { provide: APP_BASE_HREF, useValue: "/" },
                ExpenseService
            ]
        });

        // Set dependencies for reference
        $log = TestBed.get(LogService);
        service = TestBed.get(ExpenseService);
        httpTestingCtrl = TestBed.get(HttpTestingController);
    }));

    describe('GET requests', ()=> {

        it('should return Expenses and status 200 Ok on success', async(() => {
            // Mock data to return
            const mockData: Expense[] = [
                { expenseId: '1', expenseName: 'Mortgage', expenseCost: 750 },
                { expenseId: '2', expenseName: 'BGE', expenseCost: 150 }
            ];
    
            // Subscribe the getExpenses observable
            service.getExpenses().subscribe(response => {
                expect(response.body.length).toBe(2);
                expect(response.status).toEqual(200);
                expect(response.statusText).toEqual('Ok');
            });
    
            // Verify one call was made the service and that it was a GET
            const req = httpTestingCtrl.expectOne('/api/expense', 'call to /api/expense');
            expect(req.request.method).toBe('GET');
    
            // Respond with mock data causing observable to resolve
            req.flush(mockData, { status: 200, statusText: 'Ok' });
    
            // Asert there are no outstanding requests
            httpTestingCtrl.verify();
        }));
    
        it('should return error message on 500 status', async(() => {
            service.getExpenses().subscribe(response => {
                fail('should have failed');
            }, (error: HttpErrorResponse) => {
                expect(error.status).toEqual(500);
                expect(error.error).toEqual(service.getRequestErrorMsg);
            });
    
            const req = httpTestingCtrl.expectOne('/api/expense', 'call to /api/expense');
            expect(req.request.method).toBe('GET');
    
            // Respond with mock error
            req.flush(service.getRequestErrorMsg, { status: 500, statusText: 'Internal Server Error'});
        }));

        it('should return error message on 404 status', async(() => {
            service.getExpenses().subscribe(response => {
                fail('should have failed');
            }, (error: HttpErrorResponse) => {
                expect(error.status).toEqual(404);
                expect(error.error).toEqual(service.getRequestErrorMsg);
            });
    
            const req = httpTestingCtrl.expectOne('/api/expense', 'call to /api/expense');
            expect(req.request.method).toBe('GET');
    
            // Respond with mock error
            req.flush(service.getRequestErrorMsg, { status: 404, statusText: 'Not Found'});
        }));
    });
    
});