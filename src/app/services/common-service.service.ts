import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Login } from '../models/login';
import { AuthResponse } from '../models/auth-response';
import { Register } from '../models/register';
import { Menu } from '../models/menu';

@Injectable({
    providedIn: 'root'
})
export class CommonServiceService {

    private baseURL = environment.baseURL;
    private menusSubject = new BehaviorSubject<Menu[]>([])
    menu$ = this.menusSubject.asObservable()
    
    constructor(
        private http: HttpClient
    ) { }

    get<T>(endpoint: string): Observable<T> {
        return this.http.get<T>(this.baseURL + endpoint)
    }

    getById<T>(endpoint: string, params: { [key: string]: number }): Observable<T> {
        let url = this.baseURL + endpoint
        for(const key in params) {
            if(params.hasOwnProperty(key)) {
                const placeholder = `:${key}`
                url = url.replace(placeholder, params[key].toString())
            }
        }
        return this.http.get<T>(url)
    }

    post<T>(endpoint: string, body: any): Observable<T> {
        return this.http.post<T>(this.baseURL + endpoint, body)
    }

    put<T>(endpoint: string, body: any): Observable<T> {
        return this.http.put<T>(`${this.baseURL}${endpoint}`, body)
    }

    delete<T>(endpoint: string, id: number): Observable<T> {
        return this.http.delete<T>(`${this.baseURL}${endpoint}/${id}`)
    }

    remove<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(this.baseURL + endpoint)
    }

    login(credentials: Login): Observable<any> {
        return this.http.post(`${this.baseURL}${environment.login.login}`, credentials)
    }

    register(user: Register): Observable<any> {
        return this.http.post(`${this.baseURL}${environment.register.register}`, user)
    }

    downloadFile<T>(endpoint: string, params: { [key: string]: number }): Observable<Blob> {
        let url = this.baseURL + endpoint
        for(const key in params) {
            if(params.hasOwnProperty(key)) {
                const placeholder = `:${key}`
                url = url.replace(placeholder, params[key].toString())
            }
        }
        return this.http.get<Blob>(url, {
            responseType: 'blob' as 'json'
        })
    }

    getRoleFromToken(): number | null {
        const token = localStorage.getItem('token')
        if(token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]))            
            return decodedToken.RoleID
        }
        return null;
    }

    getRoleNameFromToken() {
        const token = localStorage.getItem('token')
        if(token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]))
            return decodedToken.RoleName
        }
    }

    getUserNameFromToken() {
        const token = localStorage.getItem('token')
        if(token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]))            
            return decodedToken.Username
        }
    }

    getUserIdFromToken(): number {
        const token = localStorage.getItem('token')
        if(token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]))
            return parseInt(decodedToken.UserID)
        }
        return 0
    }

    getMenusByRole(roleID: number): Observable<Menu[]> {
        return this.http.get<Menu[]>(`${this.baseURL}${environment.menuItems.get}${roleID}`)
    }

    setMenus(menus: Menu[]): void {
        this.menusSubject.next(menus)
    }
}
