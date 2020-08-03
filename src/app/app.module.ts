import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HistoryPage } from '../pages/MenuUtama/history/history';
import { HomePage } from '../pages/MenuUtama/home/home';
import { TabsPage } from '../pages/MenuUtama/tabs/tabs';
import { ProfilPage } from '../pages/MenuUtama/profil/profil';

import { QRScanner } from '@ionic-native/qr-scanner';
import { Brightness } from '@ionic-native/brightness';
import { Camera } from '@ionic-native/camera';

import { FIREBASE_CONFIG } from '../environments/firebasebackend';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ToolsProvider } from '../providers/tools/tools';


@NgModule({
  declarations: [
    MyApp,
    HistoryPage,
    ProfilPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HistoryPage,
    ProfilPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    QRScanner,
    Brightness,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ToolsProvider
  ]
})
export class AppModule {}
