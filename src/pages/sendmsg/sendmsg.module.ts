import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendmsgPage } from './sendmsg';

@NgModule({
  declarations: [
    SendmsgPage,
  ],
  imports: [
    IonicPageModule.forChild(SendmsgPage),
  ],
})
export class SendmsgPageModule {}
