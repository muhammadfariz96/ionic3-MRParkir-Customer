import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ViewController } from 'ionic-angular';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  tabBarElement: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController, public toastCtrl: ToastController, public viewCtrl: ViewController) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar')
  }

  changePass(email) {
    firebase.auth().sendPasswordResetEmail(email).then(() => {
      const alert = this.alertCtrl.create({
        subTitle: 'Email Telah Terkirim',
        buttons: ['OK'],
        cssClass: 'alertBerhasil'
      });
      alert.present();
      this.dismiss();
    }).catch(function(e) {
      const toast = this.toastCtrl.create({
        message: `${e}`,
        duration: 3000
      })
      toast.present()
    });
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


}
