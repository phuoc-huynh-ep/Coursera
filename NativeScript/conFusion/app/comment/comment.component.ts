import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {TextField} from "tns-core-modules/ui/text-field";
import { Slider } from "tns-core-modules/ui/slider";
import { Page } from 'ui/page';

@Component({
    moduleId: module.id,
    templateUrl: './comment.component.html'
})
export class CommentComponent implements OnInit {

    comment: FormGroup;

    constructor(private params: ModalDialogParams,
        private formBuilder: FormBuilder,
        private page: Page) {
    }

    ngOnInit() {
        this.comment = this.formBuilder.group({
            author: ['', Validators.required],
            rating: 5,
            comment: ['', Validators.required]
        });

    }
    onAuthorChange(args) {
        let textField = <TextField>args.object;

        this.comment.patchValue({ author: textField.text });
    }

    onCommentChange(args) {
        let textField = <TextField>args.object;

        this.comment.patchValue({ comment: textField.text });
    }

    onRatingSliderChange(args) {
        let slider = <Slider>args.object;

        this.comment.patchValue({ rating: slider.value });
    }
    
    public onSubmit() {
        let date = new Date();
        this.comment.value.date = date.toISOString();
        console.log(this.comment.value);

        this.params.closeCallback(this.comment.value);
    }
}