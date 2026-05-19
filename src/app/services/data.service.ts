import { Observable } from 'rxjs';
import { List } from '../model/list';

export abstract class DataService {
    abstract saveLists(data: List[]): Observable<void>;

    abstract fetchLists(): Observable<List[]>;
}
