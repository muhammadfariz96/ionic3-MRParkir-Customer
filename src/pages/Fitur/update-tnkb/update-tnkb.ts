import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { TabsPage } from '../../MenuUtama/tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-update-tnkb',
  templateUrl: 'update-tnkb.html',
})
export class UpdateTnkbPage {

  aksi = 'lihat';
  customer;
  nokendaraan = '';
  picurl;

  constructor(private camera: Camera, public toastCtrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.loadCustomer()
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 2000
    });
    loader.present();
  }

  cekTNKB() {
    if (this.aksi == 'lihat' && this.nokendaraan != '') {
      this.aksi = '';
      this.takeTNKB();
    }
    else {
      const toast = this.toastCtrl.create({
        message: 'Data Belum Terisi',
        duration: 3000
      });
      toast.present();
    }
  }

  ulang() {
    this.picurl = ''
  }

  loadCustomer() {
    this.customer = firebase.auth().currentUser;
  }

  async takeTNKB() {
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
      const pictures = firebase.storage().ref(`Customer/${this.customer.uid}/TNKB.jpg`);
      pictures.putString(image, 'data_url').then((sukses) => {
        pictures.getDownloadURL().then(url => {
          this.presentLoading();
          this.picurl = url;
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

  simpanTNKB() {
    this.customer.updateProfile({
      displayName: "Customer"
    })
    let update = {
      nokendaraan: this.nokendaraan,
      TNKB: this.picurl
    }
    firebase.database().ref(`Akun/Customer/${this.customer.uid}/`).update(update);
    this.navCtrl.setRoot(TabsPage);
  }

}
