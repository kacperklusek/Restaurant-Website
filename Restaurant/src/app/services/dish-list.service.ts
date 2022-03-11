import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Dish } from '../shared/dish.model';

const HttpOptions = {
  headers : new HttpHeaders ({
    'Content-type': 'application/json',
  })
}

@Injectable({
  providedIn: 'root'
})
export class DishListService {
  @Output() onAddDish = new EventEmitter<Observable<Dish>>();
  // private apiUrl = 'https://full-stack-restaurant-ap-26a16-default-rtdb.europe-west1.firebasedatabase.app/dishes.json';
  private apiUrl = "http://localhost:8000/dishes"
  dishes: Dish[] = [];
  dishesLoaded = new BehaviorSubject<Dish[]>([]);
  

  constructor(private http:HttpClient) {          
    this.getDishes().subscribe((dishes) => {
      this.dishes = dishes;
      this.dishesLoaded.next(this.dishes);
    })
  }

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(this.apiUrl);
  }

  deleteDish(dish: Dish): Observable<Dish> {    
    const url = `${this.apiUrl}/${dish.id}`
    this.dishes = this.dishes.filter(d => d.id !== dish.id);
    this.dishesLoaded.next(this.dishes)
    return this.http.delete<Dish>(url);
  }

  addDish(dish: Dish): void {    
    this.http.post<Dish>(this.apiUrl, dish, HttpOptions).subscribe((returnedDish) => {
      this.dishes.push(returnedDish);
      
      // code below is responsible for updating new newely created dish's id
      this.getDishes().subscribe((dishes) => {
        this.dishes = dishes;
        this.dishesLoaded.next(this.dishes);
      });
    })
  }

  updateDish(dish: Dish): Observable<Dish> {
    const url = `${this.apiUrl}/${dish.id}`
    return this.http.post<Dish>(url, dish, HttpOptions);
  }

  //@ts-ignore
  getDishById(id:string) :Dish {
    let returnDish:Dish =  this.dishes[0];
    //@ts-ignore
    this.dishes.forEach(dish => {
      //@ts-ignore
      if(dish.id == id) {
        // if loading details does not work, check type of id
        // and add + before dish.id if it's a
        returnDish = dish;
      }
    });
    
    return returnDish;
    // only for ts to shut up, because using this function i will always choose valid id
    // (clicking on the image)
  }

}
