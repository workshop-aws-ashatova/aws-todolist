function Build-Layer {
    param(
        [string]$layerDirectory
    )
    
    $layerDirectory = $layerDirectory -replace "`r"
    $currentDirectory = Get-Location
    
    Write-Host "Building Layer -> $layerDirectory"
    
    # Positioning in layer folder
    cd $layerDirectory
    
    # Cleaning dependencies
    if (Test-Path .\nodejs) {
        Remove-Item -Recurse -Force -Path .\nodejs
    }
    
    # Copying package.json
    New-Item -ItemType Directory -Name nodejs | Out-Null
    Copy-Item -Path .\package.json -Destination .\nodejs
    
    # Installing dependencies
    cd .\nodejs
    New-Item -ItemType Directory -Name node_modules | Out-Null
    npm install
    cd ..
    
    # Copying .js files to node_modules
    Copy-Item -Path .\*.js -Destination .\nodejs\node_modules
    
    cd $currentDirectory
}

# Build layers
$layerDirectories = Get-ChildItem -Directory -Path .\layers\*
foreach ($layerDirectory in $layerDirectories) {
    Build-Layer -layerDirectory $layerDirectory.FullName
}
