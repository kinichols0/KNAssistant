import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TaskItem } from '../models/task-item.model';
import { MessageService } from './message.service';
import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseLogService } from '../models/base-log-service.model';
import { map, catchError, retry, tap } from 'rxjs/operators';
import { BaseService } from '../models/base-service.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService extends BaseService {

    private url: string = "/api/task";

    constructor(private http: HttpClient, private msgSvc: MessageService, public $log: BaseLogService) { 
        super($log);
    }

    getTasks(): Observable<HttpResponse<TaskItem[]>> {
        this.$log.info('Tasks get service request');
        return this.http.get<TaskItem[]>(this.url, {
            observe: 'response'
        }).pipe(
            retry(2),
            tap(response => { 
                this.$log.debug("Task get response:");
                this.$log.debug(response);
            }),
            catchError(this.handleError)
        );
    }

    createTask(taskItem: TaskItem): Observable<HttpResponse<TaskItem>> {
        this.$log.debug("Create task service request:");
        this.$log.debug(taskItem);
        return this.http.post<TaskItem>(this.url, taskItem, { 
            observe: 'response',
            headers: new HttpHeaders({ 
                'Content-Type': 'application/json' 
            })
        }).pipe(
            tap(response => { 
                this.$log.debug("Response:");
                this.$log.debug(response);
            }),
            catchError(this.handleError)
        );
    }

    updateTask(taskItem: TaskItem): Observable<HttpResponse<TaskItem>> {
        this.$log.debug("Task update service request");
        return this.http.put<TaskItem>(this.url, taskItem, {
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(
            tap(response => {
                this.$log.debug("Response:");
                this.$log.debug(response);
            }),
            catchError(this.handleError)
        );
    }

    deleteTask(id: number): Observable<HttpResponse<TaskItem>> {
        this.$log.debug("Delete task service request");
        this.$log.debug("Id: " + id);
        return this.http.delete<TaskItem>(this.url + "?id=" + id, {
            observe: 'response'
        }).pipe(
            tap(response => { 
                this.$log.debug("Response: ");
                this.$log.debug(response);
            }),
            catchError(this.handleError)
        );
    }
}
