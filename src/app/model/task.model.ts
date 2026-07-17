export interface Task {
  taskId: number;               
  taskName: string;             
  content?: string;             
  dueDate?: string;             
  statusTypeId: string;         
  statusName?: string;          
  userId?: number;              
  username?: string;            
  creationDate: string;         
  createdBy: string;            
  lastUpdateDate: string;       
  lastUpdatedBy: string;        
  createdByFullname?: string;  
}

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