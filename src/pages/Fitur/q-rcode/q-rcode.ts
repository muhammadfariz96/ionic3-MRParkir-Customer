import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Brightness } from '@ionic-native/brightness';
/**
 * Generated class for the QRcodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-q-rcode',
  templateUrl: 'q-rcode.html',
})
export class QRcodePage {

  notransaksi: any;
  QRData: string;
  tabBarElement: any;
  default;

  constructor(private brightness: Brightness, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.load()
  }

  load(){
    this.notransaksi = this.navParams.get('detailQR');
    this.QRData = JSON.parse(this.notransaksi);
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
    let brightnessValue = 1;
    this.brightness.setBrightness(brightnessValue);
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
    let brightnessValue = 0;
    this.brightness.setBrightness(brightnessValue);
  }



}
