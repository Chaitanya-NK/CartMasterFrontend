import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonServiceService } from './common-service.service';
import { filter } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SessionTrackingService {

    constructor(private router: Router,
        private commonService: CommonServiceService) {
        this.trackSessionIDChange();
    }

    trackSessionIDChange() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            const url = event.url;
            const sessionID = this.getSessionID(url);
            if (sessionID) {
                this.logSessionChange(sessionID);
            }
        });
    }

    private getSessionID(url: string): string | null {
        const parts = url.split('/');
        return parts.length > 1 ? parts[1] : null;
    }

    private logSessionChange(sessionID: string) {
        const date = new Date();

        // Log the session change to the server
        this.commonService.post('your/api/endpoint/for/sessionChange', {
            sessionID,
            date
        }).subscribe(response => {
            console.log('Session change logged:', response);
        });
    }
}
