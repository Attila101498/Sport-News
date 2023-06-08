import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { first } from 'rxjs/operators';
import { User } from '@app/_models';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {
    form: FormGroup;
    id: string;
    loading = false;
    submitting = false;
    submitted = false;
    user: User;


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { this.user = this.accountService.userValue; }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];

        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            // password only required in add mode
            password: ["", [Validators.minLength(6), ...(this.id ? [] : [Validators.required])]]
        });

        if (this.id) {
            // edit mode
            this.loading = true;
            this.accountService.getById(this.id)
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
        this.accountService.update(this.id, this.form.value).pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User saved', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/user/dashboard');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }
}