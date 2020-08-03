import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../../environments/konfigmrp';
import { AngularFireAuth } from 'angularfire2/auth';
import { TabsPage } from '../../MenuUtama/tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(private afAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  async login(user: User) {
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      if (result) {
        if (this.afAuth.auth.currentUser.displayName == 'Customer') {
          this.navCtrl.setRoot(TabsPage);
        }else if (this.afAuth.auth.currentUser.displayName == null) {
          this.navCtrl.setRoot('UpdateTnkbPage');
        }else if (this.afAuth.auth.currentUser.displayName == 'Petugas'){
          const alert = this.alertCtrl.create({
            subTitle: 'Khusus Akun Customer',
            buttons: ['OK'],
            cssClass: 'alertGagal'
          });
          alert.present();
        }
      }
    }
    catch (e) {
      const alert = this.alertCtrl.create({
        message: `${e}`,
        buttons: ['OK'],
        cssClass: 'alertGagal'
      });
      alert.present();
    }
  }

  register() {
    this.navCtrl.push('RegisterPage');
  }

}
