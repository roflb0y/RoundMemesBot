export interface DBUserI {
    userId: number
    username: string
    locale: string
    processesCount: number
    convertType: number
    joinedAt: Date
    isBanned: boolean
}

export interface DBProcessI {
    user: number
    convertType: number
    processTime: number
    date: Date
}