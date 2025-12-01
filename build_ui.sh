#!/bin/bash
# Build script for GARCH Model UI (Linux/macOS)

echo "Building GARCH Model UI..."
echo

# Create build directory
mkdir -p build
cd build

# Configure with CMake
# For macOS with Homebrew Qt
if [[ "$OSTYPE" == "darwin"* ]]; then
    QT_PATH=$(brew --prefix qt@6 2>/dev/null)
    if [ -n "$QT_PATH" ]; then
        cmake .. -DCMAKE_PREFIX_PATH="$QT_PATH"
    else
        echo "Warning: Qt6 not found via Homebrew"
        echo "Attempting default CMake configuration..."
        cmake ..
    fi
else
    # Linux - assume Qt6 is in standard locations
    cmake ..
fi

if [ $? -ne 0 ]; then
    echo
    echo "CMake configuration failed!"
    echo "Please ensure Qt6 development packages are installed:"
    echo "  Ubuntu/Debian: sudo apt-get install qt6-base-dev qt6-tools-dev"
    echo "  Fedora: sudo dnf install qt6-qtbase-devel qt6-qttools-devel"
    exit 1
fi

echo
echo "Building project..."
make

if [ $? -ne 0 ]; then
    echo
    echo "Build failed!"
    exit 1
fi

echo
echo "Build successful!"
echo "Executable: build/GarchModelUI"
echo



