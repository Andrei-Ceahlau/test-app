# Ghid de pornire rapidă

Acest ghid conține instrucțiuni pentru a porni aplicația rapid, fără a citi documentația completă din README.md.

## Metoda 1: Folosirea scripturilor automate (recomandat)

### Pentru utilizatorii Linux/Mac:

1. Deschideți un terminal în directorul aplicației
2. Executați comanda:
   ```
   ./START.sh
   ```
3. Deschideți browserul la adresa: http://localhost:4200

### Pentru utilizatorii Windows:

1. Faceți dublu-click pe fișierul `START.bat` din directorul aplicației
2. Așteptați inițializarea aplicației (va deschide două terminale)
3. Deschideți browserul la adresa: http://localhost:4200

## Metoda 2: Pornire manuală

### Pasul 1: Configurare .env (doar prima dată)

Copiați fișierul .env.example în .env și editați-l:

```
cd server
cp .env.example .env
```

Apoi editați fișierul .env cu datele corecte pentru conectarea la baza de date.

### Pasul 2: Instalare dependențe (doar prima dată)

```
# Instalare dependențe server
cd server
npm install

# Instalare dependențe client
cd ../client
npm install
```

### Pasul 3: Pornire aplicație

```
# Terminal 1 - pentru server
cd server
npm start

# Terminal 2 - pentru client
cd client
npm start
```

## Acces la aplicație

După pornire, aplicația va fi disponibilă la adresa:

- Front-end: http://localhost:4200
- Back-end API: http://localhost:3000

## Troubleshooting

### Erori OpenSSL

Dacă întâmpinați erori legate de OpenSSL, folosiți:

```
cd client
NODE_OPTIONS="--openssl-legacy-provider" npm start
```

### Portul 4200 este ocupat

Alegeți un alt port pentru client:

```
cd client
npm start -- --port=4201
```

Pentru mai multe detalii, consultați README.md.
