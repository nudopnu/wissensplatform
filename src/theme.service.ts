import { effect, Injectable, signal } from "@angular/core";

@Injectable({providedIn: "root"})
export class ThemeService {

    isDarkMode = signal(false);

    constructor() {
        effect(() => {
            const isDark = this.isDarkMode();

            document.documentElement.setAttribute(
                'data-theme',
                isDark ? 'dark' : 'light'
            );
        })
    }

    toggle() {
        this.isDarkMode.update(v => !v);
    }

    setDarkMode(value: boolean) {
        this.isDarkMode.set(value);
    }
}