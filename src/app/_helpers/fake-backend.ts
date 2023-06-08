import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize } from 'rxjs/operators';

// array in local storage for registered users
const userKey = 'users';
let users: any[] = JSON.parse(localStorage.getItem(userKey)) || [];

// array in local storage for articles
const articleKey = 'articles';
let articles: any[] = JSON.parse(localStorage.getItem(articleKey)) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRout();

        function handleRout() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.match(/\/user\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/user\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.endsWith('/articles/add') && method === 'POST':
                    return addArticle();
                case url.endsWith('/articles') && method === 'GET':
                    return getUserArticle();
                case url.endsWith('/home') && method === 'GET':
                    return getAllArticle();
                case url.match(/\/articles\/\d+$/) && method === 'GET':
                    return getArticleById();
                case url.match(/\/articles\/\d+$/) && method === 'PUT':
                    return updateArticle();
                case url.match(/\/articles\/\d+$/) && method === 'DELETE':
                    return deleteArticle();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                ...basicDetails(user),
                token: 'fake-jwt-token'
            });
        }

        function register() {
            const user = body;

            if (users.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken');
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem(userKey, JSON.stringify(users));
            return ok();
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const loggedInUser = JSON.parse(localStorage.getItem('user'));
            const user = users.find(x => x.id === idFromUrl());

            if (user?.id) {
                if (loggedInUser.id !== user.id) {
                    return forbidden();
                } else {
                    return ok(basicDetails(user));
                }
            } else {
                return forbidden();
            }
        }

        function updateUser() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let user = users.find(x => x.id === idFromUrl());

            // only update password if entered
            if (!params.password) {
                delete params.password;
            }

            // update and save user
            Object.assign(user, params);
            localStorage.setItem(userKey, JSON.stringify(users));

            return ok();
        }

        function addArticle() {
            if (!isLoggedIn()) return unauthorized();

            const article = body;
            const loggedInUser = JSON.parse(localStorage.getItem('user'));

            article.id = articles.length ? Math.max(...articles.map(x => x.id)) + 1 : 1;
            article.userId = loggedInUser.id;
            article.username = loggedInUser.username;

            articles.push(article);
            localStorage.setItem(articleKey, JSON.stringify(articles));
            return ok();
        }

        function getUserArticle() {
            if (!isLoggedIn()) return unauthorized();

            const loggedInUser = JSON.parse(localStorage.getItem('user'));
            articles.map(x => basicArticleDetails(x));

            return ok(articles.filter(x => x.userId === loggedInUser.id));
        }

        function getAllArticle() {
            articles.map(x => basicArticleDetails(x));
            return ok(articles);
        }

        function getArticleById() {
            if (!isLoggedIn()) return unauthorized();

            const loggedInUser = JSON.parse(localStorage.getItem('user'));
            const article = articles.find(x => x.id === idFromUrl());

            if (article?.id) {
                if (loggedInUser.id !== article.userId) {
                    return forbidden();
                } else {
                    return ok(basicArticleDetails(article));
                }
            } else {
                return forbidden();
            }
        }

        function updateArticle() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let article = articles.find(x => x.id === idFromUrl());

            Object.assign(article, params);
            localStorage.setItem(articleKey, JSON.stringify(articles));

            return ok();
        }

        function deleteArticle() {
            if (!isLoggedIn()) return unauthorized();

            articles = articles.filter(x => x.id !== idFromUrl());
            localStorage.setItem(articleKey, JSON.stringify(articles));

            return ok();
        }

        function error(message: string) {
            // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            return throwError(() => ({ error: { message } })).pipe(
                materialize(), delay(500), dematerialize()
            );
        }

        function ok(body?: any) {
            // delay observable to simulate server api call
            return of(new HttpResponse({ status: 200, body })).pipe(
                delay(500)
            );
        }

        function basicDetails(user: any) {
            const { id, username, firstName, lastName } = user;
            return { id, username, firstName, lastName };
        }

        function basicArticleDetails(article: any) {
            const { id, userId, username, url, type, text } = article;
            return { id, userId, username, url, type, text };
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function unauthorized() {
            return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } }))
                .pipe(materialize(), delay(500), dematerialize());
        }

        function forbidden() {
            return throwError(() => ({ status: 403, error: { message: 'Forbidden' } }))
                .pipe(materialize(), delay(500), dematerialize());
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
}