import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { snapshotToArray } from '../../../environments/firebasebackend';
import { Token, Kavling } from '../../../environments/konfigmrp';



@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  tokendataRef: AngularFireObject<any>;
  tokendata: Observable<Token>;
  kavdataRef: AngularFireObject<any>;
  kavdata: Observable<Kavling>;
  Transaksi = [];
  Booking = [];
  TopupUser = [];

  detailkav = {
    Nama: '',
    Status: '',
    Value: '',
    Ptersedia: 0
  }

  tglSekarang;
  notoken;
  statRotasi;
  tabs = 'transaksi';

  constructor(public qrScanner: QRScanner, private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public toastCtrl: ToastController) {
    this.gettglDatang()
    this.loadTransaksi()
    this.loadTokenParkir()
  }
  gettglDatang() {
    var dateObj = new Date()
    var year = dateObj.getFullYear().toString()
    var month = dateObj.getMonth().toString()
    var date = dateObj.getDate().toString()
    var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Augst', 'Sept', 'Oct', 'Nov', 'Dec']

    this.tglSekarang = date + ' ' + monthArray[month] + ' ' + year;
  }

  loadTransaksi() {
    this.afAuth.authState.take(1).subscribe(auth => {
      firebase.database().ref(`Transaksi/UserBooking/${auth.uid}`).orderByChild('unixTiba').on('value', resp => {
        this.Booking = snapshotToArray(resp);
      })
      firebase.database().ref(`Transaksi/User/${auth.uid}`).orderByChild('unixTiba').on('value', resp => {
        this.Transaksi = snapshotToArray(resp);
      })
      firebase.database().ref(`Transaksi/Topup/User/${auth.uid}`).orderByChild('datetime').on('value', resp => {
        this.TopupUser = snapshotToArray(resp);
      })
    });
  }

  loadTokenParkir() {
    this.tokendataRef = this.afDatabase.object('TokenParkir/')
    this.tokendata = this.tokendataRef.valueChanges();
    this.tokendata.subscribe(res => {
      this.notoken = res.TokenHarian;
      this.statRotasi = res.StatusRotasi;
    });
    this.kavdataRef = this.afDatabase.object(`Kavling/BookingKavling/KavlingD`)
    this.kavdata = this.kavdataRef.valueChanges();
    this.kavdata.subscribe(KS => {
      this.detailkav = KS;
    });
  }

  openDetail(nextdetail: any) {
    let detailpass = JSON.stringify(nextdetail)
    this.navCtrl.push('DetailhistoryPage', { detailpass });
  }
  openDetailTop(nextdetail: any) {
    let detailtop = JSON.stringify(nextdetail)
    this.navCtrl.push('DetailtopupPage', { detailtop });
  }

  cekStatus(book) {
    var tglBooking = book.TglDatang;
    var unix1 = book.unixTiba
    var unix = new Date().getTime()
    var diff = unix - unix1;
    let menit = Math.floor(((diff / 1000) / 60) % 60); // menit
    let jam = Math.floor((((diff / 1000) / 60) / 60) % 60); // jam

    if (this.tglSekarang == tglBooking && jam == 0 && menit < 60) {
      let alert = this.alertCtrl.create({
        title: 'Konfirmasi Booking',
        message: 'Apakah Anda Ingin Parkir?',
        buttons: [
          {
            text: 'Batal',
            role: 'batal',
            handler: () => {
            }
          },
          {
            text: 'Parkir',
            handler: () => {
              this.scanCode(book);
            }
          }
        ],
        cssClass: 'alertBerhasil'
      });
      alert.present();
    }
    else if (this.tglSekarang == tglBooking && jam < 0) {
      const toast = this.toastCtrl.create({
        message: 'Waktu Booking Tidak Sesuai',
        duration: 3000,
      });
      toast.present();
    }
    else {
      const alert = this.alertCtrl.create({
        subTitle: 'Booking Expired',
        buttons: [
          {
            text: 'OK'
          }
        ],
        cssClass: 'alertGagal'
      });
      alert.present();
      this.tabs = 'transaksi';
      this.expiredBook(book);
    }
  }

  statusKavling(text, book, status = 'Ready') {
    if (this.notoken == text && this.statRotasi == status) {
      const alert = this.alertCtrl.create({
        subTitle: 'Parkir Berhasil',
        buttons: ['OK'],
        cssClass: 'alertBerhasil'
      });
      alert.present();
      this.parkir(book);
    }
    else if (this.notoken != text && this.statRotasi == status) {
      const toast = this.toastCtrl.create({
        message: 'Token Parkir Tidak Sesuai',
        duration: 3000
      });
      toast.present();
    }
    else if (this.statRotasi != status) {
      const toast = this.toastCtrl.create({
        message: 'Kavling Sedang Rotasi',
        duration: 3000
      });
      toast.present();
    }
  }

  updateKavling(NoKavling) {
    var kavNow, StatusNow;

    kavNow = this.detailkav.Ptersedia + 1;
    StatusNow = 'false'

    let update = {
      Ptersedia: kavNow,
      Status: StatusNow
    }
    firebase.database().ref(`Kavling/BookingKavling/Kavling${NoKavling}`).update(update);
  }

  scanCode(book) {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.qrScanner.show()
          window.document.querySelector('ion-app').classList.add('cameraView');
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
            window.document.querySelector('ion-app').classList.remove('cameraView');
            this.qrScanner.hide();
            this.statusKavling(text, book);
            scanSub.unsubscribe();
          });
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  parkir(book) {
    let newTransaksi = {
      UID: book.UID,
      NoTransaksi: book.NoTransaksi,
      TglDatang: book.TglDatang,
      TglKeluar: '',
      WktTiba: book.WktTiba,
      unixTiba: book.unixTiba,
      Wktkeluar: '',
      unixKeluar: book.unixTiba,
      DurasiParkir: '',
      NoKen: book.NoKen,
      NoHP: book.NoHP,
      NoToken: this.notoken,
      NoKavling: book.NoKavling,
      JenisTransaksi: 'Reguler',
      Status: 'Parked',
      PetugasKonfirmasi: '',
      BayarBooking: book.BayarBooking,
      TotalBiaya: ''
    }
    let updateParkir = {
      NoToken: this.notoken,
      JenisTransaksi: 'Reguler',
      Status: 'Parked'
    }

    let updateRotasi = {
      PosisiRotasi: book.NoKavling,
      StatusRotasi: 'Sedang Berotasi'
    }

    firebase.database().ref(`Transaksi/Keseluruhan/${book.NoTransaksi}`).update(updateParkir);
    firebase.database().ref(`Transaksi/Konfirmasi/${book.NoTransaksi}`).set(newTransaksi);
    firebase.database().ref(`Transaksi/User/${book.UID}/${book.NoTransaksi}`).set(newTransaksi);
    firebase.database().ref(`Transaksi/UserBooking/${book.UID}/${book.NoTransaksi}`).remove();
    firebase.database().ref('TokenParkir/').update(updateRotasi);
  }

  cekCancel(book) {
    let alert = this.alertCtrl.create({
      title: 'Konfirmasi Cancel',
      message: 'Apakah Anda Yakin Cancel Booking?',
      buttons: [
        {
          text: 'Batal',
          role: 'batal',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yakin',
          handler: () => {
            this.cancelBook(book);
          }
        }
      ],
      cssClass: 'alertGagal'
    });
    alert.present();
  }

  cancelBook(book) {
    this.updateKavling(book.NoKavling)

    let newCancel = {
      UID: book.UID,
      NoTransaksi: book.NoTransaksi,
      TglDatang: book.TglDatang,
      WktTiba: book.WktTiba,
      NoKen: book.NoKen,
      NoHP: book.NoHP,
      NoKavling: book.NoKavling,
      JenisTransaksi: 'Cancel',
      Status: 'Cancel',
      BayarBooking: book.BayarBooking
    }
    let updateCancel = {
      Status: 'Cancel',
      JenisTransaksi: 'Cancel'
    }
    firebase.database().ref(`Transaksi/User/${book.UID}/${book.NoTransaksi}`).set(newCancel);
    firebase.database().ref(`Transaksi/Keseluruhan/${book.NoTransaksi}`).update(updateCancel);
    firebase.database().ref(`Transaksi/UserBooking/${book.UID}/${book.NoTransaksi}`).remove();
  }

  expiredBook(book) {
    this.updateKavling(book.NoKavling)

    let newExpired = {
      UID: book.UID,
      NoTransaksi: book.NoTransaksi,
      TglDatang: book.TglDatang,
      WktTiba: book.WktTiba,
      NoKen: book.NoKen,
      NoHP: book.NoHP,
      NoKavling: book.NoKavling,
      JenisTransaksi: 'Expired',
      Status: 'Expired',
      BayarBooking: book.BayarBooking
    }
    let updateExpired = {
      Status: 'Expired',
      JenisTransaksi: 'Expired'
    }
    firebase.database().ref(`Transaksi/User/${book.UID}/${book.NoTransaksi}`).set(newExpired);
    firebase.database().ref(`Transaksi/Keseluruhan/${book.NoTransaksi}`).update(updateExpired);
    firebase.database().ref(`Transaksi/UserBooking/${book.UID}/${book.NoTransaksi}`).remove();
  }

}
