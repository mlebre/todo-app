# TodoApp

TodoApp is an Angular application for managing task lists and their items. You can create lists, add items, mark items as done, and move completed lists to a dedicated screen.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 21.1.3.

## Features<>

- Create and name todo lists
- Add items to each list
- Mark items as completed
- Move completed lists to a done screen
- Restore completed lists to ongoing status

## Tech Stack

- Angular 20
- TypeScript
- Karma + Jasmine (unit testing)

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation and Run

```bash
npm install
npm start
```

Then open your browser at `http://localhost:4200/`.

## Available Scripts

- `npm start`: Start the development server
- `npm run build`: Build the project into the `dist/` directory
- `npm run test`: Run unit tests in headless Chrome
- `npm run test-coverage `: Run unit tests in headless Chrome with coverage calculation

## Project Structure

- `src/app/components`: UI components (lists, items, modal, layout)
- `src/app/services`: Business logic and local storage handling
- `src/app/model`: Data models (`list`, `item`)
- `src/app/testing/mocks`: Test utilities and mocks

## Testing

Run unit tests with:

```bash
npm run test
npm run test-coverage
```

Coverage reports are generated under `coverage/`.

## Current Limitations

- Data is currently stored locally and is not shared across browsers/sessions.
- No end-to-end test suite is configured yet.

## Additional Resources

For more information on using the Angular CLI, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Roadmap
1. Add persistent backend storage. 
Faire en sorte que les listes soient visibles inter navigateurs et sessions --> Avec une solution Backend as service soit via une API dédiée.
    1. Backend as service (Supabase) : Installation d'un client JS, configuration des tables, Supabase gère l'authentification et l'accès aux données via RLS.
    2. API indépendante (Python/FastAPI) : tout à construire mais plus intéressant. On peut choisir l'ORM. FastAPI + SQLAlchemy (ORM) + PostgreSQL.
2. Add end to end tests. 
