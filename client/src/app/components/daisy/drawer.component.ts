import { Component, model } from "@angular/core";

@Component({
    selector: 'drawer',
    template: `
<!-- toggle button -->
<button
    class="absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-6 h-16 bg-base-200/80 backdrop-blur-sm rounded-l-xl transition-all duration-300 cursor-pointer"
    [style.right]="drawerOpen() ? '18rem' : '0'"
    (click)="drawerOpen.set(!drawerOpen())"
>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
        class="size-4 transition-transform duration-300" [class.rotate-180]="drawerOpen()">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
</button>

<!-- content -->
<aside
    class="absolute right-0 top-0 bottom-0 w-72 p-5 flex flex-col gap-4 backdrop-blur-sm shadow-xl overflow-y-scroll transition-transform duration-300"
    [class.translate-x-full]="!drawerOpen()"
>
    <ng-content></ng-content>
</aside>
`,
})
export class DrawerComponent {
    drawerOpen = model(true);
}