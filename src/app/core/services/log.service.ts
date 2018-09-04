import { Injectable } from '@angular/core';
import { } from '../../../environments/environment';
import { BaseLogService } from '../models/base-log-service.model';

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
        console.debug(obj);
    }

    error(obj: any): void {
        console.error(obj);
    }
}