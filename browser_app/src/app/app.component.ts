import {Component, AfterViewInit, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

import {tileLayer, latLng, Map, icon} from 'leaflet';

import * as L from 'leaflet';
// import 'leaflet-editable';

import {Coordinate} from 'tsgeo/Coordinate';
import {Vincenty} from 'tsgeo/Distance/Vincenty';
import {Polygon} from 'tsgeo/Polygon';


import {LabelService} from './label.service';
import {Label} from './label';


//     "@types/leaflet": "^1.4.4",


// http://jsfiddle.net/sowelie/3JbNY/
var MyCustomMarker = L.Marker.extend({

        bindPopup: function (htmlContent, options) {

            if (options && options.showOnMouseOver) {

                // call the super method
                L.Marker.prototype.bindPopup.apply(this, [htmlContent, options]);

                // unbind the click event
                this.off('click', this.openPopup, this);

                // bind to mouse over
                this.on('mouseover', function (e) {

                    // get the element that the mouse hovered onto
                    var target = e.originalEvent.fromElement || e.originalEvent.relatedTarget;
                    var parent = this._getParent(target, 'leaflet-popup');

                    // check to see if the element is a popup, and if it is this marker's popup
                    if (parent == this._popup._container)
                        return true;

                    // show the popup
                    this.openPopup();

                }, this);

                // and mouse out
                this.on('mouseout', function (e) {

                    // get the element that the mouse hovered onto
                    var target = e.originalEvent.toElement || e.originalEvent.relatedTarget;

                    // check to see if the element is a popup
                    if (this._getParent(target, 'leaflet-popup')) {

                        L.DomEvent.on(this._popup._container, 'mouseout', this._popupMouseOut, this);
                        return true;

                    }

                    // hide the popup
                    this.closePopup();

                }, this);

            }

        },

        _popupMouseOut: function (e) {

            // detach the event
            L.DomEvent.off(this._popup, 'mouseout', this._popupMouseOut, this);

            // get the element that the mouse hovered onto
            var target = e.toElement || e.relatedTarget;

            // check to see if the element is a popup
            if (this._getParent(target, 'leaflet-popup'))
                return true;

            // check to see if the marker was hovered back onto
            if (target == this._icon)
                return true;

            // hide the popup
            this.closePopup();

        },

        _getParent: function (element, className) {

            var parent = element.parentNode;

            while (parent != null) {

                if (parent.className && L.DomUtil.hasClass(parent, className))
                    return parent;

                parent = parent.parentNode;

            }

            return false;

        }


    }

    );


//var huh = new MyCustomMarker("blah", {})

var MyBoxClass = L.Class.extend({

    options: {
        width: 1,
        height: 1
    },

    initialize: function(name, options) {
        this.name = name;
        L.setOptions(this, options);
    }

});

var instance = new MyBoxClass('Red', {width: 10});



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit, OnInit {
    title = 'browser-app';


    gridOptions = {
        animateRows: true,
        getRowNodeId: function (data) {
            return data.id;
        },

        rowSelection: 'single',
        suppressCellSelection: true,

        columnDefs: [
            {headerName: 'Id', field: 'id', width: 40, editable: false},
            {headerName: 'Text', field: 'text', width: 160, editable: true},
            {headerName: 'Lat', field: 'lat', width: 75, editable: false},
            {headerName: 'Lng', field: 'lng', width: 75, editable: false}
        ]
    }


    private gridApi;

    rowData = [
        {id: 0, text: '', lat: 0, lng: 0, marker: null}
    ];


    options = {
        layers: [
            tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'})
        ],
        zoom: 5,
        center: latLng(46.879966, -121.726909),

        editable: true
    };

    mymap: Map;

    blueIcon = icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png'
    });

    yellowIcon = icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
        iconUrl: 'assets/images/leaflet/marker-icon-yellow.png',
        shadowUrl: 'assets/marker-shadow.png'
    });

    lastSelectedMarker = [null];

    //
    // https://www.concretepage.com/angular-2/angular-2-http-get-example
    //
    observableLabels: Observable<Label[]>;
    labels: Label[];
    errorMessage: string;


    onMapReady(map: Map) {
        console.log('map is ready!');
        this.mymap = map;
    }

    onMapClick(e) {
        console.log('You clicked the map at ' + e.latlng);

        const label = new Label();
        label.x = e.latlng.lng;
        label.y = e.latlng.lat;
        this.addMarkerToMap(label);
    }


    constructor(private labelService: LabelService) {
    }


    onGridReady(params) {
        console.log('grid ready')
        this.gridApi = params.api; // To access the grids API
    }

    ngOnInit(): void {
        this.observableLabels = this.labelService.getLabelsWithObservable();
        this.observableLabels.subscribe(
            labels => this.labels = labels,
            error => this.errorMessage = <any> error);
    }


    onRowSelected(event) {

        const myblueIcon = this.blueIcon;
        const myyellowIcon = this.yellowIcon;
        const mylastSelectedMarker = this.lastSelectedMarker;


        const selectedRows = this.gridApi.getSelectedRows();
        selectedRows.forEach(function (selectedRow, index) {
            console.log(index + ' ' + selectedRow.text);

            if (mylastSelectedMarker[0] != null) {
                mylastSelectedMarker[0].setIcon(myyellowIcon);
            }

            mylastSelectedMarker[0] = selectedRow.marker;
            selectedRow.marker.setIcon(myblueIcon);


        });
    }



    addMarkerToMap(label: Label) {

        const pos = L.latLng(label.y, label.x);
/*
        const oneMarker = new L.Marker(pos,{           title: label.text,
            icon: this.yellowIcon,
            draggable: true,
        } )
*/

        const oneMarker = new MyCustomMarker(pos, {
            title: label.text,
            icon: this.yellowIcon,
            draggable: true,
        });

        //const oneMarker = new MyCustomMarker();
        //oneMarker.position = pos;

        /*
        oneMarker.options = {           title: label.text,
            icon: this.yellowIcon,
            draggable: true,
        }
*/

        oneMarker.bindPopup('<b>' + label.id + '. ' + label.text + '</b>', {
            showOnMouseOver: true,
        });

        oneMarker.addTo(this.mymap);

        const tmp_gridapu = this.gridApi;

        oneMarker.on('dragend', function (e) {
            console.log('marker dragend event ' + oneMarker.options.title + ' ' + oneMarker.getLatLng() + ' ' + label.id);

            console.log('inside dragend envent ' + tmp_gridapu)

            const rowNode = tmp_gridapu.getRowNode(label.id);

            console.log('rowNode = ' + rowNode)

            rowNode.setSelected(true);

            rowNode.setDataValue('lat', oneMarker.getLatLng().lat);
            rowNode.setDataValue('lng', oneMarker.getLatLng().lng);

        });


        this.rowData.push({id: label.id, text: label.text, lat: label.y, lng: label.x, marker: oneMarker});

        this.gridApi.setRowData(this.rowData);

    }


    addMarkersToMap(labels: Label[]) {
        for (const label in labels) {
            this.addMarkerToMap(labels[label]);
        }
    }


    ngAfterViewInit() {


        /* Add the following in a method of TS class */

        const coordinate1 = new Coordinate(19.820664, -155.468066); // Mauna Kea Summit
        const coordinate2 = new Coordinate(20.709722, -156.253333); // Haleakala Summit

        console.log(coordinate1.getDistance(coordinate2, new Vincenty())); // returns 128130.850 (meters; ≈128 kilometers)


        /* Add the following in a method of TS class */
        const geofence = new Polygon();

        geofence.addPoint(new Coordinate(-12.085870, -77.016261));
        geofence.addPoint(new Coordinate(-12.086373, -77.033813));
        geofence.addPoint(new Coordinate(-12.102823, -77.030938));
        geofence.addPoint(new Coordinate(-12.098669, -77.006476));

        const outsidePoint = new Coordinate(-12.075452, -76.985079);
        const insidePoint = new Coordinate(-12.092542, -77.021540);

        console.log(geofence.contains(outsidePoint)); // returns bool(false) the point is outside the polygon
        console.log(geofence.contains(insidePoint)); // returns bool(true) the point is inside the polygon

        this.observableLabels.subscribe(labels => this.addMarkersToMap(labels));

    }
}



