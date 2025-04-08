# Aplicație Gestionare Date Auto-Persoane

Această aplicație permite gestionarea relațiilor dintre persoane și automobilele deținute de acestea. Aplicația include atât o parte de frontend (Angular) cât și backend (Node.js cu Express).

## Caracteristici

- Gestiunea persoanelor (adăugare, editare, ștergere)
- Gestiunea automobilelor (adăugare, editare, ștergere)
- Asocierea automobilelor cu proprietarii
- Validare CNP cu extragere automată de informații (vârstă, gen, județ)
- Calculare automată a taxei de impozit în funcție de capacitatea cilindrică
- Interfață responsivă (desktop și mobil)

## Cerințe sistem

- Node.js v14+
- npm v6+
- MySQL/MariaDB

## Instalare rapidă

### 1. Clonați repository-ul

```bash
git clone https://github.com/username/carpeople-management.git
cd carpeople-management
```

### 2. Configurați baza de date

- Creați o bază de date MySQL
- Importați structura din fișierul `database.sql` (dacă există) sau folosiți migrările automate (vezi pașii următori)

### 3. Configurați serverul backend

```bash
cd server
npm install
```

Creați un fișier `.env` în directorul `server` cu următorul conținut:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=parola_ta
DB_NAME=numele_bazei_de_date
PORT=3000
```

### 4. Configurați aplicația frontend

```bash
cd ../client
npm install
```

### 5. Porniți aplicația

#### Backend (Server)

```bash
cd server
npm start
```

Serverul va rula pe portul 3000 (sau portul specificat în `.env`).

#### Frontend (Client)

```bash
cd client
npm start
```

Aplicația frontend va rula pe portul 4200. Deschideți browserul la adresa http://localhost:4200

## Troubleshooting

### Probleme cu Node.js și OpenSSL

Dacă întâmpinați erori legate de OpenSSL, folosiți opțiunea legacy provider:

```bash
cd client
NODE_OPTIONS="--openssl-legacy-provider" npm start
```

### Port deja în folosință

Dacă portul 4200 este deja folosit, puteți alege alt port manual:

```bash
cd client
npm start -- --port=4201
```

## Structura directorului

- `/client` - Aplicația Angular (frontend)
- `/server` - API-ul Node.js/Express (backend)
  - `/models` - Modele Sequelize pentru baza de date
  - `/routes` - Rutele API
  - `/controllers` - Controllere pentru operațiile CRUD

## Contribuții și suport

Pentru probleme sau întrebări, deschideți un issue pe GitHub sau contactați echipa de dezvoltare.
