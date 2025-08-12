Write-Host "Corrigiendo errores del proyecto..." -ForegroundColor Green

# Mover navbar a la ubicación correcta
if (Test-Path "src\app\components\navbar.component.ts") {
    Move-Item "src\app\components\navbar.component.ts" "src\app\components\navbar\navbar.component.ts" -Force
    Write-Host "Navbar movido a la ubicación correcta" -ForegroundColor Yellow
}

# Crear configuración de VS Code
New-Item -Path ".vscode" -ItemType Directory -Force
@"
{
  "css.validate": false,
  "scss.validate": false,
  "less.validate": false,
  "tailwindCSS.includeLanguages": {
    "html": "html",
    "javascript": "javascript",
    "typescript": "typescript"
  },
  "tailwindCSS.experimental.classRegex": [
    "class[Name]*\\s*[:=]\\s*['\"`]([^'\"`]*)['\"`]",
    "className\\s*[:=]\\s*['\"`]([^'\"`]*)['\"`]"
  ]
}
"@ | Out-File -FilePath ".vscode\settings.json" -Encoding UTF8

# Crear postcss.config.js
@"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"@ | Out-File -FilePath "postcss.config.js" -Encoding UTF8

Write-Host "Configuración completada. Ejecuta 'npm install' y luego 'ng serve'" -ForegroundColor Green