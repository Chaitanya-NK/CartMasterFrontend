import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-product-share-social-dialog',
    templateUrl: './product-share-social-dialog.component.html',
    styleUrls: ['./product-share-social-dialog.component.css']
})
export class ProductShareSocialDialogComponent {
    currentUrl: string;

    constructor(public dialogRef: MatDialogRef<ProductShareSocialDialogComponent>) {
        this.currentUrl = window.location.href; // Get the current page URL
    }

    share(platform: string): void {
        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.currentUrl)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(this.currentUrl)}&text=Check this out!`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.currentUrl)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(this.currentUrl)}`;
                break;
            case 'instagram':
                shareUrl = `https://www.instagram.com/`
        }

        window.open(shareUrl, '_blank');
    }

    onClose(): void {
        this.dialogRef.close();
    }

    copyToClipboard() {
        navigator.clipboard.writeText(this.currentUrl).then(() => {
            alert("Link copied to clipboard")
        })
    }
}
