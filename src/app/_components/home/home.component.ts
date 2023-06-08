import { Component, OnInit } from '@angular/core';
import { ArticleService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    articles: any[];

    constructor(private articleService: ArticleService) { }

    ngOnInit(): void {
        this.articleService.getAllArticle()
            .pipe(first())
            .subscribe(articles => this.articles = articles.slice().reverse());
    }
}