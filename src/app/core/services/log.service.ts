import { Injectable } from '@angular/core';
import { } from '../../../environments/environment';
import { BaseLogService } from '../models/base-log-service.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LogService extends BaseLogService {

    constructor(){
        super();
    }
    
    info(obj: any): void {
        console.log(obj);
    }

    debug(obj: any): void {
        if(!environment.production){
            console.debug(obj);
        }
    }

    error(obj: any): void {
        if(!environment.production){
            console.error(obj);
        }
    }
}