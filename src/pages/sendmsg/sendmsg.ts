import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { StorageServiceProvider, Config } from '../../providers/storage-service/storage-service';

declare var cordova;

/**
 * Generated class for the SendmsgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sendmsg',
  templateUrl: 'sendmsg.html',
})
export class SendmsgPage {

  topic;
  message;

  mqttserver;
  mqttport;
  username;
  password;

  config: Config;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storageProvider: StorageServiceProvider,
    public plt: Platform) {
    this.plt.resume.subscribe((event) => console.log(JSON.stringify(event)));
  }


  //TODO: make the mqtt connect be inside a service (provider)
  // such that methods in it could be called in multiple plases. e.g. ViewDidLoad/resume/pause

  connectServer() {
    //connect to server
    cordova.plugins.CordovaMqTTPlugin.connect({
      url: "tcp://" + this.mqttserver, //a public broker used for testing purposes only. Try using a self hosted broker for production.
      port: this.mqttport,
      clientId: "jame_clientid_abc",
      connectionTimeout: 3000,
      username: this.username,
      password: this.password,
      keepAlive: 60,
      success: this.onConnectSuccess,
      error: function (e) {
        console.log("connect error");
      },
      onConnectionLost: function () {
        console.log("disconnect");
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendmsgPage');
    this.storageProvider.getConfig().then((config) => {
      this.config = config;
      this.mqttserver = this.config.mqttserver;
      this.mqttport = this.config.mqttport;
      this.username = this.config.username;
      this.password = this.config.password;

      this.topic = "/wifiSwitch/jame/led";
    }
    );
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter()");
  }

  onConnectSuccess(s) {
    console.log("connect success");

    cordova.plugins.CordovaMqTTPlugin.subscribe({
      topic: "/wifiSwitch/" + this.username + "/#",
      qos: 0,
      success: function (s) {
        console.log("subscribe success!");
      },
      error: function (e) {
        console.log("subscribe failed!");
      }
    });

    // "/topic/+singlewc/#multiwc"  ===>

    //Callback:- (If the user has published to /topic/room/hall)
    //payload : contains payload data
    //params : {singlewc:room,multiwc:hall}

    //Declare this function in any scope to access the router function "on" to receive the payload for certain topic
    cordova.plugins.CordovaMqTTPlugin.listen("/wifiSwitch/" + this.username + "/#devdetail", function (payload, params) {
      //Callback:- (If the user has published to /topic/room/hall)
      //payload : contains payload data
      //params : {singlewc:room,multiwc:hall}
      console.log(JSON.stringify(params) + ": " + payload)
    });

    //below callbacks never get hit:

    //Declare this function in any scope to access the router function "on" to receive the payload for certain topic
    cordova.plugins.CordovaMqTTPlugin.router.on("/wifiSwitch/" + this.username + "/led1", function (payload, params) {
      //Callback:- (If the user has published to /topic/room/hall)
      //payload : contains payload data
      //params : {singlewc:room,multiwc:hall}
      console.log("router:" + JSON.stringify(params) + ": " + payload)
    });

    // //To get a callback on topic subscribe/unsubscribe event, you can listen by this method
    // cordova.plugins.CordovaMqTTPlugin.router.onadd(function (topic) {
    //   console.log("onadd: " + topic);
    // });
    // cordova.plugins.CordovaMqTTPlugin.router.onremove(function (topic) {
    //   console.log("onremove: " + topic);
    // });
  }


  onSendMsg() {
    console.log("send msg!");
    // console.log(JSON.stringify(this.config));

    cordova.plugins.CordovaMqTTPlugin.publish({
      topic: this.topic,
      payload: this.message,
      qos: 0,
      retain: false,
      success: function (s) {
        console.log("send success!");
      },
      error: function (e) {
        console.log("send error!");
      }
    })
  }

}
