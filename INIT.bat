@echo off
echo ======================================================
echo === Initializare Aplicatie Gestionare Date Auto-Persoane ===
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
    echo ERROR: PostgreSQL nu este instalat sau nu este in PATH!
    echo Vizitati https://www.postgresql.org/download/ pentru instalare.
    pause
    exit /b 1
)

echo Toate dependentele necesare sunt instalate. Initializare proiect...

:: Initializare baza de date PostgreSQL
echo ======================================================
echo === Configurare baza de date PostgreSQL ===
echo ======================================================
echo.

:: Setare credentiale PostgreSQL
set /p pg_user=Introduceti utilizator PostgreSQL (implicit: postgres): 
if "%pg_user%"=="" set pg_user=postgres

set /p pg_password=Introduceti parola pentru utilizatorul '%pg_user%': 
if "%pg_password%"=="" set pg_password=postgres

set /p db_name=Introduceti numele bazei de date (implicit: auto_persoane): 
if "%db_name%"=="" set db_name=auto_persoane

:: Incercare creare baza de date
echo Crearea bazei de date '%db_name%'...
set PGPASSWORD=%pg_password%
psql -U %pg_user% -c "CREATE DATABASE %db_name%;" 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo AVERTISMENT: Nu am putut crea baza de date. Verificati credentialele sau poate baza de date exista deja.
    
    :: Verificam daca baza de date exista
    psql -U %pg_user% -c "SELECT 1 FROM pg_database WHERE datname='%db_name%'" | findstr /C:"1 row" >nul
    if %ERRORLEVEL% NEQ 0 (
        echo Baza de date nu exista si nu a putut fi creata. Verificati credentialele PostgreSQL.
        pause
        exit /b 1
    ) else (
        echo Baza de date '%db_name%' exista deja. Continuam configurarea.
    )
) else (
    echo Baza de date '%db_name%' a fost creata cu succes!
)

:: Configurare .env pentru server
echo ======================================================
echo === Configurare server ===
echo ======================================================
echo.

if not exist "server\.env" (
    if exist "server\.env.example" (
        echo Creez fisierul .env din sablonul .env.example...
        copy "server\.env.example" "server\.env" >nul
    ) else (
        echo ERROR: Fisierul .env.example nu exista.
        pause
        exit /b 1
    )
)

:: Actualizare .env cu valorile introduse
echo Actualizare configuratii in fisierul .env...
powershell -Command "(Get-Content server\.env) -replace 'DB_USER=postgres', 'DB_USER=%pg_user%' | Set-Content server\.env"
powershell -Command "(Get-Content server\.env) -replace 'DB_PASSWORD=postgres', 'DB_PASSWORD=%pg_password%' | Set-Content server\.env"
powershell -Command "(Get-Content server\.env) -replace 'DB_NAME=auto_persoane', 'DB_NAME=%db_name%' | Set-Content server\.env"

:: Verifică și actualizează URL-ul API în environment.ts
powershell -Command "if (Select-String -Path client\src\environments\environment.ts -Pattern 'apiUrl: ''http://localhost:8080/api''') { exit 0 } else { exit 1 }" >nul
if %ERRORLEVEL% EQU 0 (
    echo Actualizez URL-ul API in client\src\environments\environment.ts...
    powershell -Command "(Get-Content client\src\environments\environment.ts) -replace 'apiUrl: ''http://localhost:8080/api''', 'apiUrl: ''http://localhost:3000/api''' | Set-Content client\src\environments\environment.ts"
    echo URL-ul API a fost actualizat in environment.ts!
)

:: Instalare dependente
echo ======================================================
echo === Instalare dependente ===
echo ======================================================
echo.

echo Instalare dependente server...
cd server && npm install && cd ..

echo Instalare dependente client...
cd client && npm install --legacy-peer-deps && cd ..

echo ======================================================
echo === Initializare completa! ===
echo ======================================================
echo Pentru a porni aplicatia, executati:
echo START.bat
echo ======================================================
echo.

pause 