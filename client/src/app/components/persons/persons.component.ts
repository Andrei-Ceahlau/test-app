import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../services/person.service';
import { CarService } from '../../services/car.service';
import { Person } from '../../models/person.model';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent implements OnInit {
  persons: Person[] = [];
  filteredPersons: Person[] = [];
  cars: Car[] = [];
  showModal = false;
  selectedPerson: Person | null = null;
  searchTerm = '';

  constructor(
    private personService: PersonService,
    private carService: CarService
  ) { }

  ngOnInit(): void {
    console.log('PersonsComponent inițializat');
    this.loadPersons();
    this.loadCars();
  }

  loadPersons(): void {
    console.log('Încărcare persoane...');
    this.personService.getAll()
      .subscribe(
        data => {
          console.log('Persoane încărcate cu succes:', data);
          this.persons = data;
          // Forțez o filtrare inițială
          this.filter();
        },
        error => {
          console.error('Eroare la încărcarea persoanelor:', error);
        });
  }

  loadCars(): void {
    this.carService.getAll()
      .subscribe(
        data => {
          this.cars = data;
        },
        error => {
          console.error('Error:', error);
        });
  }

  filter(): void {
    console.log('Filtrare în curs cu termenul:', this.searchTerm);
    console.log('Număr total de persoane:', this.persons.length);
    
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredPersons = [...this.persons];
      console.log('Nicio filtrare, afișez toate persoanele:', this.filteredPersons.length);
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      console.log('Filtrare după termenul:', term);
      
      // Mă asigur că persons există și conține elemente
      if (!this.persons || this.persons.length === 0) {
        console.log('Lista de persoane este goală!');
        this.filteredPersons = [];
        return;
      }
      
      this.filteredPersons = this.persons.filter(person => {
        // Verific date pentru debugging
        console.log('Verificare persoană:', person);
        
        // Previn NaN și null
        const numeLower = (person.nume || '').toLowerCase();
        const prenumeLower = (person.prenume || '').toLowerCase();
        const cnp = person.cnp || '';
        const varsta = person.varsta ? person.varsta.toString() : '';
        
        // Caut șirul în orice parte a datelor
        const nameMatch = (numeLower + ' ' + prenumeLower).includes(term);
        const cnpMatch = cnp.includes(term);
        const ageMatch = varsta.includes(term);
        const carMatch = this.checkCarMatch(person, term);
        
        return nameMatch || cnpMatch || ageMatch || carMatch;
      });
      
      console.log('Rezultate filtrate:', this.filteredPersons.length);
      console.log('Persoane după filtrare:', this.filteredPersons);
    }
  }

  checkCarMatch(person: Person, term: string): boolean {
    if (!person.cars || !person.cars.length) {
      return false;
    }
    
    return person.cars.some(car => {
      const marca = (car.marca || '').toLowerCase();
      const model = (car.model || '').toLowerCase();
      return marca.includes(term) || model.includes(term);
    });
  }

  onSearchChange(): void {
    console.log('Termenul de căutare s-a schimbat la:', this.searchTerm);
    // Forțez o reîncărcare a persoanelor pentru a mă asigura că avem date
    if (!this.persons || this.persons.length === 0) {
      this.loadPersons();
    } else {
      this.filter();
    }
  }

  openAddModal(): void {
    this.selectedPerson = null;
    this.showModal = true;
  }

  openEditModal(person: Person): void {
    this.selectedPerson = { ...person };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  savePerson(person: Person): void {
    console.log('Saving person:', person);
    
    // Verificăm dacă avem mașini valide
    if (person.cars && Array.isArray(person.cars)) {
      console.log('Cars before saving:', person.cars);
      
      // Asigură-te că fiecare mașină are ID
      const processedCars = person.cars.map(car => {
        if (!car.id && car.id !== 0) {
          console.error('Car without ID found:', car);
          return null;
        }
        return car;
      }).filter(car => car !== null);
      
      person.cars = processedCars;
      console.log('Cars after processing:', person.cars);
    } else {
      person.cars = [];
    }
    
    if (person.id) {
      console.log('Updating person with ID:', person.id);
      this.personService.update(person.id, person)
        .subscribe(
          response => {
            console.log('Update successful:', response);
            this.loadPersons();
            this.closeModal();
          },
          error => {
            console.error('Error updating person:', error);
            // Afișează eroarea pentru debugging
            alert('Eroare la actualizarea persoanei: ' + (error.message || JSON.stringify(error)));
          });
    } else {
      console.log('Creating new person');
      this.personService.create(person)
        .subscribe(
          response => {
            console.log('Create successful:', response);
            this.loadPersons();
            this.closeModal();
          },
          error => {
            console.error('Error creating person:', error);
            // Afișează eroarea pentru debugging
            alert('Eroare la crearea persoanei: ' + (error.message || JSON.stringify(error)));
          });
    }
  }

  deletePerson(id: number): void {
    if (confirm('Sunteți sigur că doriți să ștergeți această persoană?')) {
      this.personService.delete(id)
        .subscribe(
          response => {
            this.loadPersons();
          },
          error => {
            console.error('Error:', error);
          });
    }
  }
} 