import { TestBed } from '@angular/core/testing';
import { State } from '../model/item';
import { List } from '../model/list';
import { LocalStorageService } from './local-storage.service';
import { TodoService } from './todo.service';

describe('TodoService', () => {
    let service: TodoService;
    let localStorageServiceMock: jasmine.SpyObj<LocalStorageService>;

    const makeList = (id: string, status = State.TODO): List => ({
        id,
        title: id,
        items: [],
        createdAt: new Date('2026-04-20T00:00:00.000Z'),
        status,
    });

    const setup = (initialLists: List[] = []) => {
        localStorageServiceMock = jasmine.createSpyObj<LocalStorageService>('LocalStorageService', [
            'loadLists',
            'saveLists',
        ]);
        localStorageServiceMock.loadLists.and.returnValue(initialLists);

        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [TodoService, { provide: LocalStorageService, useValue: localStorageServiceMock }],
        });

        service = TestBed.inject(TodoService);
    };

    const latestLists = () => {
        let lists: List[] = [];
        const subscription = service.lists.subscribe(value => {
            lists = value;
        });
        subscription.unsubscribe();
        return lists;
    };

    beforeEach(() => {
        setup();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize state from LocalStorageService', () => {
        const initial = [makeList('list-1')];
        setup(initial);

        expect(localStorageServiceMock.loadLists).toHaveBeenCalled();
        expect(latestLists()).toEqual(initial);
    });

    it('should create list and persist it', () => {
        const testUuid = '11111111-1111-1111-1111-111111111111';
        spyOn(globalThis.crypto, 'randomUUID').and.returnValue(testUuid);

        service.createList('New List');

        const lists = latestLists();
        expect(lists.length).toBe(1);
        expect(lists[0].id).toBe(testUuid);
        expect(lists[0].title).toBe('New List');
        expect(lists[0].status).toBe(State.TODO);
        expect(lists[0].createdAt).toEqual(jasmine.any(Date));
        expect(localStorageServiceMock.saveLists).toHaveBeenCalledWith(lists);
    });

    it('should delete list and persist remaining lists', () => {
        const initial = [makeList('list-1'), makeList('list-2')];
        setup(initial);

        service.deleteList('list-1');

        const lists = latestLists();
        expect(lists.length).toBe(1);
        expect(lists[0].id).toBe('list-2');
        expect(localStorageServiceMock.saveLists).toHaveBeenCalledWith(lists);
    });

    it('should create item with max id + 1 and persist', () => {
        const initial = [
            {
                ...makeList('list-1'),
                items: [
                    {
                        id: 1,
                        title: 'First',
                        new: false,
                        status: State.TODO,
                        createdAt: new Date('2026-04-20T00:00:00.000Z'),
                    },
                    {
                        id: 5,
                        title: 'Second',
                        new: false,
                        status: State.DONE,
                        createdAt: new Date('2026-04-20T00:00:00.000Z'),
                    },
                ],
            },
        ];
        setup(initial);

        service.createItem('list-1', 'Third');

        const items = latestLists()[0].items;
        expect(items.length).toBe(3);
        expect(items[2].id).toBe(6);
        expect(items[2].title).toBe('Third');
        expect(items[2].new).toBeTrue();
        expect(items[2].status).toBe(State.TODO);
        expect(items[2].createdAt).toEqual(jasmine.any(Date));
        expect(localStorageServiceMock.saveLists).toHaveBeenCalled();
    });

    it('should do nothing for createItem with unknown list id', () => {
        const initial = [makeList('list-1')];
        setup(initial);

        service.createItem('unknown', 'Ignored');

        expect(latestLists()).toEqual(initial);
        expect(localStorageServiceMock.saveLists).not.toHaveBeenCalled();
    });

    it('should delete item, update list timestamp and persist', () => {
        const initial = [
            {
                ...makeList('list-1'),
                items: [
                    {
                        id: 1,
                        title: 'First',
                        new: false,
                        status: State.TODO,
                        createdAt: new Date('2026-04-20T00:00:00.000Z'),
                    },
                    {
                        id: 2,
                        title: 'Second',
                        new: false,
                        status: State.TODO,
                        createdAt: new Date('2026-04-20T00:00:00.000Z'),
                    },
                ],
            },
        ];
        setup(initial);

        service.deleteItem('list-1', 2);

        const list = latestLists()[0];
        expect(list.items.length).toBe(1);
        expect(list.items[0].id).toBe(1);
        expect(list.updatedAt).toEqual(jasmine.any(Date));
        expect(localStorageServiceMock.saveLists).toHaveBeenCalled();
    });

    it('should do nothing for deleteItem with unknown list id', () => {
        const initial = [makeList('list-1')];
        setup(initial);

        service.deleteItem('unknown', 1);

        expect(latestLists()).toEqual(initial);
        expect(localStorageServiceMock.saveLists).not.toHaveBeenCalled();
    });

    it('should update list status and persist', () => {
        const initial = [makeList('list-1', State.TODO)];
        setup(initial);

        service.updateListStatus('list-1', State.IN_PROGRESS);

        const list = latestLists()[0];
        expect(list.status).toBe(State.IN_PROGRESS);
        expect(list.updatedAt).toEqual(jasmine.any(Date));
        expect(localStorageServiceMock.saveLists).toHaveBeenCalled();
    });

    it('should do nothing for updateListStatus with unknown list id', () => {
        const initial = [makeList('list-1')];
        setup(initial);

        service.updateListStatus('unknown', State.DONE);

        expect(latestLists()).toEqual(initial);
        expect(localStorageServiceMock.saveLists).not.toHaveBeenCalled();
    });
});
