# Plan: Remove Local Cache (Backend-Agnostic)

## Context

`TodoService` currently holds a `BehaviorSubject<List[]>` that is updated **synchronously** on every mutation — this is the "cache". The goal is to make it backend-agnostic: mutations call a `DataService`, then re-fetch from it to refresh `lists$`. The `BehaviorSubject` stays but is no longer the source of truth — it just reflects the latest backend state.

Strategy chosen: **re-fetch after each write** (generic, works with any backend).

---

## Phases

### Phase 1 — Abstract contract

**NEW** `src/app/services/data.service.ts` — abstract class `DataService` with two methods:

- `fetchLists(): Observable<List[]>`
- `saveLists(lists: List[]): Observable<void>`

The interface intentionally stays at "whole array" level. Fine-grained REST/Supabase methods come in the next migration phase — not now.

---

### Phase 2 — Local implementation

**NEW** `src/app/services/local-storage-data.service.ts` — `LocalStorageDataService extends DataService`:

- `fetchLists()` → wraps existing `localStorageService.loadLists()` in `of(...)`
- `saveLists(lists)` → calls `localStorageService.saveLists(lists)`, returns `of(undefined)`
- Injects existing `LocalStorageService` (unchanged)

---

### Phase 3 — Refactor TodoService _(parallel with Phase 2)_

**MODIFY** `src/app/services/todo.service.ts`:

- Inject `DataService` instead of `LocalStorageService`
- Constructor: `this.dataService.fetchLists().subscribe(lists => this.lists$.next(lists))`
- Every mutation method replaces `lists$.next(...) + saveLists(...)` with a pipe chain:
    ```
    saveLists(newLists) → switchMap(() => fetchLists()) → tap(lists => lists$.next(lists)) → map(() => undefined)
    ```
- Add `switchMap`, `tap`, `map` to rxjs imports

---

### Phase 4 — Wire DI

**MODIFY** `src/app/app.config.ts` — add to `providers`:

```ts
{ provide: DataService, useClass: LocalStorageDataService }
```

---

### Phase 5 — Update service tests

**MODIFY** `src/app/services/todo.service.spec.ts`:

- Replace `LocalStorageService` spy with `DataService` spy (`fetchLists`, `saveLists`)
- `setup(initialLists)` configures:
    ```ts
    dataServiceMock.fetchLists.and.returnValue(of(initialLists));
    dataServiceMock.saveLists.and.returnValue(of(undefined));
    ```
- Tests that assert post-mutation state: reconfigure `fetchLists.and.returnValue(of(expectedResult))` inline before calling the method, so the re-fetch returns the right data
- Assertions on `saveLists` call arguments and `latestLists()` remain structurally identical

---

## Verification

1. Run `npm test` — all existing tests pass, no count change in component specs
2. Run the app (`npm start`) and verify lists persist across page reloads
3. Swap `LocalStorageDataService` with a stub returning hardcoded data to confirm components render correctly from the refactored flow

---

## Further Considerations

When adding a real backend, only `DataService` needs a new implementation (`SupabaseDataService` / `HttpDataService`). The `saveLists(List[])` interface will then become fine-grained — `createList(list)`, `deleteList(id)`, etc. — requiring a second, more targeted refactor of `TodoService` mutation methods.
