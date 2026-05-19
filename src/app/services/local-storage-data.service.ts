import { Observable, of } from 'rxjs';
import { DataService } from './data.service';
import { LocalStorageService } from './local-storage.service';
import { List } from '../model/list';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageDataService extends DataService {
    constructor(private localStorageService: LocalStorageService) {
        super();
    }

    override saveLists(data: List[]): Observable<void> {
        this.localStorageService.saveLists(data);
        return of(undefined);
    }

    override fetchLists(): Observable<List[]> {
        return of(this.localStorageService.loadLists());
    }
}
