import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { BaseLogService } from './base-log-service.model';

export abstract class BaseService {

    constructor(public $log: BaseLogService) { }

    protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
        this.$log.debug("Error has occured");
        this.$log.debug(errorResponse);
        if(errorResponse.error instanceof(ErrorEvent)){
            // A client side or network error occured
        } else {
            // The backend returned an error
        }
        return throwError("Something went wrong. Please try again later");
    }
}