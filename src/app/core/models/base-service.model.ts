import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { LogService } from '../models/log-service.model';

export abstract class BaseService {

    constructor(public $log: LogService) { }

    protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
        this.$log.info("Error has occured");
        this.$log.info(errorResponse);
        if(errorResponse.error instanceof(ErrorEvent)){
            // A client side or network error occured
        } else {
            // The backend returned an error
        }
        return throwError("Something went wrong. Please try again later");
    }
}