# Technical Architecture

This document provides a detailed technical overview of the Launchpad application architecture, including system design, data flows, and deployment architecture.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Component Architecture](#component-architecture)
3. [Data Flow](#data-flow)
4. [Routing Architecture](#routing-architecture)
5. [State Management](#state-management)
6. [Render Deployment Architecture](#render-deployment-architecture)
7. [Build Process](#build-process)

## System Architecture

### High-Level Overview

The application follows a **client-server architecture** optimized for static hosting with API capabilities:

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Application (SPA)                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │Launchpad │  │SnakeGame │  │Platformer│  ...      │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  │         │              │              │              │  │
│  │         └──────────────┼──────────────┘              │  │
│  │                        │                             │  │
│  │              ┌─────────▼─────────┐                    │  │
│  │              │  React Router    │                    │  │
│  │              │  (Client-side)   │                    │  │
│  │              └──────────────────┘                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                        │                                    │
│                        │ HTTP Requests                      │
└────────────────────────┼────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Server (Express.js)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Static File Server                       │  │
│  │              (serves dist/)                           │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes (/api/*)                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │  │
│  │  │ /health  │  │ /future  │  │ /routes  │  ...       │  │
│  │  └──────────┘  └──────────┘  └──────────┘            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Catch-all Route (*)                           │  │
│  │         (serves index.html for SPA)                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Diagram

```mermaid
graph TB
    subgraph Browser["Browser"]
        ReactApp["React Application<br/>(SPA)"]
        Router["React Router<br/>(Client-side)"]
        Launchpad["Launchpad Component"]
        Games["Game Components"]
        
        ReactApp --> Router
        Router --> Launchpad
        Router --> Games
    end
    
    subgraph Server["Express Server"]
        StaticServer["Static File Server<br/>(dist/)"]
        APIRoutes["API Routes<br/>(/api/*)"]
        CatchAll["Catch-all Route<br/>(*)"]
        
        StaticServer --> APIRoutes
        APIRoutes --> CatchAll
    end
    
    Browser -->|"HTTP Requests"| Server
    Server -->|"Static Files<br/>API Responses<br/>index.html"| Browser
```

## Component Architecture

### Component Hierarchy

```
App (Root)
├── ThemeProvider (Context)
│   └── Router (React Router)
│       ├── Route: / → Launchpad
│       │   ├── HamburgerMenu
│       │   │   └── ThemeToggle
│       │   └── AppCard[] (for each app)
│       ├── Route: /snake → SnakeGame
│       │   └── HomeButton
│       └── Route: /platformer → PlatformerGame
│           └── HomeButton
```

### Component Relationships

```mermaid
graph LR
    App["App<br/>(Root)"] --> ThemeProvider["ThemeProvider<br/>(Context)"]
    ThemeProvider --> Router["Router<br/>(React Router)"]
    
    Router --> Launchpad["Launchpad<br/>(Home)"]
    Router --> SnakeGame["SnakeGame"]
    Router --> PlatformerGame["PlatformerGame"]
    
    Launchpad --> HamburgerMenu["HamburgerMenu"]
    Launchpad --> AppCard["AppCard"]
    HamburgerMenu --> ThemeToggle["ThemeToggle"]
    
    SnakeGame --> HomeButton["HomeButton"]
    PlatformerGame --> HomeButton
    
    ThemeProvider -.->|"provides theme"| HamburgerMenu
    ThemeProvider -.->|"provides theme"| ThemeToggle
    ThemeProvider -.->|"provides theme"| Launchpad
```

## Data Flow

### Theme State Flow

```mermaid
sequenceDiagram
    participant User
    participant ThemeToggle
    participant ThemeContext
    participant Components
    participant LocalStorage
    participant DOM
    
    User->>ThemeToggle: Click toggle
    ThemeToggle->>ThemeContext: changeTheme('dark')
    ThemeContext->>LocalStorage: Save theme preference
    ThemeContext->>DOM: Set data-theme attribute
    ThemeContext->>Components: Update theme state
    Components->>DOM: Re-render with new theme
```

### Navigation Flow

```mermaid
sequenceDiagram
    participant User
    participant AppCard
    participant ReactRouter
    participant Component
    
    User->>AppCard: Click app card
    AppCard->>ReactRouter: navigate('/snake')
    ReactRouter->>Component: Render SnakeGame
    Component->>User: Display game
```

### App Registry Flow

```mermaid
graph LR
    AppsJS["apps.js<br/>(Constants)"] --> Launchpad["Launchpad<br/>(Component)"]
    Launchpad --> AppCard["AppCard<br/>(for each app)"]
    AppCard --> Router["React Router"]
    Router --> GameComponent["Game Component"]
```

## Routing Architecture

### Frontend Routing (Client-Side)

React Router handles all client-side navigation:

```mermaid
graph TB
    Browser["Browser"] --> Router["React Router<br/>(BrowserRouter)"]
    Router --> Route1["Route: /<br/>(Launchpad)"]
    Router --> Route2["Route: /snake<br/>(SnakeGame)"]
    Router --> Route3["Route: /platformer<br/>(PlatformerGame)"]
    
    Route1 --> Component1["Launchpad Component"]
    Route2 --> Component2["SnakeGame Component"]
    Route3 --> Component3["PlatformerGame Component"]
```

### Backend Routing (Server-Side)

Express handles API routes and serves static files:

```mermaid
graph TB
    Request["HTTP Request"] --> Express["Express App"]
    
    Express --> Static["Static Middleware<br/>(/dist/*)"]
    Express --> API["API Routes<br/>(/api/*)"]
    Express --> CatchAll["Catch-all<br/>(* → index.html)"]
    
    Static --> StaticFiles["Static Files<br/>(JS, CSS, images)"]
    API --> APIResponse["JSON Response"]
    CatchAll --> IndexHTML["index.html<br/>(for SPA routing)"]
```

### Route Resolution Flow

```mermaid
sequenceDiagram
    participant Browser
    participant Express
    participant StaticFiles
    participant API
    participant ReactRouter
    
    Browser->>Express: GET /snake
    Express->>StaticFiles: Check if file exists
    StaticFiles-->>Express: Not found
    Express->>API: Check if /api/snake
    API-->>Express: Not an API route
    Express->>ReactRouter: Serve index.html
    ReactRouter->>Browser: Return index.html
    Browser->>ReactRouter: Client-side route to /snake
    ReactRouter->>Browser: Render SnakeGame component
```

## State Management

### Current State Management Approach

The application uses a **minimal state management** approach:

1. **Local Component State**: `useState` for component-specific state
2. **Context API**: `ThemeContext` for global theme state
3. **URL State**: React Router for navigation state

### State Management Diagram

```mermaid
graph TB
    subgraph GlobalState["Global State"]
        ThemeContext["ThemeContext<br/>(theme, changeTheme)"]
    end
    
    subgraph ComponentState["Component State"]
        LaunchpadState["Launchpad<br/>(local state)"]
        GameState["Games<br/>(game-specific state)"]
        MenuState["HamburgerMenu<br/>(isOpen)"]
    end
    
    subgraph URLState["URL State"]
        RouterState["React Router<br/>(location, history)"]
    end
    
    ThemeContext --> LaunchpadState
    ThemeContext --> MenuState
    ThemeContext --> GameState
    
    RouterState --> LaunchpadState
    RouterState --> GameState
```

## Render Deployment Architecture

### Deployment Flow

```mermaid
graph TB
    Git["Git Repository"] --> Render["Render Platform"]
    
    Render --> Build["Build Stage"]
    Build --> Install["npm install"]
    Install --> ViteBuild["npm run build<br/>(Vite)"]
    ViteBuild --> Dist["dist/ directory<br/>(Production build)"]
    
    Render --> Start["Start Stage"]
    Start --> Express["npm start<br/>(Express server)"]
    Express --> Serve["Serve static files<br/>from dist/"]
    
    Serve --> HealthCheck["Health Check<br/>(/api/health)"]
    Serve --> StaticFiles["Static Assets<br/>(JS, CSS)"]
    Serve --> SPA["SPA Routing<br/>(index.html)"]
```

### Render Environment Architecture

```mermaid
graph TB
    subgraph Render["Render Platform"]
        subgraph BuildStage["Build Stage"]
            Install["npm install"]
            ViteBuild["vite build"]
            Output["dist/ directory"]
        end
        
        subgraph Runtime["Runtime"]
            Express["Express Server"]
            Static["Static Middleware"]
            API["API Routes"]
            Port["PORT env var"]
        end
    end
    
    subgraph External["External"]
        Browser["User Browser"]
        HealthMonitor["Render Health Monitor"]
    end
    
    BuildStage --> Runtime
    Runtime --> Browser
    Runtime -->|"/api/health"| HealthMonitor
    Browser -->|"HTTP Requests"| Runtime
```

### File Structure on Render

```
/app (Render container)
├── dist/                    # Vite build output
│   ├── index.html
│   ├── assets/
│   │   ├── index-[hash].js
│   │   └── index-[hash].css
│   └── ...
├── server/                  # Express server code
│   ├── config/
│   ├── routes/
│   └── server.js
├── src/                     # Source code (not needed at runtime)
├── package.json
├── package-lock.json
└── render.yaml
```

## Build Process

### Development Build (Vite Dev Server)

```mermaid
graph LR
    Source["Source Files<br/>(src/)"] --> ViteDev["Vite Dev Server"]
    ViteDev --> HMR["Hot Module<br/>Replacement"]
    HMR --> Browser["Browser<br/>(localhost:3000)"]
```

### Production Build (Vite Build)

```mermaid
graph TB
    Source["Source Files<br/>(src/)"] --> Vite["Vite Build"]
    Vite --> Transform["Transform & Bundle"]
    Transform --> Optimize["Optimize<br/>(minify, tree-shake)"]
    Optimize --> Output["dist/ directory"]
    
    Output --> JS["JavaScript Bundles"]
    Output --> CSS["CSS Files"]
    Output --> HTML["index.html"]
    Output --> Assets["Static Assets"]
```

### Build-to-Serve Pipeline

```mermaid
sequenceDiagram
    participant Render
    participant NPM
    participant Vite
    participant Express
    participant Browser
    
    Render->>NPM: npm install
    NPM-->>Render: Dependencies installed
    Render->>Vite: npm run build
    Vite->>Vite: Bundle & optimize
    Vite-->>Render: dist/ created
    Render->>Express: npm start
    Express->>Express: Load server.js
    Express->>Express: Serve dist/ statically
    Express-->>Browser: Server ready
    Browser->>Express: Request
    Express-->>Browser: Response
```

## Key Architectural Decisions

### 1. Build-Then-Serve Pattern

**Decision**: Use Vite to build React app, then Express serves static files.

**Rationale**:
- Optimized production bundles
- Simple deployment on Render
- Clear separation of build and runtime

### 2. Client-Side Routing

**Decision**: Use React Router for all navigation.

**Rationale**:
- Single Page Application (SPA) benefits
- Fast navigation without page reloads
- Simple catch-all route in Express

### 3. Minimal State Management

**Decision**: Use Context API only for theme, useState for local state.

**Rationale**:
- Simple applications don't need complex state management
- Easy to add Redux/Zustand later if needed
- Reduces complexity and dependencies

### 4. Centralized Configuration

**Decision**: Centralize routes and app registry in constants.

**Rationale**:
- Single source of truth
- Easy to maintain and update
- Prevents route/app mismatches

### 5. Organized Server Structure

**Decision**: Organize server code into routes/, config/, middleware/.

**Rationale**:
- Scalable for future API endpoints
- Clear separation of concerns
- Easy to find and modify code

## Future Architecture Considerations

### Potential Enhancements

1. **State Management**: Add Redux or Zustand if state becomes complex
2. **API Layer**: Add API client abstraction if more endpoints are added
3. **Error Handling**: Add error boundaries and global error handling
4. **Testing**: Add unit tests, integration tests
5. **Performance**: Add code splitting, lazy loading for games
6. **PWA**: Add service workers for offline support

### Scalability Path

```
Current: Simple SPA with minimal state
    ↓
Add: More games, more state
    ↓
Consider: State management library
    ↓
Add: Backend features, user accounts
    ↓
Consider: Database, authentication
    ↓
Add: Real-time features
    ↓
Consider: WebSockets, server-sent events
```

