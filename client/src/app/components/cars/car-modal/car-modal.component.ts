import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Car } from '../../../models/car.model';

@Component({
  selector: 'app-car-modal',
  templateUrl: './car-modal.component.html',
  styleUrls: ['./car-modal.component.css']
})
export class CarModalComponent implements OnInit, OnChanges {
  @Input() car: Car | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Car>();

  carForm: FormGroup;
  submitted = false;
  title = 'Adaugă Mașină';
  taxInfo = { 
    amount: 0,
    category: ''
  };
  
  // Lista mărcilor populare de mașini
  popularBrands = [
    'Audi', 'BMW', 'Dacia', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Mazda', 
    'Mercedes-Benz', 'Opel', 'Peugeot', 'Renault', 'Skoda', 'Suzuki', 
    'Toyota', 'Volkswagen', 'Volvo'
  ];
  
  // Mărci premium pentru sugestii de modele
  premiumBrands = ['Audi', 'BMW', 'Mercedes-Benz', 'Volvo'];
  
  // Modele populare pentru mărcile selectate
  modelSuggestions: { [key: string]: string[] } = {
    'Audi': ['A1', 'A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
    'BMW': ['Seria 1', 'Seria 3', 'Seria 5', 'Seria 7', 'X1', 'X3', 'X5'],
    'Dacia': ['Logan', 'Sandero', 'Duster', 'Spring', 'Jogger'],
    'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Puma'],
    'Mercedes-Benz': ['Clasa A', 'Clasa C', 'Clasa E', 'Clasa S', 'GLA', 'GLC', 'GLE'],
    'Volkswagen': ['Polo', 'Golf', 'Passat', 'Tiguan', 'T-Roc', 'T-Cross']
  };

  constructor(private fb: FormBuilder) {
    this.carForm = this.fb.group({
      marca: ['', [Validators.required, Validators.maxLength(255)]],
      model: ['', [Validators.required, Validators.maxLength(255)]],
      an_fabricatie: ['', [
        Validators.required, 
        Validators.min(1900), 
        Validators.max(new Date().getFullYear())
      ]],
      capacitate_cilindrica: ['', [
        Validators.required, 
        Validators.min(0), 
        Validators.max(9999)
      ]],
      taxa_impozit: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.carForm.get('capacitate_cilindrica')?.valueChanges.subscribe(cc => {
      if (cc) {
        this.calculateTax(cc);
      }
    });
    
    // Monitorizează schimbarea mărcii pentru a sugera modele
    this.carForm.get('marca')?.valueChanges.subscribe(brand => {
      // Resetează modelul când se schimbă marca
      if (brand && this.modelSuggestions[brand]) {
        this.carForm.get('model')?.setValue('');
      }
    });
    
    // Setează un an de fabricație implicit (anul curent)
    if (!this.car) {
      this.carForm.get('an_fabricatie')?.setValue(new Date().getFullYear());
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.car && this.car) {
      this.title = 'Editează Mașină';
      this.carForm.patchValue({
        marca: this.car.marca,
        model: this.car.model,
        an_fabricatie: this.car.an_fabricatie,
        capacitate_cilindrica: this.car.capacitate_cilindrica,
        taxa_impozit: this.car.taxa_impozit
      });
      this.calculateTax(this.car.capacitate_cilindrica);
    } else {
      this.title = 'Adaugă Mașină';
      this.carForm.reset();
      this.carForm.get('taxa_impozit')?.disable();
      this.carForm.get('an_fabricatie')?.setValue(new Date().getFullYear());
      this.taxInfo = { 
        amount: 0,
        category: ''
      };
    }
  }

  calculateTax(capacitate: number): void {
    let taxa = 0;
    let category = '';
    
    if (capacitate < 1500) {
      taxa = 50;
      category = 'low';
    } else if (capacitate >= 1500 && capacitate <= 2000) {
      taxa = 100;
      category = 'medium';
    } else {
      taxa = 200;
      category = 'high';
    }
    
    this.carForm.get('taxa_impozit')?.setValue(taxa);
    this.taxInfo = {
      amount: taxa,
      category: category
    };
  }
  
  // Verifică dacă există sugestii de modele pentru marca selectată
  hasModelSuggestions(): boolean {
    const marca = this.carForm.get('marca')?.value;
    return marca && this.modelSuggestions[marca] && this.modelSuggestions[marca].length > 0;
  }
  
  // Obține modelele sugerate pentru marca selectată
  getModelSuggestions(): string[] {
    const marca = this.carForm.get('marca')?.value;
    return marca ? (this.modelSuggestions[marca] || []) : [];
  }
  
  // Selectează un model sugerat
  selectModel(model: string): void {
    this.carForm.get('model')?.setValue(model);
  }
  
  // Generează un placeholder pentru taxa de impozit
  getTaxPlaceholder(): string {
    const cc = this.carForm.get('capacitate_cilindrica')?.value;
    if (!cc) return 'Se calculează automat';
    return `${this.taxInfo.amount} lei`;
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.carForm.invalid) {
      return;
    }

    const formData = this.carForm.getRawValue();
    const carData: Car = {
      marca: formData.marca,
      model: formData.model,
      an_fabricatie: formData.an_fabricatie,
      capacitate_cilindrica: formData.capacitate_cilindrica,
      taxa_impozit: formData.taxa_impozit
    };

    if (this.car && this.car.id) {
      carData.id = this.car.id;
    }

    this.save.emit(carData);
  }

  onClose(): void {
    this.close.emit();
  }

  get f() { 
    return this.carForm.controls; 
  }
} 