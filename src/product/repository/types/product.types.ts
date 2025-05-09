import { Product } from "generated/prisma"



type ProductType = Pick<Product,"name" | "description" | "fileUrl" | "price">

export interface IRepository<T extends ProductType,U extends string> {

create(data: Partial<T>): Promise<T>;

// findById(id: U): Promise<>

}