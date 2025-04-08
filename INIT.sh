#!/bin/bash

echo "======================================================"
echo "=== Inițializare Aplicație Gestionare Date Auto-Persoane ==="
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
    echo "ERROR: PostgreSQL nu este instalat sau nu este disponibil în PATH!"
    echo "Vizitați https://www.postgresql.org/download/ pentru instalare."
    exit 1
fi

echo "Toate dependențele necesare sunt instalate. Inițializare proiect..."

# Inițializare bază de date PostgreSQL
echo "======================================================"
echo "=== Configurare bază de date PostgreSQL ==="
echo "======================================================"

# Setare credențiale PostgreSQL
read -p "Introduceți utilizator PostgreSQL (implicit: postgres): " pg_user
pg_user=${pg_user:-postgres}

read -s -p "Introduceți parola pentru utilizatorul '$pg_user': " pg_password
echo ""
pg_password=${pg_password:-postgres}

read -p "Introduceți numele bazei de date (implicit: auto_persoane): " db_name
db_name=${db_name:-auto_persoane}

# Încercăm să creăm baza de date
echo "Crearea bazei de date '$db_name'..."
PGPASSWORD="$pg_password" psql -U "$pg_user" -c "CREATE DATABASE $db_name;" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "AVERTISMENT: Nu am putut crea baza de date. Verificați credențialele sau poate baza de date există deja."
    
    # Verificăm dacă baza de date există
    if PGPASSWORD="$pg_password" psql -U "$pg_user" -lqt | cut -d \| -f 1 | grep -qw "$db_name"; then
        echo "Baza de date '$db_name' există deja. Continuăm configurarea."
    else
        echo "Baza de date nu există și nu a putut fi creată. Verificați credențialele PostgreSQL."
        exit 1
    fi
else
    echo "Baza de date '$db_name' a fost creată cu succes!"
fi

# Configurare .env pentru server
echo "======================================================"
echo "=== Configurare server ==="
echo "======================================================"

if [ ! -f "server/.env" ]; then
    if [ -f "server/.env.example" ]; then
        echo "Creez fișierul .env din șablonul .env.example..."
        cp server/.env.example server/.env
    else
        echo "ERROR: Fișierul .env.example nu există."
        exit 1
    fi
fi

# Actualizare .env cu valorile introduse
echo "Actualizare configurații în fișierul .env..."
sed -i.bak "s/DB_USER=postgres/DB_USER=$pg_user/g" server/.env
sed -i.bak "s/DB_PASSWORD=postgres/DB_PASSWORD=$pg_password/g" server/.env
sed -i.bak "s/DB_NAME=auto_persoane/DB_NAME=$db_name/g" server/.env

# Șterge fișierul de backup
rm -f server/.env.bak

# Verifică și actualizează URL-ul API în environment.ts
if grep -q "apiUrl: 'http://localhost:8080/api'" client/src/environments/environment.ts; then
    echo "Actualizez URL-ul API în client/src/environments/environment.ts..."
    sed -i.bak 's|apiUrl: '"'"'http://localhost:8080/api'"'"'|apiUrl: '"'"'http://localhost:3000/api'"'"'|g' client/src/environments/environment.ts
    rm -f client/src/environments/environment.ts.bak
    echo "URL-ul API a fost actualizat în environment.ts!"
fi

# Instalare dependențe
echo "======================================================"
echo "=== Instalare dependențe ==="
echo "======================================================"

echo "Instalare dependențe server..."
cd server && npm install && cd ..

echo "Instalare dependențe client..."
cd client && npm install --legacy-peer-deps && cd ..

# Verificare permisiuni pentru START.sh
if [ -f "START.sh" ]; then
    echo "Adăugare permisiuni de execuție pentru START.sh..."
    chmod +x START.sh
fi

echo "======================================================"
echo "=== Inițializare completă! ==="
echo "======================================================"
echo "Pentru a porni aplicația, executați:"
echo "./START.sh"
echo "======================================================" 