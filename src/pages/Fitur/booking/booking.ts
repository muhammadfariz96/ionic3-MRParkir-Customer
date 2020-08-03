import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ToastController } from 'ionic-angular';

import * as firebase from 'firebase';
import { snapshotToArray } from '../../../environments/firebasebackend';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Tarif, Profile, Kavling } from '../../../environments/konfigmrp';
import { ToolsProvider } from '../../../providers/tools/tools';
@IonicPage()
@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {

  profdataRef: AngularFireObject<any>;
  profdata: Observable<Profile>;
  tarifdataRef: AngularFireObject<any>;
  tarifdata: Observable<Tarif>;
  kavdataRef: AngularFireObject<any>;
  kavdata: Observable<Kavling>;
  StatKav = [];

  cek = {
    jam: 0,
    menit: 0
  };

  UID;
  detailprofil = {
    fullname: '',
    nokendaraan: '',
    nohp: '',
    saldo: 0
  };

  detailkav = {
    Nama: '',
    Status: '',
    Value: '',
    Ptersedia: 0
  }

  nokav = '';
  saldouser;
  tarifbooking;
  randomNumber;
  wkttiba;
  waktuBooking;
  tglDatang;
  tglbooking;
  unixTiba;

  tabBarElement: any;
  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,private Tools: ToolsProvider,
    public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,
    public alertCtrl: AlertController, public viewCtrl: ViewController) {
    this.waktuNow()
    this.penentuTarif()
    this.profilUser()
    this.loadKavling()
  }

  waktuNow() {
    var TimeObj = new Date()
    var year = TimeObj.getFullYear().toString()
    var month = TimeObj.getMonth().toString()
    var date = TimeObj.getDate().toString()
    var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Augst', 'Sept', 'Oct', 'Nov', 'Dec']
    var numberArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    var hours = ("0" + TimeObj.getHours()).slice(-2)
    var minutes = ("0" + TimeObj.getMinutes()).slice(-2)
    var sec = ("0" + TimeObj.getSeconds()).slice(-2)

    this.tglbooking = date + '-' + monthArray[month] + '-' + year;
    this.tglDatang = date + ' ' + monthArray[month] + ' ' + year;
    this.waktuBooking = hours + ':' + minutes + ':' + sec;
    this.randomNumber = 'MRPB' + year + numberArray[month] + date + Math.floor(Math.random() * 10000)
  }

  penentuTarif() {
    this.tarifdataRef = this.afDatabase.object(`Tarif/PARKIRBOOKING`)
    this.tarifdata = this.tarifdataRef.valueChanges();
    this.tarifdata.subscribe(TB => {
      this.tarifbooking = parseInt(TB.TarifParkir);
    })
  }

  profilUser() {
    this.afAuth.authState.take(1).subscribe(data => {
      this.profdataRef = this.afDatabase.object(`Akun/Customer/${data.uid}`)
      this.profdata = this.profdataRef.valueChanges();
      this.profdata.subscribe(res => {
        this.detailprofil = res;
        this.UID = data.uid;
      })
    })
  }

  loadKavling() {
    firebase.database().ref('Kavling/BookingKavling/').on('value', resp => {
      this.StatKav = snapshotToArray(resp);
    });
    this.kavdataRef = this.afDatabase.object(`Kavling/BookingKavling/KavlingD`)
    this.kavdata = this.kavdataRef.valueChanges();
    this.kavdata.subscribe(KS => {
      this.detailkav = KS;
    });

    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }


  getwkttiba() {
    var datetime = this.tglbooking + ' ' + this.waktuBooking;
    var unix1 = Date.parse(datetime)
    var unix = new Date().getTime()
    var diff = unix - unix1;

    this.cek.menit = Math.floor(((diff / 1000) / 60) % 60); // menit
    this.cek.jam = Math.floor((diff / 1000) / (60 * 60)); // jam
    this.unixTiba = unix1;
    this.wkttiba = this.waktuBooking;
  }

  cekForm(saldo) {
    this.getwkttiba()

    if (this.nokav != '' && saldo >= this.tarifbooking && this.cek.jam <= 0 && this.cek.menit <= 0) {
      const alert = this.alertCtrl.create({
        subTitle: 'Booking Berhasil',
        buttons: ['OK'],
        cssClass: 'alertBerhasil'
      });
      alert.present();
      this.bayarBooking(saldo);
    }
    else if (this.nokav == '' && saldo >= this.tarifbooking) {
      const toast = this.toastCtrl.create({
        message: 'Pilihan Kavling Belum Terisi',
        duration: 3000,
      });
      toast.present();
    } else if (this.nokav != '' && saldo < this.tarifbooking) {
      const toast = this.toastCtrl.create({
        message: 'Saldo Anda Belum Mencukupi',
        duration: 3000
      });
      toast.present();
    }
    else if (this.nokav == '' && saldo < this.tarifbooking) {
      const toast = this.toastCtrl.create({
        message: 'Kavling Belum Terisi dan Saldo Belum Mencukupi',
        duration: 3000
      });
      toast.present();
    }
    else {
      const toast = this.toastCtrl.create({
        message: 'Waktu Sudah Lewat',
        duration: 3000
      });
      toast.present();
    }
  }

  updateKavling(nokav){
    var kavNow,StatusNow;

    if(this.detailkav.Ptersedia > 1 ){
      kavNow = this.detailkav.Ptersedia - 1;
      StatusNow = 'false'
    }
    else if(this.detailkav.Ptersedia <= 1 ){
      kavNow = 0;
      StatusNow = 'true'
    }
    let update = {
      Ptersedia: kavNow,
      Status: StatusNow
    }
    firebase.database().ref(`Kavling/BookingKavling/Kavling${nokav}`).update(update);
  }

  bayarBooking(saldouser) {
    var tarif = parseInt(this.tarifbooking);
    let saldousernow = saldouser - tarif;
    this.addTransaksi(saldousernow);
    this.Tools.PendapatanOrderParkir(tarif);
  }

  addTransaksi(saldousernow) {

    let newTransaksi = {
      UID: this.UID,
      NoTransaksi: this.randomNumber,
      TglDatang: this.tglDatang,
      TglKeluar: '',
      WktTiba: this.wkttiba,
      unixTiba: this.unixTiba,
      Wktkeluar: '',
      unixKeluar: '',
      DurasiParkir: '',
      NoKen: this.detailprofil.nokendaraan,
      NoHP: this.detailprofil.nohp,
      NoToken: '',
      NoKavling: this.nokav,
      JenisTransaksi: 'Booking',
      Status: 'Booked',
      BayarBooking: this.tarifbooking,
      TotalBiaya: ''
    }
    firebase.database().ref(`Akun/Customer/${this.UID}/saldo`).set(saldousernow)
    firebase.database().ref(`Transaksi/Keseluruhan/${this.randomNumber}`).set(newTransaksi)
    firebase.database().ref(`Transaksi/UserBooking/${this.UID}/${this.randomNumber}`).set(newTransaksi)

    this.updateKavling(this.nokav);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

}
