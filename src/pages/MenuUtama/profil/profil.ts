import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { Profile } from '../../../environments/konfigmrp';
import { Camera, CameraOptions } from '@ionic-native/camera';


@IonicPage()
@Component({
  selector: 'page-profil',
  templateUrl: 'profil.html',
})
export class ProfilPage {
  profildataRef: AngularFireObject<any>;
  profildata: Observable<Profile>;
  UID;
  profil = {
    fullname: '',
    nokendaraan: '',
    nohp: '',
    saldo: 0,
    TNKB:''
  };

  constructor(private camera: Camera,
    private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController) {
    this.loadProfil()
  }

  loadProfil() {
    this.afAuth.authState.take(1).subscribe(data => {
      this.profildataRef = this.afDatabase.object(`Akun/Customer/${data.uid}`)
      this.profildata = this.profildataRef.valueChanges();
      this.profildata.subscribe(res => {
        this.UID = data.uid;
        this.profil = res;
      })
    });
  }

  async editTNKB(TNKB) {
    const prompt = this.alertCtrl.create({
      title: 'Edit No Kendaraan',
      inputs: [
        {
          name: 'NoKen',
          value: `${TNKB}`
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.takeTNKB(data.NoKen);
          }
        }
      ],
      cssClass: 'alertBerhasil'
    });
    prompt.present();
  }

  async takeTNKB(NoKen) {
    try {
      const options: CameraOptions = {
        quality: 100,
        targetHeight: 400,
        targetWidth: 600,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.CAMERA,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE

      }
      const result = await this.camera.getPicture(options);
      const image = `data:image/jpeg;base64,${result}`;
      const pictures = firebase.storage().ref(`Customer/${this.UID}/TNKB.jpg`);
      pictures.putString(image, 'data_url').then((sukses) => {
        pictures.getDownloadURL().then(url => {
          firebase.database().ref(`Akun/Customer/${this.UID}/TNKB`).set(url);
          firebase.database().ref(`Akun/Customer/${this.UID}/`).update({nokendaraan: NoKen});
        })

      })
    }
    catch (e) {
      console.error(e);
    }
  }

  openChangePass() {
    this.navCtrl.push('ChangePasswordPage');
  }

  showUserQR(UserQR: any) {
    let detailQR = JSON.stringify(UserQR)
    this.navCtrl.push('UserQrPage', { detailQR });
  }

  showImage(image){
    let url = JSON.stringify(image)
    this.navCtrl.push('ShowImagePage', { url });
    console.log(url)
  }

  async signOut() {
    this.afAuth.auth.signOut().then(res => {
      this.navCtrl.parent.parent.setRoot('LoginPage');
    });
  }

}
