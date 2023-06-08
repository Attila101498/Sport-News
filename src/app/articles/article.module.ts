import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ArticleRoutingModule } from '@app/articles/article-routing.module';
import { LayoutComponent } from '@app/articles/layout.component';
import { ListComponent } from '@app/articles/list.component';
import { AddEditComponent } from '@app/articles/add-edit.component';

@NgModule({
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ArticleRoutingModule
    ]
})
export class ArticleModule { }