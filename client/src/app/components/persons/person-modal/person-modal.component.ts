import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Person } from '../../../models/person.model';
import { Car } from '../../../models/car.model';

@Component({
  selector: 'app-person-modal',
  templateUrl: './person-modal.component.html',
  styleUrls: ['./person-modal.component.css']
})
export class PersonModalComponent implements OnInit, OnChanges {
  @Input() person: Person | null = null;
  @Input() cars: Car[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Person>();

  personForm: FormGroup;
  submitted = false;
  cnpInfo: any = {
    birthDate: null,
    gender: null,
    county: null
  };
  
  // Lista județelor în România
  counties = [
    'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani', 'Brașov',
    'Brăila', 'Buzău', 'Caraș-Severin', 'Cluj', 'Constanța', 'Covasna', 'Dâmbovița',
    'Dolj', 'Galați', 'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov',
    'Maramureș', 'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Satu Mare', 'Sălaj',
    'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vaslui', 'Vâlcea', 'Vrancea',
    'București - Sector 1', 'București - Sector 2', 'București - Sector 3', 'București - Sector 4',
    'București - Sector 5', 'București - Sector 6'
  ];

  constructor(private fb: FormBuilder) {
    this.personForm = this.fb.group({
      nume: ['', [Validators.required, Validators.maxLength(255)]],
      prenume: ['', [Validators.required, Validators.maxLength(255)]],
      cnp: ['', [
        Validators.required, 
        Validators.maxLength(13), 
        Validators.minLength(13),
        Validators.pattern(/^[1-9]\d{12}$/),
        this.validateCNP
      ]],
      varsta: [{ value: '', disabled: true }, [Validators.required]],
      cars: [[]]
    });
  }

  ngOnInit(): void {
    this.personForm.get('cnp')?.valueChanges.subscribe(cnp => {
      if (cnp && cnp.length === 13) {
        this.calculateAge();
        this.extractCNPInfo();
      } else {
        this.cnpInfo = {
          birthDate: null,
          gender: null,
          county: null
        };
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.person && this.person) {
      // Extragem doar ID-urile mașinilor selectate
      const selectedCarIds = this.person.cars 
        ? this.person.cars.map(car => car.id) 
        : [];
        
      console.log('Patching form with selected car IDs:', selectedCarIds);
      
      this.personForm.patchValue({
        nume: this.person.nume,
        prenume: this.person.prenume,
        cnp: this.person.cnp,
        varsta: this.person.varsta,
        cars: selectedCarIds
      });
      
      // Extrage informațiile din CNP dacă există
      if (this.person.cnp && this.person.cnp.length === 13) {
        this.extractCNPInfo();
      }
    } else {
      this.personForm.reset({
        cars: []
      });
      this.personForm.get('varsta')?.disable();
      this.cnpInfo = {
        birthDate: null,
        gender: null,
        county: null
      };
    }
  }

  // Validare specifică CNP-ului
  validateCNP(control: AbstractControl): ValidationErrors | null {
    const cnp = control.value;
    if (!cnp || cnp.length !== 13) return null;
    
    // Verifică dacă prima cifră este validă (1-9)
    const firstDigit = parseInt(cnp.charAt(0), 10);
    if (firstDigit < 1 || firstDigit > 8) {
      return { invalidFirstDigit: true };
    }

    // Verifică dacă data din CNP este validă
    try {
      const year = parseInt(cnp.substring(1, 3), 10);
      const month = parseInt(cnp.substring(3, 5), 10);
      const day = parseInt(cnp.substring(5, 7), 10);
      
      // Verifică luna
      if (month < 1 || month > 12) {
        return { invalidMonth: true };
      }
      
      // Verifică ziua
      if (day < 1 || day > 31) {
        return { invalidDay: true };
      }
      
      // Verifică codul de județ (8-53)
      const county = parseInt(cnp.substring(7, 9), 10);
      if (county < 1 || county > 52) {
        return { invalidCounty: true };
      }
      
      return null;
    } catch (e) {
      return { invalidFormat: true };
    }
  }

  calculateAge(): void {
    try {
      const cnp = this.personForm.get('cnp')?.value;
      if (!cnp || cnp.length !== 13) return;

      const year = parseInt(cnp.substring(1, 3), 10);
      const month = parseInt(cnp.substring(3, 5), 10);
      const day = parseInt(cnp.substring(5, 7), 10);
      
      const prefix = parseInt(cnp.charAt(0), 10);
      let fullYear: number;
      
      if (prefix === 1 || prefix === 2) {
        fullYear = 1900 + year;
      } else if (prefix === 5 || prefix === 6) {
        fullYear = 2000 + year;
      } else if (prefix === 3 || prefix === 4) {
        fullYear = 1800 + year;
      } else if (prefix === 7 || prefix === 8) {
        fullYear = 2000 + year; // Rezidenți
      } else {
        fullYear = 1900 + year;
      }
      
      const birthDate = new Date(fullYear, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      
      if (
        today.getMonth() < birthDate.getMonth() || 
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      
      this.personForm.get('varsta')?.setValue(age);
    } catch (error) {
      console.error('Error calculating age:', error);
    }
  }

  extractCNPInfo(): void {
    try {
      const cnp = this.personForm.get('cnp')?.value;
      if (!cnp || cnp.length !== 13) return;
      
      // Extrage sexul
      const gender = parseInt(cnp.charAt(0), 10);
      let genderText = '';
      
      if (gender === 1 || gender === 3 || gender === 5 || gender === 7) {
        genderText = 'Masculin';
      } else if (gender === 2 || gender === 4 || gender === 6 || gender === 8) {
        genderText = 'Feminin';
      }
      
      // Extrage data nașterii
      const year = parseInt(cnp.substring(1, 3), 10);
      const month = parseInt(cnp.substring(3, 5), 10);
      const day = parseInt(cnp.substring(5, 7), 10);
      
      let fullYear: number;
      if (gender === 1 || gender === 2) {
        fullYear = 1900 + year;
      } else if (gender === 5 || gender === 6) {
        fullYear = 2000 + year;
      } else if (gender === 3 || gender === 4) {
        fullYear = 1800 + year;
      } else if (gender === 7 || gender === 8) {
        fullYear = 2000 + year;
      } else {
        fullYear = 1900 + year;
      }
      
      const birthDate = new Date(fullYear, month - 1, day);
      const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${fullYear}`;
      
      // Extrage județul
      const countyCode = parseInt(cnp.substring(7, 9), 10);
      let county = '';
      
      if (countyCode >= 1 && countyCode <= 46) {
        county = this.counties[countyCode - 1];
      } else if (countyCode >= 47 && countyCode <= 52) {
        // București
        county = this.counties[countyCode - 1];
      }
      
      this.cnpInfo = {
        birthDate: formattedDate,
        gender: genderText,
        county: county
      };
    } catch (error) {
      console.error('Error extracting CNP info:', error);
    }
  }

  onSubmit(): void {
    console.log('onSubmit called');
    this.submitted = true;
    
    if (this.personForm.invalid) {
      console.log('Form is invalid, validation errors:', this.personForm.errors);
      // Afișăm toate erorile pentru fiecare câmp
      Object.keys(this.personForm.controls).forEach(key => {
        const control = this.personForm.get(key);
        if (control && control.errors) {
          console.log(`Field ${key} errors:`, control.errors);
        }
      });
      return;
    }

    const formValue = this.personForm.getRawValue();
    console.log('Form values:', formValue);
    
    // Primește valorile de la selectorul standard
    const selectedCarIds = formValue.cars ? formValue.cars : [];
    console.log('Selected car IDs:', selectedCarIds);
    
    // Transformă ID-urile în obiecte Car
    const selectedCars = [];
    for (const idStr of selectedCarIds) {
      const id = typeof idStr === 'string' ? parseInt(idStr, 10) : idStr;
      const car = this.cars.find(c => c.id === id);
      if (car) {
        selectedCars.push({...car}); // Creez o copie pentru a evita referințele
      }
    }
    console.log('Selected cars as objects:', selectedCars);
    
    const person: Person = {
      id: this.person?.id,
      nume: formValue.nume,
      prenume: formValue.prenume,
      cnp: formValue.cnp,
      varsta: formValue.varsta,
      cars: selectedCars
    };
    console.log('Person object to emit:', person);
    
    this.save.emit(person);
    console.log('Save event emitted');
  }

  onClose(): void {
    this.submitted = false;
    this.close.emit();
  }

  get f() { 
    return this.personForm.controls; 
  }

  // Metodă pentru trimiterea formularului când se apasă butonul
  submitForm(): void {
    console.log('submitForm() called');
    this.onSubmit();
  }
} 