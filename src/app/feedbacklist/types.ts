export interface User {
    name: string,
    email:string
}

export interface Feedback {
    id: string,
    createdAt: Date,
    updatedAt: Date,
    rating?: number,
    comment:string,
    userId: string,
    user: User
}