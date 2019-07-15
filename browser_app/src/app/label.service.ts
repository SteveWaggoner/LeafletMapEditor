import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Label} from './label';

@Injectable()
export class LabelService {

    url = 'http://localhost:3000/api/label/';

    constructor(private http: Http) {
    }

    getLabelsWithObservable(): Observable<Label[]> {
        return this.http.get(this.url)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }


    private extractData(res: Response) {
        const body = res.json();
        return body;
    }

    private handleErrorObservable(error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }

}


