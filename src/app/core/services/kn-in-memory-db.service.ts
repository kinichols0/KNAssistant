import { Injectable } from '@angular/core';

import { 
    InMemoryDbService, RequestInfo, ResponseOptions, getStatusText, STATUS 
} from 'angular-in-memory-web-api';

import { Observable, of, throwError } from 'rxjs';

import { TaskItem } from '../models/task-item.model';

import { Expense } from '../models/expense.model';

import { LogService } from '../models/log-service.model';

const taskEndpoint: string = "task";

const expenseEndpoint: string = "expense";

const noteEndpoint: string = "note";

@Injectable()
export class KnInMemeroryDbService implements InMemoryDbService {

    constructor(private $log: LogService) { }

    expenses: Expense[];
    tasks: TaskItem[];
    tasksIdCounter: number = 1;

    createDb() {
        this.loadExpenses();
        this.loadTasks();

        return {
            task: this.getTasks(),
            expense: this.getExpenses()
        };
    }

    post(reqInfo: RequestInfo): Observable<Response> {
        let name = reqInfo.collectionName;
        this.$log.info("In memory POST request for: " + name);
        if(name === taskEndpoint){
            this.$log.info("Insertting task into in memory DB");
            return this.insertTask(reqInfo);
        } else if(name === noteEndpoint){

        } else if(name === expenseEndpoint){
            this.$log.info("Creating expense in the in memory db");
            return this.insertExpense(reqInfo);
        }
        return undefined;
    }

    put(reqInfo: RequestInfo): Observable<Response> {
        let name = reqInfo.collectionName;
        this.$log.info("In memory PUT request for: " + name);
        if(name === expenseEndpoint) {
            this.$log.info("Updating expense in in-memory db");
            return this.updateExpense(reqInfo);
        } else if (name === taskEndpoint){
            this.$log.info("Updating task in in-memory db");
            return this.updateTask(reqInfo);
        }
        return undefined;
    }

    private getExpenses(): Expense[] {
        return this.expenses;
    }

    private getTasks(): TaskItem[] {
        return this.tasks;
    }
    
    private insertExpense(reqInfo: RequestInfo): Observable<Response> {
        return reqInfo.utils.createResponse$(() => {
            try{
                let expenseItem: Expense = reqInfo.utils.getJsonBody(reqInfo.req);
                expenseItem.expenseId = this.guidGenerator();
                this.expenses.push(expenseItem);
                let options: ResponseOptions = {
                    body: reqInfo.utils.getConfig().dataEncapsulation ? { expenseItem } : expenseItem,
                    status: STATUS.OK
                };
                return this.finishOptions(options, reqInfo);
            } catch {
                let options: ResponseOptions = {
                    body: "There was an error while creating the expense in the db.",
                    status: STATUS.INTERNAL_SERVER_ERROR
                };
                return this.finishOptions(options, reqInfo);
            }
        });
    }

    private insertTask(reqInfo: RequestInfo): Observable<Response> {
        return reqInfo.utils.createResponse$(() => {
            let taskItem: TaskItem = reqInfo.utils.getJsonBody(reqInfo.req);
            this.$log.info(`Request body detected by in memory db: ${JSON.stringify(taskItem)}`);
            taskItem.id = this.taskIdGenerator();
            this.tasks.push(taskItem);

            let dataEncapsulation = reqInfo.utils.getConfig().dataEncapsulation;
            let options: ResponseOptions = {
                body: dataEncapsulation ? { taskItem } : taskItem,
                status: STATUS.OK
            };
            return this.finishOptions(options, reqInfo);
        });
    }
    
    private loadTasks(): void {
        this.tasks = [
            { id: this.taskIdGenerator(), taskText: "Take out the trash", done: false},
            { id: this.taskIdGenerator(), taskText: "Wash the dishes", done: false },
            { id: this.taskIdGenerator(), taskText: "Go to the gym", done: true }
        ];
    }

    private loadExpenses(): void {
        this.expenses = [
            { expenseId: this.guidGenerator(), expenseName: "BGE", expenseCost: 150.00 },
            { expenseId: this.guidGenerator(), expenseName: "Mortgage", expenseCost: 750.00 },
            { expenseId: this.guidGenerator(), expenseName: "Student Loan", expenseCost: 100 },
            { expenseId: this.guidGenerator(), expenseName: "Car Note", expenseCost: 135.00 }
        ];
    }

    private responseInterceptor(options: ResponseOptions, 
        reqInfo: RequestInfo): ResponseOptions 
    {
        options.headers.set('x-test', 'test-header');
        const method = reqInfo.method.toUpperCase();
        const body = JSON.stringify(options);
        this.$log.info(`Response Interceptor: ${method} ${reqInfo.req.url}: \n${body}`);
        return options;
    }

    private finishOptions(options: ResponseOptions,
        {headers, url}: RequestInfo): ResponseOptions 
    {
        options.statusText = getStatusText(options.status);   
        options.headers = headers;   
        options.url = url;    
        return options;    
    }

    // Pseudo guid generator
    private guidGenerator(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    private taskIdGenerator(): number {
        return this.tasksIdCounter++;
    }

    private updateExpense(reqInfo: RequestInfo): Observable<Response> {
        return reqInfo.utils.createResponse$(() => {
            try{
                let expenseItem: Expense = reqInfo.utils.getJsonBody(reqInfo.req);
                let expenseToUpdate = this.expenses.find((item) => { 
                    return item.expenseId === expenseItem.expenseId;
                });

                let index = this.expenses.indexOf(expenseToUpdate);
                this.expenses[index].expenseName = expenseItem.expenseName;
                this.expenses[index].expenseCost = expenseItem.expenseCost;

                let options: ResponseOptions = {
                    body: reqInfo.utils.getConfig().dataEncapsulation ? { expenseItem } : expenseItem,
                    status: STATUS.OK
                };
                return this.finishOptions(options, reqInfo);
            } catch {
                let options: ResponseOptions = {
                    body: "There was an error while updating the expense in the db.",
                    status: STATUS.INTERNAL_SERVER_ERROR
                };
                return this.finishOptions(options, reqInfo);
            }
        });
    }

    private updateTask(reqInfo: RequestInfo): Observable<Response> {
        return reqInfo.utils.createResponse$(() => {
            try{
                let task: TaskItem = reqInfo.utils.getJsonBody(reqInfo.req);
                let taskItem = this.tasks.find((item) => { 
                    return item.id === task.id;
                });

                let index = this.tasks.indexOf(taskItem);
                this.tasks[index].taskText = task.taskText;
                this.tasks[index].done = task.done;

                let options: ResponseOptions = {
                    body: reqInfo.utils.getConfig().dataEncapsulation ? { task } : task,
                    status: STATUS.OK
                };
                return this.finishOptions(options, reqInfo);
            } catch {
                let options: ResponseOptions = {
                    body: "There was an error while update the task in the db.",
                    status: STATUS.INTERNAL_SERVER_ERROR
                };
                return this.finishOptions(options, reqInfo);
            }
        });
    }
}