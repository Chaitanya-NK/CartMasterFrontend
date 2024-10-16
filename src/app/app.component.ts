import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { CommonServiceService } from './services/common-service.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'CartMaster.UI';

    // constructor(
    //     private router: Router,
    //     private commonService: CommonServiceService
    // ) { }

    // ngOnInit(): void {
    //     this.router.events.subscribe(event => {
    //         if (event instanceof NavigationEnd) {
    //             const newSessionID = this.getSessionIDFromUrl();
    //             const storedSessionID = localStorage.getItem('sessionID');

    //             if (newSessionID && newSessionID !== storedSessionID) {
    //                 // Manual session ID change detected
    //                 const isManualChange = storedSessionID !== null && storedSessionID !== newSessionID;
    //                 if (isManualChange) {
                        
    //                     this.logSessionChange(newSessionID);
    //                     // Redirect to 404 page
    //                     this.router.navigate(['/404'])
    //                 }
    //                 this.alertUser();

    //                 // Update session ID in localStorage
    //                 // localStorage.setItem('sessionID', newSessionID);
    //             }
    //         }
    //     });
    // }

    // getSessionIDFromUrl(): string | null {
    //     const urlSegments = this.router.url.split('/')
    //     console.log(urlSegments[1])
    //     return urlSegments.length > 1 ? urlSegments[1] : null
    // }

    // alertUser(): void {
    //     alert("You tried to change your session Id. This action will be notified to the admin.")
    // }

    // logSessionChange(changedSessionID: string): void {
    //     const userID = this.commonService.getUserIdFromToken()
    //     const headers = { 'Content-Type': 'application/json' };

    //     this.commonService.trackSession(`${environment.userSession.handleUserSession}?action=logsessionchange&sessionID=${changedSessionID}&userID=${userID}`, null, { headers }).subscribe({
    //         next: () => {
    //             console.log("Session change logged successfully");
    //         },
    //         error: err => {
    //             console.error("Error logging session change: ", err);
    //         }
    //     })
    // }
}