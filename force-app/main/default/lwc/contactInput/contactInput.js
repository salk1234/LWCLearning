import { LightningElement } from 'lwc';
export default class ContactInput extends LightningElement {
    contactValue;

    handleChangeEvent(event){
        this.contactValue = event.target.value;
    }

    handleClick(){
        const selectedEvent = new CustomEvent
        ('show',
         {detail:
          {'message':this.contactValue}
        });
        this.dispatchEvent(selectedEvent);
    }


}