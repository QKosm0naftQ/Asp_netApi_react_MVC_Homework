@echo off

tasklist /FI "IMAGENAME eq Docker Desktop.exe" | find /I "Docker Desktop.exe" >nul
if errorlevel 1 (
    echo Docker Desktop starting ...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    :waitForDocker
    tasklist /FI "IMAGENAME eq Docker Desktop.exe" | find /I "Docker Desktop.exe" >nul
    if errorlevel 1 (
        timeout /t 10 /nobreak >nul
        goto waitForDocker
    )
    timeout /t 2 /nobreak >nul
    echo Docker Desktop successfuly started ...
) 

echo Changing directory api...
cd "WebApiPizushi"

echo Building Docker image api...
docker build -t pizushi-asp-api . 

echo Docker login...
docker login

echo Tagging Docker image api...
docker tag pizushi-asp-api:latest novakvova/pizushi-asp-api:latest

echo Pushing Docker image api to repository...
docker push novakvova/pizushi-asp-api:latest

echo Done ---api---!
pause
