import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from '@app/_models';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    constructor(private http: HttpClient) { }

    add(article: Article) {
        return this.http.post(`${environment.apiUrl}/articles/add`, article);
    }

    getAllArticle() {
        return this.http.get<Article[]>(`${environment.apiUrl}/home`);
    }

    getUserArticle() {
        return this.http.get<Article[]>(`${environment.apiUrl}/articles`);
    }

    getById(id: string) {
        return this.http.get<Article>(`${environment.apiUrl}/articles/${id}`);
    }

    update(id: string, params: any) {
        return this.http.put(`${environment.apiUrl}/articles/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/articles/${id}`);
    }
}