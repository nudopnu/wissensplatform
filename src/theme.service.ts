import { effect, Injectable, signal } from "@angular/core";

@Injectable({providedIn: "root"})
export class ThemeService {

    darkMode = signal(false);

    constructor() {
        effect(() => {
            const isDark = this.darkMode();

            document.documentElement.setAttribute(
                'data-theme',
                isDark ? 'dark' : 'light'
            );
        })
    }

    toggle() {
        this.darkMode.update(v => !v);
    }

    setDarkMode(value: boolean) {
        this.darkMode.set(value);
    }
}