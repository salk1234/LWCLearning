import { LightningElement } from 'lwc';
export default class ContactManager extends LightningElement {
    contactName='';

    get displayName(){
        return this.contactName != '';
    }
    
    showContactEvent(event){
        console.log('evt>>',event.detail.message);
        this.contactName = event.detail.message;
    }

}