import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="app-header">
      <nav class="navbar navbar-expand-lg">
        <div class="container">
          <a class="navbar-brand" href="#">
            <i class="fa fa-database"></i> Test App
          </a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" routerLink="/persons" routerLinkActive="active">
                  <i class="fa fa-users"></i> Persoane
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/cars" routerLinkActive="active">
                  <i class="fa fa-car"></i> Mașini
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .app-header {
      margin-bottom: 20px;
    }
    .navbar {
      background-color: var(--primary-color);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 12px 0;
    }
    .navbar-brand {
      font-size: 1.5rem;
      font-weight: 500;
      color: white;
      letter-spacing: 0.5px;
    }
    .navbar-brand i {
      margin-right: 8px;
    }
    .nav-item {
      margin: 0 10px;
    }
    .nav-link {
      color: rgba(255, 255, 255, 0.85);
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    .nav-link i {
      margin-right: 5px;
    }
    .nav-link:hover {
      color: white;
      background-color: rgba(255, 255, 255, 0.1);
    }
    .nav-link.active {
      color: white;
      background-color: rgba(255, 255, 255, 0.15);
    }
  `]
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

} 