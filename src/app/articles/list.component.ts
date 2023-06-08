import { Component, OnInit } from '@angular/core';
import { AccountService, AlertService, ArticleService } from '@app/_services';
import { first } from 'rxjs/operators';
import { User } from '@app/_models';

@Component({
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']

})
export class ListComponent implements OnInit {
    articles: any[];
    user: User;

    constructor(
        private articleService: ArticleService,
        private accountService: AccountService,
        private alertService: AlertService
    ) { this.user = this.accountService.userValue; }

    ngOnInit(): void {
        this.articleService.getUserArticle()
            .pipe(first())
            .subscribe(articles => this.articles = articles.slice().reverse());
    }

    deleteArticle(id: string) {
        const article = this.articles.find(x => x.id === id);
        confirm("Are you sure you want to delete this article?")
            ? article.isDeleting = true && this.articleService.delete(id)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.alertService.clear();
                        this.articles = this.articles.filter(x => x.id !== id);
                        this.alertService.success('Article deleted', { keepAfterRouteChange: true });
                    },
                    error: error => {
                        this.alertService.error(error);
                    }
                })
            : "";
    }
}