# Build script for GARCH Model UI

# Create build directory if it doesn't exist
if (!(Test-Path -Path "build")) {
    New-Item -ItemType Directory -Path "build"
}

# Change to build directory
Set-Location "build"

# Run CMake configuration
try {
    cmake -G "Visual Studio 17 2022" -A x64 ..
    
    # Build the project
    cmake --build . --config Release
    
    Write-Host "Build completed successfully!" -ForegroundColor Green
    Write-Host "You can find the executable in the build/Release/ directory." -ForegroundColor Cyan
} catch {
    Write-Host "An error occurred during the build process:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# Return to the original directory
Set-Location ..
