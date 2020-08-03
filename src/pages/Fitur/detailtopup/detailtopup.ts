import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-detailtopup',
  templateUrl: 'detailtopup.html',
})
export class DetailtopupPage {

  notopup:any;
  detailtopup:any;
  tabBarElement: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.load()
  }

  load(){
    this.notopup = this.navParams.get('detailtop');
    this.detailtopup = JSON.parse(this.notopup);
    
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar')
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

}
