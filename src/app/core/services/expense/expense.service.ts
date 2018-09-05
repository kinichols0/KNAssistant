import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Expense } from '../../models/expense.model';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseLogService } from '../../models/base-log-service.model';
import { BaseService } from '../../models/base-service.model';

@Injectable({
    providedIn: 'root',
})
export class ExpenseService extends BaseService {

    private url: string = "/api/expense";
    readonly getRequestErrorMsg: string = 'Error requesting exenses.';
    readonly createExpenseErrorMsg: string = 'Error while creating expenses';

    constructor(private http: HttpClient, public $log: BaseLogService) { 
        super($log);
    }

    getExpenses(): Observable<HttpResponse<Expense[]>> {
        this.$log.debug("Expense GET service request");
        return this.http.get<Expense[]>(this.url, {
            observe: "response"
        }).pipe(
            retry(2),
            tap(response => {
                this.$log.debug("Response:");
                this.$log.debug(response);
            }),
            catchError((httpErrorResponse) => {
                return throwError(this.getRequestErrorMsg);
            })
        );
    }

    createExpense(expense: Expense): Observable<HttpResponse<Expense>> {
        this.$log.debug("Create expense service request");
        return this.http.post<Expense>(this.url, expense, {
            observe: 'response',
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        }).pipe(
            tap(response => {
                this.$log.debug("Response:");
                this.$log.debug(response);
            }),
            catchError((httpErrorResponse) => {
                return throwError(this.createExpenseErrorMsg);
            })
        );
    }

    updateExpense(expense: Expense): Observable<HttpResponse<Expense>> {
        this.$log.debug("Update expense service request.");
        return this.http.put<Expense>(this.url, expense, {
            observe: "response"
        }).pipe(
            tap(response => { 
                this.$log.debug("Response");
                this.$log.debug(response);
            }),
            catchError(this.handleError)
        );
    }

    deleteExpense(expense: Expense): Observable<HttpResponse<Expense>> {
        this.$log.debug("Delete expense service request");
        return this.http.delete<Expense>(this.url + `?id=${expense.expenseId}`, {
            observe: "response"
        }).pipe(
            tap(response => {
                this.$log.debug("Response:");
                this.$log.debug(response);
            }),
            catchError(this.handleError)
        );
    }
}