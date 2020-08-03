import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserQrPage } from './user-qr';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [
    UserQrPage,
  ],
  imports: [
    IonicPageModule.forChild(UserQrPage),
    QRCodeModule,
  ],
})
export class UserQrPageModule {}
