import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QRcodePage } from './q-rcode';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [
    QRcodePage,
  ],
  imports: [
    IonicPageModule.forChild(QRcodePage),
    QRCodeModule,
  ],
})
export class QRcodePageModule {}
