@echo off
REM Build script for GARCH Model UI (Windows)
REM Make sure Qt6 and CMake are installed and in PATH

echo Building GARCH Model UI...
echo.

REM Create build directory
if not exist build mkdir build
cd build

setlocal

REM Configure with CMake
REM Update these paths if your Qt install lives elsewhere
set QT_MSVC_PATH=C:\Qt\6.10.1\msvc2022_64
set QT_MINGW_PATH=C:\Qt\6.10.1\mingw_64
set MINGW_TOOLS=C:\Qt\Tools\mingw1310_64
set GENERATOR=""

if exist "%QT_MSVC_PATH%" (
    echo Using Qt MSVC kit at %QT_MSVC_PATH%
    cmake .. -DCMAKE_PREFIX_PATH="%QT_MSVC_PATH%" -G "Visual Studio 17 2022" -A x64
    set GENERATOR=MSVC
) else (
    if exist "%QT_MINGW_PATH%" (
        echo Using Qt MinGW kit at %QT_MINGW_PATH%
        if exist "%MINGW_TOOLS%\bin\mingw32-make.exe" (
            echo Using MinGW tools at %MINGW_TOOLS%
            set "PATH=%MINGW_TOOLS%\bin;%QT_MINGW_PATH%\bin;%PATH%"
        ) else (
            echo WARNING: MinGW tools not found at %MINGW_TOOLS%\bin
            echo Trying with Qt MinGW bin only...
            set "PATH=%QT_MINGW_PATH%\bin;%PATH%"
        )
        cmake .. -DCMAKE_PREFIX_PATH="%QT_MINGW_PATH%" -G "MinGW Makefiles"
        set GENERATOR=MINGW
    ) else (
        echo.
        echo Could not locate a Qt installation at:
        echo   %QT_MSVC_PATH%
        echo   %QT_MINGW_PATH%
        echo Please edit build_ui.bat and set the correct paths.
        pause
        exit /b 1
    )
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
if "%GENERATOR%"=="MSVC" (
    cmake --build . --config Release
) else (
    cmake --build .
)

if errorlevel 1 (
    echo.
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Build successful!
if "%GENERATOR%"=="MSVC" (
    echo Executable: build\Release\GarchModelUI.exe
) else (
    echo Executable: build\GarchModelUI.exe
)
echo.
pause



