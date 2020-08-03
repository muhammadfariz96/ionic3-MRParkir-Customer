import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import * as firebase from 'firebase';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { DurasiSekarang, Tarif } from '../../../environments/konfigmrp';

@IonicPage()
@Component({
  selector: 'page-detailhistory',
  templateUrl: 'detailhistory.html',
})
export class DetailhistoryPage {

  durasidataref: AngularFireObject<any>;
  durasidata: Observable<DurasiSekarang>;
  tarifdataRef: AngularFireObject<any>;
  tarifdata: Observable<Tarif>;

  notransaksi: any;
  detailhistory: any;
  icon = 'ios-arrow-down';
  aksi = '';
  amount = {
    booking: 0,
    parkir: 0
  };
  tarifSelanjutnya;
  biaya;
  durasi;
  dur;
  tabBarElement;

  constructor(private afDatabase: AngularFireDatabase,
    public alertCtrl: AlertController, public viewCtrl: ViewController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.loadData()
  }

  loadData() {
    this.notransaksi = this.navParams.get('detailpass');
    this.detailhistory = JSON.parse(this.notransaksi);
    this.amount.booking = this.detailhistory.TotalBiaya + this.detailhistory.BayarBooking;
    this.amount.parkir = this.detailhistory.TotalBiaya + this.detailhistory.BiayaParkir;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar')

    
    this.tarifdataRef = this.afDatabase.object(`Tarif/SELANJUTNYA`)
    this.tarifdata = this.tarifdataRef.valueChanges();
    this.tarifdata.subscribe(TS => {
      this.tarifSelanjutnya = TS.TarifParkir;
    })
  }

  Retrieve(dataQR) {
    let alert = this.alertCtrl.create({
      message: 'Apakah Anda Ingin Mengambil Kendaraan?',
      buttons: [
        {
          text: 'Tidak',
          role: 'Tidak',
          handler: () => {
          }
        },
        {
          text: 'Iya',
          handler: () => {
            this.dismiss()
            this.showQR(dataQR)
          }
        }
      ],
      cssClass: 'alertBerhasil'
    });
    alert.present();
  }

  showQR(dataQR) {
    let detailQR = JSON.stringify(dataQR)
    this.navCtrl.push('QRcodePage', { detailQR })
  }

  lihat() {
    if (this.aksi == '') {
      this.icon = 'ios-arrow-up'
      this.aksi = 'lihat'
    }
    else if (this.aksi == 'lihat') {
      this.icon = 'ios-arrow-down'
      this.aksi = ''
    }
  }


  durasiNow(tran) {
    if (tran.Status == 'Parked') {
      var awal = parseInt(tran.unixTiba);
      var notr = tran.NoTransaksi;
      var tarif = parseInt(this.tarifSelanjutnya);

      this.dur = setInterval(function () {
        var now = new Date().getTime();
        let diff = now - awal;
        let sec = Math.floor((diff / 1000) % 60); // detik
        let min = Math.floor(((diff / 1000) / 60) % 60); // menit
        let hr = Math.floor((diff / 1000) / (60 * 60)); // jam
        let sementara = hr + " jam, " + min + " menit, " + sec + " detik ";
        let totbiaya = hr * tarif;

        firebase.database().ref(`Transaksi/Konfirmasi/${notr}/durasi`).set(sementara)
        firebase.database().ref(`Transaksi/Konfirmasi/${notr}/biaya`).set(totbiaya)
      }, 1000);
    }
  }

  loadDurasi(tran) {
      this.durasidataref = this.afDatabase.object(`Transaksi/Konfirmasi/${tran.NoTransaksi}`)
      this.durasidata = this.durasidataref.valueChanges();
      this.durasidata.subscribe(res => {
        this.durasi = res.durasi
        this.biaya = res.biaya
      })
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
    this.durasiNow(this.detailhistory);
    this.loadDurasi(this.detailhistory);
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
    clearInterval(this.dur);
    this.durasi = '';
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
