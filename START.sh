#!/bin/bash

echo "======================================================"
echo "=== Pornire aplicație Gestionare Date Auto-Persoane ==="
echo "======================================================"

# Verificare pentru existența Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js nu este instalat! Instalează Node.js de la https://nodejs.org/"
    exit 1
fi

# Verificare pentru existența npm
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm nu este instalat! Acesta ar trebui să fie instalat împreună cu Node.js."
    exit 1
fi

# Verificare pentru existența PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "AVERTISMENT: PostgreSQL nu este instalat sau nu este disponibil în PATH!"
    echo "Va trebui să instalați PostgreSQL și să configurați baza de date manual."
    echo "Vizitați https://www.postgresql.org/download/ pentru instalare."
    
    read -p "Doriți să continuați oricum? (y/n): " continue_anyway
    if [[ "$continue_anyway" != "y" && "$continue_anyway" != "Y" ]]; then
        exit 1
    fi
else
    echo "PostgreSQL este instalat."
    
    # Inițializare bază de date dacă nu există
    if ! psql -lqt | cut -d \| -f 1 | grep -qw auto_persoane; then
        echo "Baza de date 'auto_persoane' nu există. Încercăm să o creăm..."
        
        # Încercăm cu utilizatorul postgres implicit
        if ! PGPASSWORD=postgres psql -U postgres -c "CREATE DATABASE auto_persoane;" 2>/dev/null; then
            echo "Nu am putut crea baza de date automat. Vă rugăm să o creați manual."
            echo "Comanda psql pentru creare este: CREATE DATABASE auto_persoane;"
        else
            echo "Baza de date 'auto_persoane' a fost creată cu succes!"
        fi
    else
        echo "Baza de date 'auto_persoane' există deja."
    fi
fi

# Verificare pentru existență .env
if [ ! -f "server/.env" ]; then
    if [ -f "server/.env.example" ]; then
        echo "Creez fișierul .env din șablonul .env.example..."
        cp server/.env.example server/.env
        
        # Setează valorile pentru PostgreSQL
        sed -i.bak 's/DB_PORT=3306/DB_PORT=5432/g' server/.env
        sed -i.bak 's/DB_USER=root/DB_USER=postgres/g' server/.env
        sed -i.bak 's/DB_PASSWORD=parola_ta/DB_PASSWORD=postgres/g' server/.env
        sed -i.bak 's/DB_NAME=numele_bazei_de_date/DB_NAME=auto_persoane/g' server/.env
        
        # Șterge fișierul de backup creat de sed (pentru macOS)
        rm -f server/.env.bak
        
        echo "Fișierul server/.env a fost creat și configurat pentru PostgreSQL!"
        echo "Dacă aveți nevoie să modificați credențialele, editați fișierul server/.env"
    else
        echo "AVERTISMENT: Fișierul .env.example nu există. Vă rugăm să creați manual un fișier .env în directorul server/"
    fi
fi

# Instalare dependențe server dacă nu există directorul node_modules
if [ ! -d "server/node_modules" ]; then
    echo "Instalare dependențe server..."
    cd server && npm install && cd ..
fi

# Instalare dependențe client dacă nu există directorul node_modules
if [ ! -d "client/node_modules" ]; then
    echo "Instalare dependențe client..."
    cd client && npm install --legacy-peer-deps && cd ..
fi

# Verifică dacă environment.ts are URL-ul corect
if grep -q "apiUrl: 'http://localhost:8080/api'" client/src/environments/environment.ts; then
    echo "Actualizez URL-ul API în client/src/environments/environment.ts..."
    sed -i.bak 's|apiUrl: '"'"'http://localhost:8080/api'"'"'|apiUrl: '"'"'http://localhost:3000/api'"'"'|g' client/src/environments/environment.ts
    rm -f client/src/environments/environment.ts.bak
    echo "URL-ul API a fost actualizat în environment.ts!"
fi

# Pornire server în fundal
echo "Pornire server backend..."
cd server && npm start &
SERVER_PID=$!
cd ..

# Așteptare pentru ca serverul să se inițializeze
echo "Așteptare pentru inițializarea serverului (5 secunde)..."
sleep 5

# Pornire client în fundal
echo "Pornire aplicație client Angular..."
cd client && npm start &
CLIENT_PID=$!

echo ""
echo "======================================================"
echo "=== Aplicația rulează! ==="
echo "======================================================"
echo "Server backend: http://localhost:3000"
echo "API Endpoint: http://localhost:3000/api"
echo "Aplicație client: http://localhost:4200"
echo ""
echo "Apăsați CTRL+C pentru a opri aplicația"
echo "======================================================"

# Funcție pentru oprire procese la închidere
cleanup() {
    echo ""
    echo "Oprire aplicație..."
    
    # Oprire client
    if [ -n "$CLIENT_PID" ]; then
        kill $CLIENT_PID 2>/dev/null
    fi
    
    # Oprire server
    if [ -n "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null
    fi
    
    echo "Aplicația a fost oprită cu succes!"
    exit 0
}

# Înregistrare handler pentru CTRL+C
trap cleanup SIGINT

# Așteaptă ca procesele să se termine
wait
