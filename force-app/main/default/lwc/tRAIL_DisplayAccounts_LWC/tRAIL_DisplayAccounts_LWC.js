import { LightningElement } from 'lwc';
import fetchAccounts from '@salesforce/apex/Trail_DisplayAccounts_LWC.getAccountInfo';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
const columns=[
    {label:'Name', fieldName:'Name'},
    {label:'Website',fieldName:'website', type:'url'},
];
export default class TRAIL_DisplayAccounts_LWC extends LightningElement {
    searchText;
    data ='';
    cols = columns;

    get display_btn(){
        return !this.searchText;
    } 

    get display_data(){
        return this.data;
    }

    handleChange(event){
        this.searchText = event.target.value;
    }

    handleClick(){
       if(this.searchText){
            fetchAccounts({searchTerm:this.searchText})
                .then(result=>{
                    if(result){
                        this.data = result;
                    }
                    else{
                        this.data = '';
                        console.error('Exception at apex method');
                    }
                })
                .catch(error=>{
                    console.error('Exception at calling the fetchAccounts apex method');
                    this.dispatchEvent(new ShowToastEvent({
                        title : 'Error',
                        message : error.body.message,
                        variant : 'error'
                    }));
                })
        }
        else{
            console.log('At line 31');
        }
    }
}