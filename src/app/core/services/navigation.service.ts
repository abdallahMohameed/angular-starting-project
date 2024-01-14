import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    currentUrl = "";

    constructor(private router: Router) { }

    navigateToHomePage() {
    }
}