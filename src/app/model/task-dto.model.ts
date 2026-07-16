export interface CreateTaskDTO {
  taskName: string;
  content?: string | null;  
  dueDate?: string | null;  
  statusTypeId: string;
  userId?: number | null;
}

export interface UpdateTaskDTO {
  taskName: string;
  content?: string | null;
  dueDate?: string | null;
}

export interface UpdateTaskStatusDTO {
  statusTypeId: string;
}