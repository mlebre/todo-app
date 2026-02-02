import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {

    hashIdToHslColor(id: string) : { light: string, dark: string } {
        const hash = this.hashStringToNumber(id);

        return {
            light:`hsl(${hash % 360}, 70%, 55%)`,
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

    hslToRgb(hsl: string): number[] {
        const [h, s, l] = hsl
            .replace('hsl(', '') // h = hue, s = saturation, l = lightness
            .replace(')', '')
            .split(',')
            .map(x => parseFloat(x) / (x.includes('%') ? 100 : 1));
        if (s === 0) {
            const gray = Math.round(l * 255);
            return [gray, gray, gray];
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            const r = this.hueToRgb(p, q, h + 1 / 3);
            const g = this.hueToRgb(p, q, h);
            const b = this.hueToRgb(p, q, h - 1 / 3);
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
    }

    hueToRgb(p: number, q: number, t: number): number {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        } else if (t < 1 / 2) {
            return q;
        } else if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
        }

        return p;
    }
  
}
