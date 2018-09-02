import { TaskStatus } from '../enums/task-status.enum';

export class TaskItem {
    id?: number;
    taskText: string;
    status: TaskStatus;
}
