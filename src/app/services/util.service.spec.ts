import { TestBed } from '@angular/core/testing';

import { UtilService } from './util.service';

describe('UtilService', () => {
    let service: UtilService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UtilService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return deterministic hash for same input', () => {
        const first = service.hashStringToNumber('repeatable');
        const second = service.hashStringToNumber('repeatable');

        expect(first).toBe(second);
    });

    it('should return non-negative hash', () => {
        const hash = service.hashStringToNumber('long-input-value');

        expect(hash).toBeGreaterThanOrEqual(0);
    });

    it('should return 0 hash for empty string', () => {
        expect(service.hashStringToNumber('')).toBe(0);
    });

    it("should return known hash for 'abc'", () => {
        expect(service.hashStringToNumber('abc')).toBe(96354);
    });

    it("should return expected hsl colors for 'abc'", () => {
        expect(service.hashIdToHslColor('abc')).toEqual({
            light: 'hsl(234, 70%, 55%)',
            dark: 'hsl(234, 70%, 40%)',
        });
    });
});
