import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
    selector: 'app-about-us',
    templateUrl: './about-us.component.html',
    styleUrls: ['./about-us.component.css'],
    animations: [
        trigger('fadeInAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('1s', style({ opacity: 1 }))
            ])
        ]),
        trigger('fadeInSectionAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(50px)' }),
                animate('0.7s', keyframes([
                    style({ opacity: 0, transform: 'translateY(50px)', offset: 0 }),
                    style({ opacity: 0.5, transform: 'translateY(25px)', offset: 0.5 }),
                    style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
                ]))
            ])
        ]),
        trigger('slideInAnimation', [
            transition(':enter', [
                style({ transform: 'translateX(-100%)' }),
                animate('0.8s ease-out', style({ transform: 'translateX(0)' }))
            ])
        ]),
    ]
})
export class AboutUsComponent {
    teamMembers = [
        { name: 'John Doe', role: 'CEO & Founder', image: 'assets/team/john.jpg' },
        { name: 'Jane Smith', role: 'CTO', image: 'assets/team/jane.jpg' },
        { name: 'Alex Johnson', role: 'Product Manager', image: 'assets/team/alex.jpg' },
    ];
}
