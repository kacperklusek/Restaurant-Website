import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Dish } from 'src/app/shared/dish.model';

@Component({
  selector: 'app-dish-images',
  templateUrl: './dish-images.component.html',
  styleUrls: ['./dish-images.component.css']
})
export class DishImagesComponent implements OnInit {
  @Input() dish!: Dish;
  imageIndex:number = 0;

  constructor() { 
  }

  ngOnInit(): void {
  }

  getImageUrl() {        
    return this.dish.imgUrls[this.imageIndex];
  }

  onSwipeLeft() {
    this.imageIndex = (( this.dish.imgUrls.length + this.imageIndex - 1) % this.dish.imgUrls.length);    
  }
  onSwipeRight() {
    this.imageIndex = ( this.dish.imgUrls.length + this.imageIndex + 1) % this.dish.imgUrls.length;
  }

}
