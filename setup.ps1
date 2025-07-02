# Installation et configuration de CivActu Frontend

Write-Host "🚀 Installation de CivActu Frontend..." -ForegroundColor Green

# Vérifier si Node.js est installé
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js détecté: $(node --version)" -ForegroundColor Green

# Installer les dépendances
Write-Host "📦 Installation des dépendances npm..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    exit 1
}

# Créer le fichier .env.example s'il n'existe pas
if (-not (Test-Path ".env.example")) {
    Write-Host "📄 Création du fichier .env.example..." -ForegroundColor Yellow
    @"
# Configuration API
API_BASE_URL=http://localhost:3001/api/v1
WS_URL=ws://localhost:3001

# Configuration Mapbox (optionnel)
MAPBOX_TOKEN=your_mapbox_token_here

# Configuration PWA (optionnel)
VAPID_PUBLIC_KEY=your_vapid_public_key_here

# Configuration de l'application
APP_NAME=CivActu
APP_VERSION=1.0.0
"@ | Out-File -FilePath ".env.example" -Encoding UTF8
}

# Créer le fichier .env s'il n'existe pas
if (-not (Test-Path ".env")) {
    Write-Host "📄 Création du fichier .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Pensez à configurer les variables dans le fichier .env" -ForegroundColor Yellow
}

# Créer le dossier assets s'il n'existe pas
if (-not (Test-Path "assets")) {
    Write-Host "📁 Création du dossier assets..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "assets" -Force | Out-Null
    New-Item -ItemType Directory -Path "assets/css" -Force | Out-Null
    New-Item -ItemType Directory -Path "assets/images" -Force | Out-Null
    New-Item -ItemType Directory -Path "assets/icons" -Force | Out-Null
}

# Créer le fichier CSS principal s'il n'existe pas
if (-not (Test-Path "assets/css/main.css")) {
    Write-Host "🎨 Création du fichier CSS principal..." -ForegroundColor Yellow
    @"
/* CivActu Main CSS */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Variables CSS personnalisées */
:root {
  --color-primary: #3B82F6;
  --color-secondary: #6B7280;
  --color-accent: #F59E0B;
  --color-background: #FFFFFF;
  --color-surface: #F9FAFB;
  --color-text: #111827;
  --color-text-secondary: #6B7280;
  --color-border: #E5E7EB;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
}

/* Thème sombre */
.dark {
  --color-primary: #60A5FA;
  --color-secondary: #9CA3AF;
  --color-accent: #FBBF24;
  --color-background: #111827;
  --color-surface: #1F2937;
  --color-text: #F9FAFB;
  --color-text-secondary: #9CA3AF;
  --color-border: #374151;
  --color-success: #34D399;
  --color-warning: #FBBF24;
  --color-error: #F87171;
  --color-info: #60A5FA;
}

/* Classes utilitaires */
.transition-all {
  transition: all 0.3s ease;
}

.glassmorphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-surface);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-secondary);
}
"@ | Out-File -FilePath "assets/css/main.css" -Encoding UTF8
}

# Vérifier la configuration TypeScript
Write-Host "🔍 Vérification de la configuration TypeScript..." -ForegroundColor Yellow
npm run type-check

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Configuration TypeScript OK" -ForegroundColor Green
} else {
    Write-Host "⚠️  Des erreurs TypeScript sont présentes (normal en phase de développement)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Installation terminée avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "  1. Configurer les variables d'environnement dans .env" -ForegroundColor White
Write-Host "  2. Démarrer le serveur de développement : npm run dev" -ForegroundColor White
Write-Host "  3. Ouvrir http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation disponible dans le README.md" -ForegroundColor Cyan
Write-Host ""

# Proposer de démarrer le serveur de développement
$response = Read-Host "Voulez-vous démarrer le serveur de développement maintenant ? (y/N)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "🚀 Démarrage du serveur de développement..." -ForegroundColor Green
    npm run dev
}
