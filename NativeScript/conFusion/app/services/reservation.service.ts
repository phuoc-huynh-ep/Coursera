import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { CouchbaseService } from '../services/couchbase.service';

@Injectable()
export class ReservationService {

    reservations: any;
    docId: string = "reservations";

    constructor(private couchbaseService: CouchbaseService) {
        this.reservations = [];

        let doc = this.couchbaseService.getDocument(this.docId);
        if (doc == null) {
            this.couchbaseService.createDocument({ "reservations": [] }, this.docId);
        } else {
            this.reservations = doc.reservations;
        }
    }

    addReservation(revservation: any): boolean {
        this.reservations.push(revservation);
        this.couchbaseService.updateDocument(this.docId, { "reservations": this.reservations });
        let doc = this.couchbaseService.getDocument(this.docId);
        console.log(JSON.stringify(doc));
        return true;
    }
}