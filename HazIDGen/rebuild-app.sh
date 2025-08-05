#!/bin/bash

# HazIDGen Application Builder Script
# CERN CMS Safety - Version 1.0.0

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get OS
get_os() {
    case "$(uname -s)" in
        Linux*)     echo "linux";;
        Darwin*)    echo "macos";;
        CYGWIN*)    echo "windows";;
        MINGW*)     echo "windows";;
        MSYS*)      echo "windows";;
        *)          echo "unknown";;
    esac
}

# Function to get architecture
get_arch() {
    case "$(uname -m)" in
        x86_64)     echo "x64";;
        aarch64)    echo "arm64";;
        armv7l)     echo "armv7l";;
        *)          echo "x64";;
    esac
}

# Main script
main() {
    echo "========================================"
    echo "    HazIDGen Application Builder"
    echo "    CERN CMS Safety - Version 1.0.0"
    echo "========================================"
    echo
    echo "Build started at: $(date)"
    echo "Current directory: $(pwd)"
    echo "OS: $(get_os) ($(get_arch))"
    echo

    # Check if we're in the correct directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in current directory"
        echo "Please run this script from the HazIDGen project root directory"
        echo
        exit 1
    fi

    print_status "Step 1/4: Checking prerequisites..."

    # Check Node.js
    if ! command_exists node; then
        print_error "Node.js is not installed or not in PATH"
        echo "Please install Node.js from https://nodejs.org/"
        echo
        exit 1
    else
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    fi

    # Check npm
    if ! command_exists npm; then
        print_error "npm is not installed or not in PATH"
        echo
        exit 1
    else
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
    fi

    echo
    print_status "Step 2/4: Installing dependencies..."
    echo "========================================"
    
    if npm install; then
        print_success "Dependencies installed successfully!"
    else
        print_error "npm install failed"
        echo "Please check your internet connection and try again"
        echo
        exit 1
    fi

    echo
    print_status "Step 3/4: Building application..."
    echo "========================================"
    
    if npm run build; then
        print_success "Build completed successfully!"
    else
        print_error "Build failed"
        echo "Please check the build configuration and try again"
        echo
        exit 1
    fi

    echo
    print_status "Step 4/4: Packaging application..."
    echo "========================================"
    
    # Determine the appropriate packaging command based on OS
    OS=$(get_os)
    case $OS in
        "linux")
            print_status "Packaging for Linux..."
            if npm run package-linux; then
                print_success "Linux packaging completed successfully!"
            else
                print_error "Linux packaging failed"
                exit 1
            fi
            ;;
        "macos")
            print_status "Packaging for macOS..."
            if npm run package-mac; then
                print_success "macOS packaging completed successfully!"
            else
                print_error "macOS packaging failed"
                exit 1
            fi
            ;;
        "windows")
            print_status "Packaging for Windows..."
            if npm run package-win; then
                print_success "Windows packaging completed successfully!"
            else
                print_error "Windows packaging failed"
                exit 1
            fi
            ;;
        *)
            print_warning "Unknown OS, trying Windows packaging..."
            if npm run package-win; then
                print_success "Packaging completed successfully!"
            else
                print_error "Packaging failed"
                exit 1
            fi
            ;;
    esac

    echo
    echo "========================================"
    echo "    🎉 BUILD COMPLETED SUCCESSFULLY!"
    echo "========================================"
    echo
    echo "📁 The standalone executable is located at:"
    echo "   $(pwd)/release-builds/"
    echo
    echo "🚀 You can now run the application by:"
    echo "   1. Navigating to the release-builds folder"
    echo "   2. Finding the appropriate executable for your platform"
    echo
    echo "📋 Build completed at: $(date)"
    echo
}

# Run main function
main "$@"