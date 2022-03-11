import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DishListService } from 'src/app/services/dish-list.service';
import { Dish } from '../../shared/dish.model';



@Component({
  selector: 'app-dish-add',
  templateUrl: './dish-add.component.html',
  styleUrls: ['./dish-add.component.css']
})
export class DishAddComponent implements OnInit {
  @Output() onAddDish = new EventEmitter<Dish>();
  checked: boolean= false
  modelForm!: FormGroup;
  formErrors:Map<string, string>;
  validationMessages:Map<string, Map<string, string>>;

  constructor(private formBuilder: FormBuilder,
    private dishListService: DishListService) {
    this.formErrors = new Map([
      ['name', ''],
      ['ingredients', ''],
      ['maxPerDay', ''],
      ['price', ''],
      ['imgUrls', ''],
    ])


    this.validationMessages = new Map([
      ['name', new Map([['required', 'dish name is required']])],
      ['ingredients', new Map([['required', 'ingredients is required']])],
      ['ingredients', new Map([['required', 'ingredients is required']])],
      ['maxPerDay', new Map([['required', 'maxPerDay is required'],
                            ['min', 'miinimum of max per day is 1']])],
      ['price', new Map([['required', 'price is required'],
                            ['min', 'miinimum price is 1']])],
      ['imgUrls', new Map([['required', 'image url is required']])],
    ]);
  }

  ngOnInit(): void {
    this.modelForm = this.formBuilder.group({
      name: ['', Validators.required],
      cuisineType: '',
      type:'',
      category:'',
      ingredients: ['', Validators.required],
      maxPerDay: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      description:'',
      imgUrls: ['', Validators.required]
    })

    this.modelForm.valueChanges.subscribe(
      (value) => {
        this.onControlValueChanged();
      }
    )

    this.onControlValueChanged();
  }

  onSubmit(form: FormGroup) {
    // console.log(form.value.name);
    const newDish: Dish = {
        name: form.value.name,
        cuisineType: form.value.cuisineType,
        category: form.value.category,
        ingredients: form.value.ingredients,
        maxPerDay: form.value.maxPerDay,
        price: form.value.price,
        description: form.value.description,
        imgUrls: form.value.imgUrls.replace(/\s/g, "").split(','), // split by ',' and remove whitespace
        rate: 'no reviews',
        rating: [],
    }
    if (form.valid) {
      this.dishListService.addDish(newDish);
      form.reset();
    } else {
      this.checkValidity('ignore-dirty');
    }
  }

  onControlValueChanged() {    
    this.checkValidity('check-dirty');
  }

  checkValidity(mode:string) {
    const form = this.modelForm;
    
      for (let [key, value] of this.formErrors) {     
        this.formErrors.set(key, '');
        let control = form.get(key); 
        const modeControl = mode =='check-dirty' ? control?.dirty : true;

        if (control && modeControl && !control.valid) {
          const validationMessages = this.validationMessages.get(key);
          for (const key1 in control.errors) {
            this.formErrors.set(key, validationMessages?.get(key1) + ' ')
          }
        }
      }
  }

}
