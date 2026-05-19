# Alabern

A modern Angular-based web application for managing and showcasing a photography and cultural collection with multilingual support and server-side rendering.

## Table of Contents

- [Project Overview](#project-overview)
- [System Requirements](#system-requirements)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Running Locally](#running-locally)
- [Building](#building)
- [Deployment](#deployment)
- [Technologies](#technologies)
- [Internationalization](#internationalization)
- [Code Scaffolding](#code-scaffolding)
- [Troubleshooting](#troubleshooting)

## Project Overview

Alabern is a comprehensive Angular application that provides features for:
- Photography and cultural collection management
- Multi-language support (English, Spanish, Catalan, French)
- Responsive design with Material Design components
- Server-side rendering (SSR) for improved performance and SEO
- Image gallery with masonry layout
- Advanced search and filtering capabilities
- Virtual exhibition features

## System Requirements

### Operating System
- Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04 LTS+)

### Runtime & Package Manager
- **Node.js**: v18.19.x or higher (v20.x recommended)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm**: v9.x or higher (v10.x recommended)
  - Installed automatically with Node.js
  - Verify installation: `npm --version`

### Development Tools
- **Angular CLI**: v20.x
  - Install globally: `npm install -g @angular/cli@20`
  - Verify installation: `ng version`
- **Git**: v2.20.x or higher (for cloning repository)
- **Text Editor/IDE**: VS Code (recommended), WebStorm, Sublime Text, or IntelliJ IDEA

### Minimum System Specifications
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 2GB for node_modules, build artifacts, and development tools
- **Processor**: Dual-core processor or equivalent

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v18.x or higher (v20.x recommended)
- **npm**: v9.x or higher (v10.x recommended)
- **Angular CLI**: v20.x (`npm install -g @angular/cli`)
- **Git**: For repository access

## Installation

1. Clone the repository:
   ```bash
   git clone https://ashishpathak@bitbucket.org/alabern/web.git
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify the installation:
   ```bash
   ng version
   ```

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable and feature-specific components
│   │   ├── accessibility/   # Accessibility component
│   │   ├── collection/      # Collection-related components (background, institute, photograph)
│   │   ├── cookies-policy/  # Cookie policy component
│   │   ├── exhibition/      # Virtual exhibition features
│   │   ├── home/            # Home page
│   │   ├── legal-notice/    # Legal information
│   │   ├── news/            # News section
│   │   ├── project/         # Project information
│   │   ├── research/        # Research section
│   │   └── who-we-are/      # About us section
│   ├── core/                # Core functionality (non-reusable services)
│   │   ├── enums/           # Enumeration definitions
│   │   ├── resolver/        # Route resolvers
│   │   └── service/         # Core services
│   ├── shared/              # Shared resources
│   │   ├── component/       # Shared UI components
│   │   ├── directives/      # Custom directives
│   │   ├── footer/          # Footer component
│   │   ├── header/          # Header component
│   │   ├── interceptor/     # HTTP interceptors
│   │   ├── interfaces/      # TypeScript interfaces
│   │   ├── pipes/           # Custom pipes
│   │   └── social-share/    # Social sharing functionality
│   ├── app.routes.ts        # Application routing configuration
│   ├── app.config.ts        # Client-side configuration
│   └── app.config.server.ts # Server-side configuration
├── assets/
│   ├── fonts/               # Custom font files
│   ├── i18n/                # Translation files (en, es, ca, fr)
│   ├── images/              # Image assets
│   └── styles/              # Global SCSS styles
├── environments/            # Environment-specific configurations
├── main.ts                  # Client application entry point
├── main.server.ts           # Server application entry point
└── styles.scss              # Global styles

Root files:
├── angular.json             # Angular CLI configuration
├── package.json             # Project dependencies and scripts
├── server.ts                # Express server configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## Available Scripts

All scripts are run with `npm`:

### Development

```bash
# Start the development server
npm start
# or
ng serve

# Server runs at http://localhost:4200/
# Application auto-reloads on source changes
```

### Production Builds

```bash
# Build for production
npm run build-prod

# Build and serve in production mode
npm run serve-prod

# Serve with Server-Side Rendering (SSR)
npm run serve:ssr:Alabern
```

### Watch Mode

```bash
# Build in watch mode (development)
npm run watch
```

### Code Quality

```bash
# Format code with Prettier
npm run prettier
```

## Running Locally

### Starting the Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify source files.

### Making Changes

- Modify component files (`.ts`, `.html`, `.scss`)
- The dev server automatically detects changes and rebuilds
- Open DevTools in your browser to see any errors immediately

### Hot Module Replacement

Angular CLI includes automatic rebuild and refresh during development, ensuring you see your changes immediately.

## Building

### Development Build

```bash
npm run build
```

### Production Build

```bash
npm run build-prod
```

Build artifacts are stored in the `dist/alabern/` directory.

### Server-Side Rendering

The project includes Angular SSR support:

```bash
npm run build-prod
npm run serve:ssr:Alabern
```

This improves initial page load performance and SEO.

## Deployment

### Build for Production

Create a production build:

```bash
npm run build-prod
```

Build artifacts are stored in `dist/alabern/browser/` (client) and `dist/alabern/server/` (server).

## Staging and Production Environments

### Staging Environment (Web Frontend)

**URL**: https://alabern.namastech.com/
**Directory**: `/httpdocs`

#### Staging Deployment Steps

1. **Generate the build locally**:
   ```bash
   npm run build-prod
   ```

2. **Prepare the content**:
   - Ensure all files in `dist/alabern/browser/` are ready for upload

3. **FTP Update**:
   - Connect to the FTP server
   - Navigate to `httpdocs/dist/alabern`
   - Update the folder with the new build content from `dist/alabern/browser/*`

4. **Restart the Application**:
   - Login to the Plesk server
   - Navigate to **Node.js** in the domain: alabern.namastech.com
   - Click on **Restart**

5. **Verify**:
   - Visit https://alabern.namastech.com/
   - The application will go live on the site

### Production Environment (Web Frontend)

**URL**: https://fotografiacatalunya.namastech.com/
**Directory**: `/httpdocs`

#### Production Deployment Steps

1. **Generate the build locally**:
   ```bash
   npm run build-prod
   ```

2. **Prepare the content**:
   - Ensure all files in `dist/alabern/browser/` are ready for upload

3. **FTP Update**:
   - Connect to the FTP server
   - Navigate to `/httpdocs/dist/alabern`
   - Update the folder with the new build content from `dist/alabern/browser/*`

4. **Restart the Application**:
   - Login to the Plesk server
   - Navigate to **Node.js** in the domain: fotografiacatalunya.namastech.com
   - Click on **Restart**

5. **Verify**:
   - Visit https://fotografiacatalunya.namastech.com/
   - The application will go live on the site


## Technologies
### Core Framework
- **Angular**: v20.x - Modern web framework
- **Angular SSR**: Server-side rendering
- **Angular Router**: SPA routing
- **Angular Forms**: Reactive and template-driven forms

### UI & Styling
- **Angular Material**: Material Design components
- **SCSS**: CSS preprocessing
- **Masonry Layout**: Grid-based photo gallery layout
- **Swiper**: Mobile touch sliders

### Internationalization
- **@ngx-translate**: Multi-language support
- **@ngx-translate/http-loader**: Dynamic translation loading

### Backend & Server
- **Express**: Web server framework
- **@angular/platform-server**: Server-side platform

### Build Tools
- **Angular CLI**: Build and development tooling
- **TypeScript**: Type-safe JavaScript
- **Prettier**: Code formatter
- **ESLint**: Code linting

### Additional Libraries
- **RxJS**: Reactive programming
- **jQuery**: DOM manipulation (if needed for plugins)
- **ngx-masonry**: Angular masonry integration
- **ngx-nested-ellipsis**: Text truncation

## Internationalization

The application supports 4 languages:
- **English** (en)
- **Spanish** (es)
- **Catalan** (ca)
- **French** (fr)

Translation files are located in `src/assets/i18n/`:
- `{lang}.json` - UI translations
- `seo-{lang}.json` - SEO metadata
- `static-link-{lang}.json` - Static link translations

To add a new translation:
1. Create translation files in `src/assets/i18n/`
2. Update the language configuration in your services
3. The `@ngx-translate` module handles dynamic loading

## Code Scaffolding

Generate new components, services, and other Angular artifacts:

```bash
# Generate a new component
ng generate component component-name

# Generate a service
ng generate service service-name

# Generate other artifacts
ng generate directive|pipe|service|class|guard|interface|enum|module
```

The generated files will be placed in appropriate directories within `src/app/`.


## Troubleshooting

### Port Already in Use
If port 4200 is in use, specify a different port:
```bash
ng serve --port 4300
```

### Build Errors
Clear the Angular build cache:
```bash
ng build --reset-cache
```

### Dependencies Issues
Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```