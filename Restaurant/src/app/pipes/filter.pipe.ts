import { Pipe, PipeTransform } from '@angular/core';
import { FilterService } from '../services/filter.service';
import { Dish } from '../shared/dish.model';


@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  filterByCuisineType:boolean = false;
  filterByPrice:boolean = false;
  filterByRate:boolean = false;
  filterByCategory:boolean = false;
  cuisineTypeFilter:string = '';
  categoryFilter:string = '';
  priceFromFilter:number = 0;
  priceToFilter:number = Infinity;
  rateFromFilter:number = 0;
  rateToFilter:number = Infinity;

  constructor (private filterService:FilterService) {
  }


  transform(value: Dish[], filterBy:string, filterValues: Set<any>): Dish[] {  
    if (filterValues.size === 0) {return value}  
    value = value.filter((elem:Dish, index:number, array:Dish[]) => {
      //@ts-ignore
      for (const filterValue of filterValues) {
        //@ts-ignore
        if (filterValue === elem[filterBy]) {return true}
        //@ts-ignore
        if (typeof filterValue === "string" && filterValue.includes(elem[filterBy])) {return true}
      }
      return false
    })
    
    return value;

  }


}
