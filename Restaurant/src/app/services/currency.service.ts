import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  currency: String = "dollar";

  constructor() { }
}
