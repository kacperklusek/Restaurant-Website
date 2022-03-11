import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DishesComponent } from './dishes/dishes.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { DishComponent } from './dish/dish.component';
import { DishDescriptionComponent } from './dish/dish-description/dish-description.component';
import { DishImageComponent } from './dish/dish-image/dish-image.component';
import { DishShoppingComponent } from './dish/dish-shopping/dish-shopping.component';
import { HeaderComponent } from './header/header.component';
import { DishAddComponent } from './dishes/dish-add/dish-add.component';
import { DishRateComponent } from './dish/dish-rate/dish-rate.component';
import { FilterInputComponent } from './dishes/filter-input/filter-input.component';
import { FilterPipe } from './pipes/filter.pipe';
import { CurrencyChangeComponent } from './header/currency-change/currency-change.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { HomeComponent } from './home/home.component';
import { DishDetailsComponent } from './dish/dish-details/dish-details.component';
import { DishImagesComponent } from './dish/dish-images/dish-images.component';
import { DishReviewComponent } from './dish/dish-review/dish-review.component';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { LoginPersistComponent } from './header/login-persist/login-persist.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { UserComponent } from './admin-view/user/user.component';
import { DishesEditComponent } from './dishes-edit/dishes-edit.component';
import { DishEditComponent } from './dishes-edit/dish-edit/dish-edit.component';



@NgModule({
  declarations: [
    AppComponent,
    DishesComponent,
    RestaurantComponent,
    DishComponent,
    DishDescriptionComponent,
    DishImageComponent,
    DishShoppingComponent,
    HeaderComponent,
    DishAddComponent,
    DishRateComponent,
    FilterInputComponent,
    FilterPipe,
    CurrencyChangeComponent,
    ShoppingCartComponent,
    HomeComponent,
    DishDetailsComponent,
    DishImagesComponent,
    DishReviewComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    LoginPersistComponent,
    AdminViewComponent,
    UserComponent,
    DishesEditComponent,
    DishEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
