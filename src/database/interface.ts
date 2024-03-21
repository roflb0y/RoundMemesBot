export interface DBUser {
    userId: number,
    username: string,
    locale: string,
    processesCount: number,
    convertType: string,
    joinedAt: Date,
    isBanned: boolean
}