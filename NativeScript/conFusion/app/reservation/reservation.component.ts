import { Component, OnInit, Inject, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { TextField } from 'ui/text-field';
import { DatePipe } from '@angular/common';
import { Switch } from 'ui/switch';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Animation, AnimationDefinition } from "ui/animation";
import { View } from "ui/core/view";
import { Page } from "ui/page";
import * as enums from "ui/enums";

import { DrawerPage } from '../shared/drawer/drawer.page';
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";
import { CouchbaseService } from '../services/couchbase.service';

import { ReservationService } from '../services/reservation.service';

@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit {

    reservation: FormGroup;
    showResult: boolean = false;
    reservations: any;
    docId: string = "reservations";

    cardForm: View;
    cardView: View;

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private modalService: ModalDialogService,
        private vcRef: ViewContainerRef,
        private page: Page,
        private reservationService: ReservationService,
        private couchbaseService: CouchbaseService) {
        super(changeDetectorRef);

        this.reservation = this.formBuilder.group({
            guests: 3,
            smoking: false,
            dateTime: ['', Validators.required]
        });

        let doc = this.couchbaseService.getDocument(this.docId);
        if (doc == null) {
            this.couchbaseService.createDocument({ "reservations": [] }, this.docId);
        } else {
            this.reservations = doc.reservations;
        }
    }

    ngOnInit() {

    }

    onSmokingChecked(args) {
        let smokingSwitch = <Switch>args.object;
        if (smokingSwitch.checked) {
            this.reservation.patchValue({ smoking: true });
        }
        else {
            this.reservation.patchValue({ smoking: false });
        }
    }

    onGuestChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ guests: textField.text });
    }

    onDateTimeChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ dateTime: textField.text });
    }

    createModalView(args) {

        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: args,
            fullscreen: false
        };

        this.modalService.showModal(ReservationModalComponent, options)
            .then((result: any) => {
                if (args === "guest") {
                    this.reservation.patchValue({ guests: result });
                }
                else if (args === "date-time") {
                    this.reservation.patchValue({ dateTime: result });
                }
            });

    }

    onSubmit() {
        // console.log(JSON.stringify(this.reservation.value));
        this.addReservation(this.reservation.value);
        this.animateRevervation();
    }

    animateRevervation() {
        this.cardForm = <View>this.page.getViewById<View>("cardForm");
        this.cardView = <View>this.page.getViewById<View>("cardView");
        this.cardForm.animate({
            scale: { x: 1, y: 1 },
            translate: { x: 0, y: 0 },
            opacity: 0,
            duration: 3000,
            curve: enums.AnimationCurve.easeIn
        }).then(() => {
            this.showResult = true;
            this.cardView.animate({
                scale: { x: 1, y: 1 },
                translate: { x: 0, y: 0 },
                opacity: 1,
                duration: 3000,
                curve: enums.AnimationCurve.easeIn
            }).then(() => {
                console.log("Animation finished.");
            }).catch((e) => {
                console.log(e.message);
            });
        }).catch((e) => {
            console.log(e.message);
        });
    }

    addReservation(revservation: any): boolean {
        this.reservations.push(revservation);
        this.couchbaseService.updateDocument(this.docId, { "reservations": this.reservations });
        let doc = this.couchbaseService.getDocument(this.docId);
        console.log(JSON.stringify(doc));
        return true;
    }
}
