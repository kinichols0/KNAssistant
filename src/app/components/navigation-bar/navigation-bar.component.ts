import { Component } from '@angular/core';

@Component({
    selector: 'navigation-bar',
    templateUrl: './navigation-bar.component.html'
})
export class NavigationBarComponent {

    expanded: boolean = false;

    navTogglerClick(): void {
        this.expanded = !this.expanded;
    }
}