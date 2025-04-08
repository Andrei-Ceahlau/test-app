# Test App - Aplicație pentru Gestionarea Persoanelor și Mașinilor

Aplicație web dezvoltată cu Angular (frontend) și Node.js/Express/PostgreSQL (backend) pentru gestionarea persoanelor și mașinilor asociate acestora.

## Cerințe sistem

- Node.js (recomandat versiunea 14.x sau 16.x)
- PostgreSQL (versiunea 12 sau mai nouă)
- Redis (pentru Windows: descarcă de la https://github.com/zkteco-home/redis-windows/releases/tag/redis7.0.5)

## Instalare

### 1. Descărcarea codului

```bash
git clone https://github.com/username/test-app-persons-cars.git
cd test-app-persons-cars
```

### 2. Instalare dependențe server

```bash
npm install
npm install nodemon@2.0.7 -g
```

### 3. Instalare dependențe client

```bash
cd client
npm install
cd ..
```

### 4. Configurare baza de date

#### Instalare PostgreSQL

- Descarcă PostgreSQL de la: https://www.postgresql.org/download/
- Urmează pașii de instalare standard
- Reține parola master setată în timpul instalării
- Asigură-te că portul implicit 5432 este configurat

#### Instalare PGAdmin

- Descarcă PGAdmin de la: https://www.pgadmin.org/download/pgadmin-4-windows/
- Instalează ultima versiune
- Reține credențialele de autentificare

#### Creare bază de date

- Deschide PGAdmin și autentifică-te
- Creează o nouă bază de date numită `persons`

### 5. Configurare Redis (pentru Windows)

- Descarcă Redis de la: https://github.com/zkteco-home/redis-windows/releases/tag/redis7.0.5
- Extrage arhiva și rulează `redis-server.exe`

### 6. Configurare fișier .env

Creează un fișier `.env` în directorul rădăcină cu următorul conținut:

```
PORT=8080
NODE_ENV=dev
DATABASE_URL=postgres://postgres:PAROLA_POSTGRES@localhost:5432/persons
RUN_CRON=true
```

(Înlocuiește PAROLA_POSTGRES cu parola setată la instalarea PostgreSQL)

## Pornire aplicație

### 1. Pornire server backend

Din directorul rădăcină:

```bash
nodemon
```

Dacă totul este configurat corect, vei vedea:

```
[nodemon] starting `node ./server/app.js`
Database connection successfully.
Listening on port: 8080, env: dev
```

### 2. Pornire client frontend

Deschide un nou terminal, navighează în directorul client și pornește aplicația:

```bash
cd client
npm start
```

Aplicația va rula pe http://localhost:4200/ (sau pe un alt port dacă 4200 este ocupat)

## Funcționalități

- Gestionare persoane (adăugare, editare, ștergere)
- Gestionare mașini (adăugare, editare, ștergere)
- Asociere mașini cu persoane
- Calcul automat al vârstei din CNP
- Calcul automat al taxei de impozit în funcție de capacitatea cilindrică
- Interfață responsivă pentru dispozitive mobile

## Tehnologii utilizate

- **Frontend**: Angular, Bootstrap, Font Awesome
- **Backend**: Node.js, Express.js
- **Baze de date**: PostgreSQL, Redis
