import { TestBed } from '@angular/core/testing';

import { State } from '../model/item';
import { List } from '../model/list';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
    let service: LocalStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LocalStorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should save lists to localStorage', () => {
        const lists: List[] = [
            {
                id: 'list-1',
                title: 'My List',
                items: [],
                createdAt: new Date('2026-04-20T10:00:00.000Z'),
                status: State.TODO,
            },
        ];
        const setItemSpy = spyOn(Storage.prototype, 'setItem');

        service.saveLists(lists);

        expect(setItemSpy).toHaveBeenCalledWith('todoLists', JSON.stringify(lists));
    });

    it('should return empty array when no stored value exists', () => {
        spyOn(Storage.prototype, 'getItem').and.returnValue(null);

        const result = service.loadLists();

        expect(result).toEqual([]);
    });

    it('should parse and rehydrate all date fields', () => {
        const rawData = [
            {
                id: 'list-1',
                title: 'My List',
                items: [
                    {
                        id: 1,
                        title: 'Item 1',
                        new: false,
                        status: State.TODO,
                        createdAt: '2026-04-20T08:00:00.000Z',
                        updatedAt: '2026-04-20T09:00:00.000Z',
                        dueDate: '2026-04-25T00:00:00.000Z',
                    },
                ],
                createdAt: '2026-04-20T10:00:00.000Z',
                updatedAt: '2026-04-21T10:00:00.000Z',
                status: State.IN_PROGRESS,
            },
        ];
        spyOn(Storage.prototype, 'getItem').and.returnValue(JSON.stringify(rawData));

        const result = service.loadLists();
        const list = result[0];
        const item = list.items[0];

        expect(result.length).toBe(1);
        expect(list.createdAt).toEqual(jasmine.any(Date));
        expect(list.updatedAt).toEqual(jasmine.any(Date));
        expect(item.createdAt).toEqual(jasmine.any(Date));
        expect(item.updatedAt).toEqual(jasmine.any(Date));
        expect(item.dueDate).toEqual(jasmine.any(Date));
        expect(list.createdAt.toISOString()).toBe('2026-04-20T10:00:00.000Z');
        expect(list.updatedAt?.toISOString()).toBe('2026-04-21T10:00:00.000Z');
        expect(item.createdAt.toISOString()).toBe('2026-04-20T08:00:00.000Z');
    });

    it('should return empty array and log error for invalid JSON', () => {
        spyOn(Storage.prototype, 'getItem').and.returnValue('{invalid json');
        const errorSpy = spyOn(console, 'error');

        const result = service.loadLists();

        expect(result).toEqual([]);
        expect(errorSpy).toHaveBeenCalled();
    });
});
