import { Component, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-currency-change',
  templateUrl: './currency-change.component.html',
  styleUrls: ['./currency-change.component.css']
})
export class CurrencyChangeComponent implements OnInit {

  constructor(public currencyService: CurrencyService) { }

  ngOnInit(): void {
  }

}
