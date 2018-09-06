import { Injectable } from '@angular/core';
import { ILogger } from '../interfaces/logger.interface';

@Injectable()
export abstract class BaseLogService implements ILogger {

    abstract info(item: any): void;

    abstract error(item: any): void;

    abstract debug(item: any): void;
}