# SportNews
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.4.

# Forms built with Angular Reactive Forms
The forms in the example are built with the Reactive Forms library that comes as part of the Angular framework (in @angular/forms). It uses a model-driven approach to build, validate and handle forms in Angular.

# Shared State managed with RxJS
RxJS Subjects and Observables are used to manage shared state in the Angular application. For example the current logged in user is managed by the account service with an RxJS BehaviorSubject and exposed to the rest of the app with an RxJS Observable that any Angular component can subscribe to and be notified when the user logs in or out.

# Fake Backend API
The Angular app runs with a fake backend by default to enable it to run completely in the browser without a real backend api (backend-less).

# Styled with Bootstrap 5
The app is styled with the CSS from Bootstrap 5.3.0.

# About
On this page, we can display sports news with the help of logged-in users. We have the option of registering and logging in, both processes are validated, for example we cannot register two users with the same username.
After logging in, we can modify our user's data and create articles, which the application will list after returning to the main page. We can also modify or delete our already created articles. We cannot modify the data of other users or their articles.
As a plus, a light-dark mode option is also available to the user.