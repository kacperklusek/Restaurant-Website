import { EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { Dish } from '../shared/dish.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService implements OnInit {
  @Output() filterChanged = new EventEmitter();

  selectedDishAttributes:any;
  convertedSelectedDishAttributes:any;

  ngOnInit(): void {
    this.selectedDishAttributes = {
      name: [],
      cuisineType: [],
      category: [],
      ingredients: [],
      maxPerDay: [],
      price: [],
      description: [],
      imgUrls: [],
      rate: []
    }
  }



  constructor() { }

  onAttributesChange() {
    // wiadomość z filter-input że zaktualizowała się lista this.selectedDishAttributes    
    //konwertuje na liste filtrow
    this.selectedDishAttributes = this.convertToFiltersList(this.selectedDishAttributes);
    //powiadamiam dishes.component o nowej liście filtrów
    this.filterChanged.emit(this.selectedDishAttributes);
  }

  convertToFiltersList(attributesList: typeof this.selectedDishAttributes){
    let outputArrays = {}
    for (let key in attributesList) {
      //@ts-ignore
      outputArrays[key] = new Set();
      for (let obj of attributesList[key]){
        //@ts-ignore
        outputArrays[key].add(obj.item_content)
      }
    }
    return outputArrays;
  }
}
