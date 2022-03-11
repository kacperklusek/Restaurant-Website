import { Rate } from "./rate.model";

export interface Dish {
    name:string,
    cuisineType:string,
    category:string,
    ingredients:string,
    maxPerDay:number,
    price:number,
    description:string,
    imgUrls:string[],
    rating:Rate[]
    rate:number|string;
    id?:string;
}