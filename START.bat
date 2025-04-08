@echo off
echo ======================================================
echo === Pornire aplicatie Gestionare Date Auto-Persoane ===
echo ======================================================
echo.

:: Verificare Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js nu este instalat! Instalati Node.js de la https://nodejs.org/
    pause
    exit /b 1
)

:: Verificare npm
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm nu este instalat! Acesta ar trebui sa fie instalat impreuna cu Node.js.
    pause
    exit /b 1
)

:: Verificare PostgreSQL
where psql >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo AVERTISMENT: PostgreSQL nu este instalat sau nu este in PATH!
    echo Va trebui sa instalati PostgreSQL si sa configurati baza de date manual.
    echo Vizitati https://www.postgresql.org/download/ pentru instalare.
    echo.
    set /p continue_anyway=Doriti sa continuati oricum? (y/n): 
    if /I NOT "%continue_anyway%"=="y" (
        exit /b 1
    )
) else (
    echo PostgreSQL este instalat.
    
    :: Incercare creare baza de date
    echo Incercare creare baza de date 'auto_persoane' daca nu exista...
    psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='auto_persoane'" | findstr /C:"1 row" >nul
    if %ERRORLEVEL% NEQ 0 (
        echo Baza de date 'auto_persoane' nu exista. Incercam sa o cream...
        set PGPASSWORD=postgres
        psql -U postgres -c "CREATE DATABASE auto_persoane;"
        if %ERRORLEVEL% NEQ 0 (
            echo Nu am putut crea baza de date automat. Va rugam sa o creati manual.
            echo Comanda SQL pentru creare este: CREATE DATABASE auto_persoane;
        ) else (
            echo Baza de date 'auto_persoane' a fost creata cu succes!
        )
    ) else (
        echo Baza de date 'auto_persoane' exista deja.
    )
)

:: Verificare fisier .env
if not exist "server\.env" (
    if exist "server\.env.example" (
        echo Creez fisierul .env din sablonul .env.example...
        copy "server\.env.example" "server\.env" >nul
        
        :: Actualizare fisier .env pentru PostgreSQL
        echo Configurare fisier .env pentru PostgreSQL...
        powershell -Command "(Get-Content server\.env) -replace 'DB_PORT=3306', 'DB_PORT=5432' | Set-Content server\.env"
        powershell -Command "(Get-Content server\.env) -replace 'DB_USER=root', 'DB_USER=postgres' | Set-Content server\.env"
        powershell -Command "(Get-Content server\.env) -replace 'DB_PASSWORD=parola_ta', 'DB_PASSWORD=postgres' | Set-Content server\.env"
        powershell -Command "(Get-Content server\.env) -replace 'DB_NAME=numele_bazei_de_date', 'DB_NAME=auto_persoane' | Set-Content server\.env"
        
        echo Fisierul server\.env a fost creat si configurat pentru PostgreSQL!
        echo Daca aveti nevoie sa modificati credentialele, editati fisierul server\.env
    ) else (
        echo AVERTISMENT: Fisierul .env.example nu exista. Va rugam sa creati manual un fisier .env in directorul server\
    )
)

:: Verificare URL API in environment.ts
powershell -Command "if (Select-String -Path client\src\environments\environment.ts -Pattern 'apiUrl: ''http://localhost:8080/api''') { exit 0 } else { exit 1 }" >nul
if %ERRORLEVEL% EQU 0 (
    echo Actualizez URL-ul API in client\src\environments\environment.ts...
    powershell -Command "(Get-Content client\src\environments\environment.ts) -replace 'apiUrl: ''http://localhost:8080/api''', 'apiUrl: ''http://localhost:3000/api''' | Set-Content client\src\environments\environment.ts"
    echo URL-ul API a fost actualizat in environment.ts!
)

:: Instalare dependente server
if not exist "server\node_modules" (
    echo Instalare dependente server...
    cd server && npm install && cd ..
)

:: Instalare dependente client
if not exist "client\node_modules" (
    echo Instalare dependente client...
    cd client && npm install --legacy-peer-deps && cd ..
)

:: Pornire server
echo Pornire server backend...
start "Server Backend" cmd /c "cd server && npm start"

:: Asteptare pentru initializarea serverului
echo Asteptare pentru initializarea serverului (5 secunde)...
timeout /T 5 /NOBREAK >nul

:: Pornire client
echo Pornire aplicatie client Angular...
start "Client Angular" cmd /c "cd client && npm start"

echo.
echo ======================================================
echo === Aplicatia ruleaza! ===
echo ======================================================
echo Server backend: http://localhost:3000
echo API Endpoint: http://localhost:3000/api
echo Aplicatie client: http://localhost:4200
echo.
echo Inchideti ferestrele de terminal pentru a opri aplicatia
echo ======================================================
echo.

pause 