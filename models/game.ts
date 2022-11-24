export interface GameDto {
    id?: number
    pointOfSaleId: number
    status: boolean
    quantity: number
    gameDate?: string
    gameDetailDto: GameDetailDto[] 
   }

   export interface GameDetailDto {
    id?: number
    lotteryTypeId: number
    lotteryName?: string
    gameTypeId: number
    gameId?: number
    gameTypeName?: string
    number: number
    amount: number

   }
   

   export interface SaveGameDetail {
    id?: number
    lotteryTypeId: number[]
    gameTypeId: number
    number: number
    amount: number
    totalAmount?: number

   }
   
   export interface SaveGameRequest {
    id?: number
    pointOfSaleId: number
    status: boolean
    quantity: number
    gameDate: string
    GameDetailDto: GameDetailDto[] 
   }