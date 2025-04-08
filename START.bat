@echo off
echo === Pornire aplicatie Gestionare Date Auto-Persoane ===
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

:: Verificare fisier .env
if not exist "server\.env" (
    if exist "server\.env.example" (
        echo Creez fisierul .env din sablonul .env.example...
        copy "server\.env.example" "server\.env" >nul
        echo Editati fisierul server\.env pentru a configura conexiunea la baza de date!
    ) else (
        echo AVERTISMENT: Fisierul .env.example nu exista. Va rugam sa creati manual un fisier .env in directorul server\
    )
)

:: Instalare dependente server
if not exist "server\node_modules" (
    echo Instalare dependente server...
    cd server && npm install && cd ..
)

:: Instalare dependente client
if not exist "client\node_modules" (
    echo Instalare dependente client...
    cd client && npm install && cd ..
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
echo === Aplicatia ruleaza! ===
echo Server backend: http://localhost:3000
echo Aplicatie client: http://localhost:4200
echo.
echo Inchideti ferestrele de terminal pentru a opri aplicatia
echo.

pause 