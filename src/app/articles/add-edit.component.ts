import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, ArticleService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
    templateUrl: './add-edit.component.html',
    styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    title: string;
    loading = false;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private articleService: ArticleService,
        private alertService: AlertService
    ) { }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];

        this.form = this.formBuilder.group({
            url: ['', Validators.required],
            type: ['', Validators.required],
            text: ['', [Validators.required, Validators.minLength(10)]]
        });

        this.title = 'Add Article';
        if (this.id) {
            // edit mode
            this.title = 'Edit Article';
            this.loading = true;
            this.articleService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    this.loading = false;
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) { return; }

        this.submitting = true;
        this.saveArticle().pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Article saved', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/articles');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }

    private saveArticle() {
        // create or update user based on id param
        return this.id
            ? this.articleService.update(this.id, this.form.value)
            : this.articleService.add(this.form.value);
    }
}