import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Expense } from '../models/expense.model';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LogService } from '../models/log-service.model';
import { BaseService } from '../models/base-service.model';

@Injectable({
    providedIn: 'root',
})
export class ExpenseService extends BaseService {

    private url: string = "/api/expense";

    constructor(private http: HttpClient, public $log: LogService) { 
        super($log);
    }

    getExpenses(): Observable<HttpResponse<Expense[]>> {
        this.$log.info("Requesting expenses");
        return this.http.get<Expense[]>(this.url, {
            observe: "response"
        }).pipe(
            retry(2),
            catchError(this.handleError)
        );
    }

    createExpense(expense: Expense): Observable<HttpResponse<Expense>>{
        this.$log.info("Making request to create expense");
        return this.http.post<Expense>(this.url, expense, {
            observe: 'response',
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        }).pipe(catchError(this.handleError));
    }
}