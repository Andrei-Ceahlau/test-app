# Aplicație Gestionare Date Auto-Persoane

Această aplicație permite gestionarea relațiilor dintre persoane și automobilele deținute de acestea. Aplicația include atât o parte de frontend (Angular) cât și backend (Node.js cu Express și PostgreSQL).

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
- PostgreSQL (versiunea 12 sau mai nouă)

# Instalare și pornire

## Configurare

### 1. Instalare PostgreSQL

1. Descarcă PostgreSQL de la [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
2. Urmează pașii de instalare standard
3. Creează:
   - Un utilizator 'postgres' cu parola 'postgres' (sau folosește utilizatorul implicit)
   - O bază de date 'auto_persoane'

### 2. Clonare repository

```bash
git clone https://github.com/username/auto-persoane-app.git
cd auto-persoane-app
```

### 3. Configurare variabile de mediu

```bash
# În directorul rădăcină al proiectului
cp server/.env.example server/.env
# Editați server/.env dacă este necesar pentru a configura conexiunea la baza de date
```

Exemplu de fișier `.env`:

```
PORT=3000
NODE_ENV=development

# Database settings
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=auto_persoane
```

## Pornire aplicație

⚠️ **IMPORTANT**: Folosiți comenzi cu paths complete, NU comenzi cu "../" care pot cauza erori!

### Metoda 1: Manual (recomandată pentru dezvoltare)

```bash
# Terminal 1 - Pornire server (din directorul rădăcină)
cd server
npm install
node app.js

# Terminal 2 - Pornire client (din directorul rădăcină)
cd client
npm install --legacy-peer-deps
npm start
```

### Metoda 2: Automată (recomandată pentru utilizare rapidă)

```bash
# Linux/macOS
chmod +x START.sh
./START.sh

# Windows
START.bat
```

## Acces aplicație

- Frontend: http://localhost:4200
- API: http://localhost:3000/api

## Structura directorului

- `/client` - Aplicația Angular (frontend)
- `/server` - API-ul Node.js/Express (backend)
  - `/models` - Modele Sequelize pentru baza de date
  - `/routes` - Rutele API
  - `/controllers` - Controllere pentru operațiile CRUD

## Troubleshooting

### Erori de API

Dacă primiți erori de tipul "Http failure response for http://localhost:8080/api/...", verificați:

1. Că serverul rulează pe portul 3000
2. Că fișierul `client/src/environments/environment.ts` are `apiUrl` configurat corect la 'http://localhost:3000/api'

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

### Probleme de conectare la baza de date

Verificați că:

1. PostgreSQL rulează
2. Ați creat baza de date 'auto_persoane'
3. Credențialele din fișierul `.env` sunt corecte
4. Nu există firewall care să blocheze conexiunea

## Contribuții și suport

Pentru probleme sau întrebări, deschideți un issue pe GitHub sau contactați echipa de dezvoltare.
