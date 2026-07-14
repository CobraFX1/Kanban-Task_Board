import './style.css'

export type TaskStatus = 'todo' | 'doing' | 'done';
export interface Task<T = string> {
    id: string;
    title: string;
    state: TaskStatus;
    metaData: T;
}
export interface TaskMetadata {
    priority: 'low' | 'high' | 'medium';
    tags?: string[]; 
}
export type KanbanTask = Task<TaskMetadata>;

function getNextStatus(CurrentStatus: TaskStatus): TaskStatus {
    switch(CurrentStatus) {
        case 'todo':
            return 'doing';
        case 'doing':
            return 'done';
        case 'done':
            return 'done';
    }
}
/**
 * essentially i need a three display task board it would have 
 * define the generic task interface and write the function to shift states 
 * each task would have id, title, state, and metadata for priority | tasks 
 * function shiftStates(state) {
 * 
 * }
 */