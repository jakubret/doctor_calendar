import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app.routes';
import { RouterModule } from '@angular/router';
@NgModule({
    declarations: [AppComponent, LoginComponent, CalendarComponent],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule.forRoot([]), // Use routing for standalone components

  ],
  providers: [
    provideHttpClient() // Correct placement for HttpClient configuration
  ],
  bootstrap: [AppComponent] // Bootstrapping AppComponent
})
export class AppModule {}
