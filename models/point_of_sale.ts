export interface POFDto {
   id: number
   code: string
   name: string
   reference: string
   contact: string
   zoneId: number
   status: boolean
   dailySaleLimit: number
   minutesToCancelTickets: number
   ticketsAllowedToCancelPerDay: number
   maximumAmountOfTickets: number
   printMode: number
   footer: string
  }
  
  export interface SavePOFRequest {
    id?: number
    code?: string
    name: string
    reference: string
    contact: string
    zoneId: number
    status: boolean
    dailySaleLimit: number
    minutesToCancelTickets: number
    ticketsAllowedToCancelPerDay: number
    maximumAmountOfTickets: number
    printMode: number
    footer: string
  }