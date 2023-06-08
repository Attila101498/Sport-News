import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AccountRoutingModule } from '@app/account/account-routing.module';
import { LayoutComponent } from '@app/account/layout.component';
import { RegisterComponent } from '@app/account/register.component';
import { LoginComponent } from '@app/account/login.component';

@NgModule({
    declarations: [
        LayoutComponent,
        RegisterComponent,
        LoginComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountRoutingModule
    ]
})
export class AccountModule { }