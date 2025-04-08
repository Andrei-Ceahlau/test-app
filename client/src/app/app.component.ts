import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'test-app';
  isMobile = false;
  isMenuOpen = false;

  ngOnInit() {
    // Verifică dacă este un dispozitiv mobil
    this.checkIfMobile();
    
    // Adaugă eveniment pentru redimensionarea ferestrei
    window.addEventListener('resize', () => {
      this.checkIfMobile();
    });
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
} 