import { Injectable } from '@angular/core';
import { } from '../../../environments/environment';
import { LogService } from '../models/log-service.model';

@Injectable({
    providedIn: 'root'
})
export class LoggerService extends LogService {

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