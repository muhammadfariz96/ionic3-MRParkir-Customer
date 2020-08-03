import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { User } from '../../../environments/konfigmrp';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';



@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;
  profil = {
    fullname: '',
    nokendaraan: '',
    nohp: '',
    saldo: 0,
    TNKB:''
  };

  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController, public toastCtrl: ToastController) {
  }

  cekForm() {
    if (this.user.email !== '' && this.user.password !== '' && this.profil.fullname !== '' && this.profil.nohp !== '') {
      this.register(this.user);
    }
    else {
      const toast = this.toastCtrl.create({
        message: 'Data Belum Terisi',
        duration: 3000
      });
      toast.present();
    }
  }

  async register(user: User) {
    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
      this.afAuth.authState.take(1).subscribe(auth => {
        this.afDatabase.object(`Akun/Customer/${auth.uid}`).set(this.profil).then(() => {
          const alert = this.alertCtrl.create({
            subTitle: 'Registrasi Berhasil',
            buttons: ['OK'],
            cssClass: 'alertBerhasil'
          });
          alert.present();
        });
      });
    }
    catch (e) {
      const toast = this.toastCtrl.create({
        message: `${e}`,
        duration: 3000
      });
      toast.present();
    }
  }

}
