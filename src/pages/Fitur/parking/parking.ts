import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ToastController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

import * as firebase from 'firebase';
import { snapshotToArray } from '../../../environments/firebasebackend';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Token, Profile, Tarif } from '../../../environments/konfigmrp';
import { ToolsProvider } from '../../../providers/tools/tools';



@IonicPage()
@Component({
  selector: 'page-parking',
  templateUrl: 'parking.html',
})
export class ParkingPage {

  tokendataRef: AngularFireObject<any>;
  tokendata: Observable<Token>;
  profdataRef: AngularFireObject<any>;
  profdata: Observable<Profile>;
  tarifdataRef: AngularFireObject<any>;
  tarifdata: Observable<Tarif>;
  StatKav = [];

  detailprofil = {
    fullname: '',
    nokendaraan: '',
    nohp: '',
    saldo: 0
  };

  UID;
  saldouser;
  tarifparkir;
  nokav = '';
  notoken;
  statRotasi;
  randomNumber;
  tglDatang;
  wkttiba;
  unixTiba;
  unixKeluar;

  tabBarElement: any;
  constructor(public qrScanner: QRScanner, private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,private Tools: ToolsProvider,
    public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public viewCtrl: ViewController, public toastCtrl: ToastController) {
    this.penentuTarif()
    this.profilUser()
    this.loadKavling()
    this.loadTokenParkir()
  }

  penentuTarif() {
    this.tarifdataRef = this.afDatabase.object(`Tarif/PARKIRBIASA`)
    this.tarifdata = this.tarifdataRef.valueChanges();
    this.tarifdata.subscribe(TB => {
      this.tarifparkir = parseInt(TB.TarifParkir);
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
    firebase.database().ref('Kavling/StatusKavling').on('value', resp => {
      this.StatKav = snapshotToArray(resp);
    });
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar')
  }

  loadTokenParkir() {
    this.tokendataRef = this.afDatabase.object('TokenParkir/')
    this.tokendata = this.tokendataRef.valueChanges();
    this.tokendata.subscribe(res => {
      this.notoken = res.TokenHarian;
      this.statRotasi = res.StatusRotasi;
    })
  }

  gettglDatang() {
    var dateObj = new Date()
    var year = dateObj.getFullYear().toString()
    var month = dateObj.getMonth().toString()
    var date = dateObj.getDate().toString()
    var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Augst', 'Sept', 'Okt', 'Nov', 'Des']
    var numberArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

    this.tglDatang = date + ' ' + monthArray[month] + ' ' + year;
    this.randomNumber = 'MRP' + year + numberArray[month] + date + Math.floor(Math.random() * 10000)
  }

  getwkttiba() {
    var TimeObj = new Date()
    var hours = ("0" + TimeObj.getHours()).slice(-2)
    var minutes = ("0" + TimeObj.getMinutes()).slice(-2)
    var sec = ("0" + TimeObj.getSeconds()).slice(-2)
    var unxtiba = TimeObj.getTime();

    this.unixTiba = unxtiba;
    this.unixKeluar = unxtiba;
    this.wkttiba = hours + ':' + minutes + ':' + sec;
  }

  cekForm(saldo) {
    if (this.nokav != '' && saldo >= this.tarifparkir) {
      this.scanCode(saldo);
    }
    else if (this.nokav == '' && saldo >= this.tarifparkir) {
      const toast = this.toastCtrl.create({
        message: 'Pilihan Kavling Belum Terisi',
        duration: 3000,
      });
      toast.present();
    } else if (this.nokav != '' && saldo < this.tarifparkir) {
      const toast = this.toastCtrl.create({
        message: 'Saldo Anda Belum Mencukupi',
        duration: 3000
      });
      toast.present();
    }
    else {
      const toast = this.toastCtrl.create({
        message: 'Kavling Belum Terisi dan Saldo Belum Mencukupi',
        duration: 3000
      });
      toast.present();
    }
  }

  statusKavling(text, saldo, status = 'Ready') {
    if (this.notoken == text && this.statRotasi == status) {
      const alert = this.alertCtrl.create({
        subTitle: 'Transaksi Berhasil',
        buttons: ['OK'],
        cssClass: 'alertBerhasil'
      });
      alert.present();
      this.bayarParkir(saldo);
      this.dismiss();
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

  scanCode(saldo) {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.qrScanner.show()
          window.document.querySelector('ion-app').classList.add('cameraView');
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
            window.document.querySelector('ion-app').classList.remove('cameraView');
            this.qrScanner.hide();
            this.statusKavling(text, saldo);
            scanSub.unsubscribe();
          });

        } else if (status.denied) {
          const toast = this.toastCtrl.create({
            message: 'camera permission was denied',
            duration: 3000
          });
          toast.present();
        } else {
          const toast = this.toastCtrl.create({
            message: 'You can ask for permission again at a later time.',
            duration: 3000
          });
          toast.present();
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  bayarParkir(saldouser) {
    var tarif = parseInt(this.tarifparkir)
    let saldousernow = saldouser - tarif;
    this.addTransaksi(saldousernow);
    this.Tools.PendapatanOrderParkir(tarif);
  }

  addTransaksi(saldousernow) {
    this.gettglDatang()
    this.getwkttiba()

    let newTransaksi = {
      UID: this.UID,
      NoTransaksi: this.randomNumber,
      TglDatang: this.tglDatang,
      TglKeluar: '',
      WktTiba: this.wkttiba,
      unixTiba: this.unixTiba,
      Wktkeluar: '',
      unixKeluar: this.unixKeluar,
      DurasiParkir: '',
      NoKen: this.detailprofil.nokendaraan,
      NoHP: this.detailprofil.nohp,
      NoToken: this.notoken,
      NoKavling: this.nokav,
      JenisTransaksi: 'Reguler',
      PetugasKonfirmasi: '',
      Status: 'Parked',
      BiayaParkir: this.tarifparkir,
      TotalBiaya: ''
    }

    let updateRotasi = {
      PosisiRotasi: this.nokav,
      StatusRotasi: 'Sedang Berotasi'
    }

    firebase.database().ref(`Transaksi/Keseluruhan/${this.randomNumber}`).set(newTransaksi)
    firebase.database().ref(`Transaksi/Konfirmasi/${this.randomNumber}`).set(newTransaksi)
    firebase.database().ref(`Transaksi/User/${this.UID}/${this.randomNumber}`).set(newTransaksi)
    firebase.database().ref(`Akun/Customer/${this.UID}/saldo`).set(saldousernow)
    firebase.database().ref('TokenParkir').update(updateRotasi)
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
