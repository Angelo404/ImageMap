import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MainService } from '../../services/main.service';
import { PhotoModel } from '../../models/PhotoModel.Interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  private _token = 'pk.eyJ1IjoiYW5nZWxvNDA0IiwiYSI6ImNqaHJqNm00bDFnZ2szN3B2Z2RkbmJjb3EifQ.EKBkiQyQp3rDF664-rdVVQ';
  private _mapDefaultType = 'mapbox.emerald';
  public _map: L.Map;
  private _pointsOfInterest: Array<object>;
  private _markerLayer: L.LayerGroup;
  private _imagesOnScreen: number;

  constructor(private _service: MainService) { }

  ngOnInit() {
    this._map = new L.Map('mapid', {
      zoomControl: false
    }).setView([51.505, -0.09], 13);
    this._markerLayer = L.layerGroup().addTo(this._map);

    L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?access_token=${this._token}`, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this._map);

    this._map.on('moveend', this.viewChange.bind(this));
    this.viewChange();
  }

  private async viewChange() {
    const bounds = this._map.getBounds();
    this._markerLayer.clearLayers();
    const cordinates = {'East': bounds.getEast(), 'West': bounds.getWest(), 'North': bounds.getNorth(), 'South': bounds.getSouth()};
    this._pointsOfInterest = await this._service.getPointsOfInterest(cordinates);
    this.addPointsToMap(this._pointsOfInterest);
  }

  private async addPointsToMap(entries: Array<object>) {
    this._imagesOnScreen = entries.length;
    await entries.forEach(entry => {
      L.marker([entry['latitude'], entry['longitude']]).addTo(this._markerLayer)
      .bindPopup(L.popup().setContent(`<div style='width: 300px;'>
      <h3>${entry['ownername']}</h3>
      <a href=${entry['url_m']} target="_blank">
      <img src=${entry['url_m']} style='width: 100%;'>
      </a>
      <p> title: ${entry['title']} </p>
      <p> date: ${this._service.getUploadTime(entry['dateupload'])} </p>
      </div>`));
    });
  }

  private async getNew() {
    await this._service.getNewPointsOfInterest();
  }

  private async saveProgress() {
    await this._service.saveProgress();
  }
}
