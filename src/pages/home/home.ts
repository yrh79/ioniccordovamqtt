import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StorageServiceProvider, Config } from '../../providers/storage-service/storage-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mqttserver;
  mqttport;
  username;
  password;

  config: Config;

  constructor(public navCtrl: NavController, private storageProvider: StorageServiceProvider ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.storageProvider.getConfig().then((config) => {
      this.config = config;
      this.mqttserver = this.config.mqttserver;
      this.mqttport = this.config.mqttport;
      this.username = this.config.username;
      this.password = this.config.password;
    }
    );
  }

  onConnect() {
    this.storageProvider.saveConfig(this.mqttserver, this.mqttport, this.username, this.password);
    this.navCtrl.push("SendmsgPage");
  }

}
