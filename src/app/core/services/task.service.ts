import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TaskItem } from '../models/task-item.model';
import { MessageService } from './message.service';
import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { LogService } from '../models/log-service.model';
import { map, catchError, retry, tap } from 'rxjs/operators';
import { BaseService } from '../models/base-service.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService extends BaseService {

    private url: string = "/api/task";

    constructor(private http: HttpClient, private msgSvc: MessageService, public $log: LogService) { 
        super($log);
    }

    getTasks(): Observable<HttpResponse<TaskItem[]>> {
        this.$log.info('Get tasks request');
        return this.http.get<TaskItem[]>(this.url, {
            observe: 'response'
        }).pipe(
            retry(2),
            tap(response => { 
                this.$log.info("Get task response:");
                this.$log.info(response);
                this.$log.info("Http status: " + response.status + " " + response.statusText);
            }),
            catchError(this.handleError)
        );
    }

    createTask(taskItem: TaskItem): Observable<HttpResponse<TaskItem>> {
        this.$log.info("Inserting Task:");
        this.$log.info(taskItem);
        return this.http.post<TaskItem>(this.url, taskItem, { 
            observe: 'response',
            headers: new HttpHeaders({ 
                'Content-Type': 'application/json' 
            })
        }).pipe(
            tap(response => { 
                this.$log.info("Insert task response:");
                this.$log.info(response);
                this.$log.info("Http status: " + response.status + " " + response.statusText);
            }),
            catchError(this.handleError)
        );
    }

    updateTask(taskItem: TaskItem): Observable<HttpResponse<TaskItem>> {
        return this.http.put<TaskItem>(this.url, taskItem, {
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(
            tap(response => {

            }),
            catchError(this.handleError)
        );
    }

    deleteTask(id: number): Observable<HttpResponse<TaskItem>> {
        return this.http.delete<TaskItem>(this.url + "?id=" + id, {
            observe: 'response'
        }).pipe(catchError(this.handleError));
    }
}
