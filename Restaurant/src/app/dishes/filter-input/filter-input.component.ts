import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FilterService } from 'src/app/services/filter.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Dish } from 'src/app/shared/dish.model';
import { DishListService } from 'src/app/services/dish-list.service';

interface dropdownListObject {
  cuisineType: any,
  price: any,
  rate: any,
  category: any
}

@Component({
  selector: 'app-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.css']
})
export class FilterInputComponent implements OnInit {
  dishes!: Dish[];
  // @Output() selectionChanged = new EventEmitter();

  dropdownListsObj: dropdownListObject = {
    cuisineType: [],
    price: [],
    rate: [],
    category: []
  };
  selectedItemsObj: dropdownListObject= {
    cuisineType: [],
    price: [],
    rate: [],
    category: []
  };
  dropdownSettings: IDropdownSettings = {};

  constructor(public filterService: FilterService,
    private dishListService: DishListService) { }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: "item_id",
      textField : "item_content",
      itemsShowLimit: 5,
      allowSearchFilter: true,
    }
    
    this.dishListService.getDishes().
    subscribe(
      (dishes: Dish[]) => {
        this.dishes = dishes;
        // update possible valeus        
        this.updateObjects(dishes);
      }
    )
  }

  private updateObjects(dishes:Dish[]) {
    for (let key in this.dropdownListsObj) {
      //@ts-ignore
      this.dropdownListsObj[key] = []
      for (const dish of dishes) {
        //@ts-ignore
        if (dish[key] === '') {continue}
        //@ts-ignore
        if (this.dropdownListsObj[key].some(o => o.item_content === dish[key])) {continue}
        //@ts-ignore
        this.dropdownListsObj[key].push({item_id : dish.id, item_content: dish[key]});
      }
      //sorting possible values
      //@ts-ignore
      this.dropdownListsObj[key].sort((e1, e2) => {
        return e1.item_content > e2.item_content ? 1 : e1.item_content < e2.item_content ? -1 : 0; 
      })
    }
  }

  onFilterChange(item: any) {    
    this.filterService.selectedDishAttributes = this.selectedItemsObj;    
    this.filterService.onAttributesChange();
  }

  getData(key: string) {
    //@ts-ignore
    return this.dropdownListsObj[key];
  }

  getSelected(key: string){
    //@ts-ignore
    return this.selectedItemsObj[key];
  }

}
