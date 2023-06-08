import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { UserRoutingModule } from '@app/user/user-routing.module';
import { LayoutComponent } from '@app/user/layout.component';
import { EditComponent } from '@app/user/edit.component';
import { DashboardComponent } from '@app/user/dashboard.component';

@NgModule({
    declarations: [
        LayoutComponent,
        EditComponent,
        DashboardComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UserRoutingModule
    ]
})
export class UserModule { }