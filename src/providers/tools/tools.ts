import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { Pendapatan } from '../../environments/konfigmrp';

@Injectable()
export class ToolsProvider {
  pendapatandataRef: AngularFireObject<any>;
  pendapatandata: Observable<Pendapatan>;

  Total;
  constructor(private afDatabase: AngularFireDatabase) {
    this.loadPendapatan();
  }

  loadPendapatan() {
    this.pendapatandataRef = this.afDatabase.object(`Pendapatan/Deposit`)
    this.pendapatandata = this.pendapatandataRef.valueChanges();
    this.pendapatandata.subscribe(DP => {
      this.Total = DP.TotalDeposit;
    })
  }

  PendapatanOrderParkir(biayaAwal){
    let totalNow = this.Total + biayaAwal;
    firebase.database().ref(`Pendapatan/Deposit/TotalDeposit`).set(totalNow)
  }
  


}
