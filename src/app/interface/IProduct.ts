import { ICategory } from "./ICategory";

export interface IProduct {
  id?: number;
  title: string;
  slug?: string;
  price: number;
  description: string;
  category?: ICategory;
  categoryId? : number;
  images: string[];
}
