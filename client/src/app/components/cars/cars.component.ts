import { Component, OnInit } from '@angular/core';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {
  cars: Car[] = [];
  filteredCars: Car[] = [];
  showModal = false;
  selectedCar: Car | null = null;
  searchTerm = '';

  constructor(private carService: CarService) { }

  ngOnInit(): void {
    console.log('CarsComponent inițializat');
    this.loadCars();
  }

  loadCars(): void {
    console.log('Încărcare mașini...');
    this.carService.getAll()
      .subscribe(
        data => {
          console.log('Mașini încărcate cu succes:', data);
          this.cars = data;
          this.filter();
        },
        error => {
          console.error('Eroare la încărcarea mașinilor:', error);
        });
  }

  filter(): void {
    console.log('Filtrare în curs cu termenul:', this.searchTerm);
    console.log('Număr total de mașini:', this.cars.length);
    
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredCars = [...this.cars];
      console.log('Nicio filtrare, afișez toate mașinile:', this.filteredCars.length);
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      console.log('Filtrare după termenul:', term);
      
      // Mă asigur că cars există și conține elemente
      if (!this.cars || this.cars.length === 0) {
        console.log('Lista de mașini este goală!');
        this.filteredCars = [];
        return;
      }
      
      this.filteredCars = this.cars.filter(car => {
        // Previn NaN și null
        const marcaLower = (car.marca || '').toLowerCase();
        const modelLower = (car.model || '').toLowerCase();
        const anFabricatie = car.an_fabricatie ? car.an_fabricatie.toString() : '';
        const capacitate = car.capacitate_cilindrica ? car.capacitate_cilindrica.toString() : '';
        const taxa = car.taxa_impozit ? car.taxa_impozit.toString() : '';
        
        // Caut șirul în orice parte a datelor
        const marcaMatch = marcaLower.includes(term);
        const modelMatch = modelLower.includes(term);
        const anMatch = anFabricatie.includes(term);
        const capacitateMatch = capacitate.includes(term);
        const taxaMatch = taxa.includes(term);
        
        return marcaMatch || modelMatch || anMatch || capacitateMatch || taxaMatch;
      });
      
      console.log('Rezultate filtrate:', this.filteredCars.length);
      console.log('Mașini după filtrare:', this.filteredCars);
    }
  }
  
  onSearchChange(): void {
    console.log('Termenul de căutare s-a schimbat la:', this.searchTerm);
    // Forțez o reîncărcare a datelor dacă nu există mașini
    if (!this.cars || this.cars.length === 0) {
      this.loadCars();
    } else {
      this.filter();
    }
  }

  openAddModal(): void {
    this.selectedCar = null;
    this.showModal = true;
  }

  openEditModal(car: Car): void {
    this.selectedCar = { ...car };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveCar(car: Car): void {
    console.log('Salvare mașină:', car);
    
    if (car.id) {
      console.log('Actualizare mașină cu ID-ul:', car.id);
      this.carService.update(car.id, car)
        .subscribe(
          response => {
            console.log('Actualizare reușită:', response);
            this.loadCars();
            this.closeModal();
          },
          error => {
            console.error('Eroare la actualizarea mașinii:', error);
            alert('Eroare la actualizarea mașinii: ' + (error.message || JSON.stringify(error)));
          });
    } else {
      console.log('Creare mașină nouă');
      this.carService.create(car)
        .subscribe(
          response => {
            console.log('Creare reușită:', response);
            this.loadCars();
            this.closeModal();
          },
          error => {
            console.error('Eroare la crearea mașinii:', error);
            alert('Eroare la crearea mașinii: ' + (error.message || JSON.stringify(error)));
          });
    }
  }

  deleteCar(id: number): void {
    if (confirm('Sunteți sigur că doriți să ștergeți această mașină?')) {
      console.log('Ștergere mașină cu ID-ul:', id);
      this.carService.delete(id)
        .subscribe(
          response => {
            console.log('Ștergere reușită');
            this.loadCars();
          },
          error => {
            console.error('Eroare la ștergerea mașinii:', error);
            alert('Eroare la ștergerea mașinii: ' + (error.message || JSON.stringify(error)));
          });
    }
  }

  getTaxClass(taxAmount: number): string {
    if (taxAmount <= 50) {
      return 'tax-low';
    } else if (taxAmount <= 100) {
      return 'tax-medium';
    } else {
      return 'tax-high';
    }
  }
} 