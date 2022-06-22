export interface PermissionDto {
   id: number
   name: string
   lastName: string
   date: string
   permissionTypeId: number
  }
  
  export interface SavePermissionRequest {
    id?: number
    name: string
   lastName: string
   date: string
   permissionTypeId: number
  }