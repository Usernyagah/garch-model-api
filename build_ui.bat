@echo off
REM Build script for GARCH Model UI (Windows)
REM Make sure Qt6 and CMake are installed and in PATH

echo Building GARCH Model UI...
echo.

REM Create build directory
if not exist build mkdir build
cd build

REM Configure with CMake
REM Adjust the Qt path below to match your installation
set QT_PATH=C:\Qt\6.7.0\msvc2019_64
if not exist "%QT_PATH%" (
    echo Warning: Qt path not found at %QT_PATH%
    echo Please edit this script and set the correct Qt path
    echo.
    echo Attempting to find Qt automatically...
    cmake .. -G "Visual Studio 17 2022" -A x64
) else (
    cmake .. -DCMAKE_PREFIX_PATH="%QT_PATH%" -G "Visual Studio 17 2022" -A x64
)

if errorlevel 1 (
    echo.
    echo CMake configuration failed!
    echo Please ensure:
    echo   1. Qt6 is installed
    echo   2. CMake is in PATH
    echo   3. Visual Studio is installed (for MSVC) or MinGW is available
    pause
    exit /b 1
)

echo.
echo Building project...
cmake --build . --config Release

if errorlevel 1 (
    echo.
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Build successful!
echo Executable: build\Release\GarchModelUI.exe
echo.
pause

