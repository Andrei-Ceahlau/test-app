import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PersonsComponent } from './components/persons/persons.component';
import { CarsComponent } from './components/cars/cars.component';
import { PersonModalComponent } from './components/persons/person-modal/person-modal.component';
import { CarModalComponent } from './components/cars/car-modal/car-modal.component';

const routes: Routes = [
  { path: '', redirectTo: '/persons', pathMatch: 'full' },
  { path: 'persons', component: PersonsComponent },
  { path: 'cars', component: CarsComponent },
  { path: '**', redirectTo: '/persons' }
];

@NgModule({
  declarations: [
    AppComponent,
    PersonsComponent,
    CarsComponent,
    PersonModalComponent,
    CarModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 