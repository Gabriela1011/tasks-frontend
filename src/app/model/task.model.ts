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