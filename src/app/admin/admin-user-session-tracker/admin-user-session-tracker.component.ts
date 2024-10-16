import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { environment } from 'src/environments/environment.development';

@Component({
    selector: 'app-admin-user-session-tracker',
    templateUrl: './admin-user-session-tracker.component.html',
    styleUrls: ['./admin-user-session-tracker.component.css']
})
export class AdminUserSessionTrackerComponent implements OnInit {

    private currentSessionID: string | null = null

    constructor(
        private router: Router,
        private commonService: CommonServiceService
    ) {
        this.currentSessionID = localStorage.getItem('sessionID')
    }

    ngOnInit(): void {
        this.router.events.subscribe(
            event => {
                if(event instanceof NavigationEnd) {
                    const newSessionID = this.getSessionIDFromUrl()
                    if(newSessionID && newSessionID !== this.currentSessionID) {
                        this.alertUser()
                        this.logSessionChange(newSessionID)
                        this.currentSessionID = newSessionID
                    }
                }
            }
        )
        this.getSessionIDFromUrl()
    }

    getSessionIDFromUrl(): string | null {
        const urlSegments = this.router.url.split('/')
        console.log(urlSegments[1])
        return urlSegments.length > 1 ? urlSegments[1] : null
    }

    alertUser(): void {
        alert("You tried to change your session Id. This action will be notified to the admin.")
    }

    logSessionChange(changedSessionID: string): void {
        const userID = this.commonService.getUserIdFromToken()
        this.commonService.post(`${environment.userSession.handleUserSession}?action=logsessionchange&sessionID=${changedSessionID}&userID=${userID}`, null).subscribe({
            next: () => {
                console.log("Session change logged successfully");
            },
            error: err => {
                console.error("Error logging session change: ",err);
            }
        })
    }
}
