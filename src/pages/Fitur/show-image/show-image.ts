import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Brightness } from '@ionic-native/brightness';

/**
 * Generated class for the ShowImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-image',
  templateUrl: 'show-image.html',
})
export class ShowImagePage {
  tabBarElement: any;
  urlImage;
  Image;


  constructor(private brightness: Brightness, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.load()
  }
  load() {
    this.urlImage = this.navParams.get('url');
    this.Image = JSON.parse(this.urlImage);
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
