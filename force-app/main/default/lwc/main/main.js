import { LightningElement } from 'lwc';
//import modal from './modal'; 

export default class Main extends LightningElement {
  isModalOpen = false;
  flowApiName = 'GPO_Connect_Case_Creation'; // Replace with your flow API name

  handleClick() {
    this.isModalOpen = true;
    console.log('modal called');
  }
}