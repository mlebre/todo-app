# TodoApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner in with chrome headless, use the following command:

```bash
npm run test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## TO DO
1. Voir les listes done ✅
2. Fix: sur une liste expanded, l'ajout d'un nouvel item replie la liste en plus de créer l'item. ✅
3. Github action pour lint & test ok avant de merger. ✅
4. Test plus robustes sur les services (et components) ? 
5. Faire en sorte que les listes soient visibles inter navigateurs et sessions --> Avec une solution Backend as service soit via une API dédiée.
    1. Backend as service (Supabase) : Installation d'un client JS, configuration des tables, Supabase gère l'authentification et l'accès aux données via RLS. 
    2. API indépendante (Python/FastAPI) : tout à construire mais plus intéressant. On peut choisir l'ORM. FastAPI + SQLAlchemy (ORM) + PostgreSQL. 