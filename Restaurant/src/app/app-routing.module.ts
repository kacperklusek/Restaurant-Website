import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { RouterModule } from "@angular/router";
import { AdminViewComponent } from "./admin-view/admin-view.component";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./guards/auth.guard";
import { DishDetailsComponent } from "./dish/dish-details/dish-details.component";
import { DishResolverService } from "./dishes-edit/dish-edit/dish-resolver.service";
import { DishEditComponent } from "./dishes-edit/dish-edit/dish-edit.component";
import { DishesEditComponent } from "./dishes-edit/dishes-edit.component";
import { DishAddComponent } from "./dishes/dish-add/dish-add.component";
import { DishesResolverService } from "./dishes/dishes-resolver.service";
import { DishesComponent } from "./dishes/dishes.component";
import { HomeComponent } from "./home/home.component";
import { ShoppingCartComponent } from "./shopping-cart/shopping-cart.component";
import { AdminGuard } from "./guards/admin.guard";
import { ManagerGuard } from "./guards/manager.guard";
import { CustomerGuard } from "./guards/customer.guard";




const appRoutes: Routes = [
    {path: "" , component: HomeComponent},
    {path: "menu", component: DishesComponent},
    {path: "menu/:id",
     component: DishDetailsComponent,
     resolve: [DishesResolverService],
     canActivate: [AuthGuard]},
    {path: "shopping-cart",
     component: ShoppingCartComponent,
     canActivate: [AuthGuard]},
    {path: "add-dish", 
     component: DishAddComponent,
     canActivate: [ManagerGuard]},
    {path: "auth", component: AuthComponent},
    {path: "adminView", 
     component: AdminViewComponent,
     canActivate: [AdminGuard]},
    {path: "menu-edit",
     component: DishesEditComponent,
     resolve: [DishesResolverService],
     canActivate: [ManagerGuard]},
    {path: "menu-edit/:id",
     component: DishEditComponent,
     resolve: [DishResolverService],
     canActivate: [ManagerGuard]},
  ];

@NgModule({
    imports: [
      RouterModule.forRoot(appRoutes, {scrollPositionRestoration: 'enabled'})
    ],
    exports: [
      RouterModule
    ]
})
export class AppRoutingModule {

}