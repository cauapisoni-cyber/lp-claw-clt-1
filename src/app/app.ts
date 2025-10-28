import { Component, signal } from '@angular/core';
import { HomeComponent } from './components/home/home';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent, Footer, Header],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = signal('landing-page-claw-express');
}
