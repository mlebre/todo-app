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
        for (const char of str) {
            const code = char.charCodeAt(0);
            hash = (hash << 5) - hash + code; // hash * 31 + code
            hash |= 0; // Force to 32-bit integer
        }
        return Math.abs(hash);
    }
}
