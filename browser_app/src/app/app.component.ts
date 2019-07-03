import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { tileLayer, latLng, Map } from 'leaflet';

import * as L from 'leaflet';

import {Coordinate} from "tsgeo/Coordinate";
import {Vincenty}   from "tsgeo/Distance/Vincenty";
import {Polygon}   from "tsgeo/Polygon";


import { LabelService } from './label.service';
import { Label } from './label';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  })

export class AppComponent implements AfterViewInit,  OnInit {
  title = 'browser-app';

  columnDefs = [
        {headerName: 'Make', field: 'make' },
        {headerName: 'Model', field: 'model' },
        {headerName: 'Price', field: 'price'}
  ];

  rowData = [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxter', price: 72000 }
        ];

  options = {
	    layers: [
		    tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
	    ],
	    zoom: 5,
        center: latLng(46.879966, -121.726909),

        editable: true
        };

mymap: Map;
  onMapReady(map: Map) {
  console.log("map is ready!")
  this.mymap = map;
  }

  onMapClick(e) {
    console.log("You clicked the map at " + e.latlng);
  }

  //
  // https://www.concretepage.com/angular-2/angular-2-http-get-example
  //
  observableLabels: Observable<Label[]>
  labels: Label[];
  errorMessage: String;
  constructor(private labelService: LabelService) { 
  }

  ngOnInit(): void {
      this.observableLabels = this.labelService.getLabelsWithObservable();
	  this.observableLabels.subscribe(
            labels => this.labels = labels,
            error => this.errorMessage = <any>error);
  }

  addMarkerToMap(labels: Label[]) {
        for (var label in labels) {
            console.log(labels[label].text)
            console.log(labels[label].x)
            console.log(labels[label].y)

            var marker = L.marker([labels[label].y, labels[label].x]).addTo(this.mymap);
        }
    }


  ngAfterViewInit() {


    /* Add the following in a method of TS class */

    let coordinate1 = new Coordinate(19.820664, -155.468066); // Mauna Kea Summit
    let coordinate2 = new Coordinate(20.709722, -156.253333); // Haleakala Summit

    console.log(coordinate1.getDistance(coordinate2, new Vincenty())); // returns 128130.850 (meters; ≈128 kilometers)


    /* Add the following in a method of TS class */
    let geofence = new Polygon();

    geofence.addPoint(new Coordinate(-12.085870,-77.016261));
    geofence.addPoint(new Coordinate(-12.086373,-77.033813));
    geofence.addPoint(new Coordinate(-12.102823,-77.030938));
    geofence.addPoint(new Coordinate(-12.098669,-77.006476));

    let outsidePoint = new Coordinate(-12.075452, -76.985079);
    let insidePoint = new Coordinate(-12.092542, -77.021540);

    console.log(geofence.contains(outsidePoint)); // returns bool(false) the point is outside the polygon
    console.log(geofence.contains(insidePoint)); // returns bool(true) the point is inside the polygon

    this.observableLabels.subscribe( labels => this.addMarkerToMap(labels) )

  }
}
