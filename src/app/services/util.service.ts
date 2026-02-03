import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UtilService {
    hashIdToHslColor(id: string): { light: string; dark: string } {
        const hash = this.hashStringToNumber(id);

        return {
            light: `hsl(${hash % 360}, 70%, 55%)`,
            dark: `hsl(${hash % 360}, 70%, 40%)`,
        };
    }

    hashStringToNumber(str: string): number {
        let hash = 0;
        Array.from(str).forEach(char => {
            hash += char.charCodeAt(0);
        });
        return hash;
    }
}
