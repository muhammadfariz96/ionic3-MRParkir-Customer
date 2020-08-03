import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import { FIREBASE_CONFIG } from '../environments/firebasebackend';
import { TabsPage } from '../pages/MenuUtama/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    firebase.initializeApp(FIREBASE_CONFIG);
    firebase.auth().onAuthStateChanged(user => {
      if (user != null && user.displayName == 'Customer') {
        this.rootPage = TabsPage
      }
      else if (user != null && user.displayName == 'Petugas'){
        this.rootPage = 'LoginPage'
      }
      else if (user != null && user.displayName == null){
        this.rootPage = 'UpdateTnkbPage'
      }
      else if (user == null){
        this.rootPage = 'LoginPage'
      }
    })

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
