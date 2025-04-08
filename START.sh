#!/bin/bash

echo "=== Pornire aplicație Gestionare Date Auto-Persoane ==="

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

# Verificare pentru existență .env
if [ ! -f "server/.env" ]; then
    if [ -f "server/.env.example" ]; then
        echo "Creez fișierul .env din șablonul .env.example..."
        cp server/.env.example server/.env
        echo "Editați fișierul server/.env pentru a configura conexiunea la baza de date!"
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
    cd client && npm install && cd ..
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

echo "=== Aplicația rulează! ==="
echo "Server backend: http://localhost:3000"
echo "Aplicație client: http://localhost:4200"
echo ""
echo "Apăsați CTRL+C pentru a opri aplicația"

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
