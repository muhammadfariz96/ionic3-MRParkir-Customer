import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';
import { snapshotToArray } from '../../../environments/firebasebackend';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  KavA = [];
  JmlKavA = [];
  KavB = [];
  JmlKavB = [];
  KavC = [];
  JmlKavC = [];
  KavD = [];
  JmlKavD = [];
  Tarif = [];

  constructor(
    public navCtrl: NavController, public loadingCtrl: LoadingController, public navParams: NavParams) {
    this.presentLoading()
    this.loadInformasi()
  }

  loadInformasi() {
    firebase.database().ref('Kavling/InformasiKavling/KavA/Informasi').on('value', resp => {
      this.KavA = snapshotToArray(resp);
    });

    firebase.database().ref('Kavling/InformasiKavling/KavA/JmlKavA').on('value', resp => {
      this.JmlKavA = snapshotToArray(resp);
    });

    firebase.database().ref('Kavling/InformasiKavling/KavB/Informasi').on('value', resp => {
      this.KavB = snapshotToArray(resp);
    });

    firebase.database().ref('Kavling/InformasiKavling/KavB/JmlKavB').on('value', resp => {
      this.JmlKavB = snapshotToArray(resp);
    });

    firebase.database().ref('Kavling/InformasiKavling/KavC/Informasi').on('value', resp => {
      this.KavC = snapshotToArray(resp);
    });

    firebase.database().ref('Kavling/InformasiKavling/KavC/JmlKavC').on('value', resp => {
      this.JmlKavC = snapshotToArray(resp);
    });

    firebase.database().ref('Kavling/InformasiKavling/KavD/Informasi').on('value', resp => {
      this.KavD = snapshotToArray(resp);
    });

    firebase.database().ref('Kavling/InformasiKavling/KavD/JmlKavD/').on('value', resp => {
      this.JmlKavD = snapshotToArray(resp);
    });

    firebase.database().ref('Tarif/').on('value', resp => {
      this.Tarif = snapshotToArray(resp);
    });
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 2000
    });
    loader.present();
  }

  openParking() {
    this.navCtrl.push('ParkingPage');
  }

  openBooking() {
    this.navCtrl.push('BookingPage');
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.loadInformasi()
      refresher.complete();
    }, 200);
  }


}
