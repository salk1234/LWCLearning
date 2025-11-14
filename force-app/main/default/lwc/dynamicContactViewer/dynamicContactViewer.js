import { LightningElement, wire,api } from 'lwc';
import getAccounts from '@salesforce/apex/dynamicContactViewerCntrl.getAccounts';
import getContacts from '@salesforce/apex/dynamicContactViewerCntrl.getContacts';
import { updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import { refreshApex } from "@salesforce/apex";

import FNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LNAME_FIELD from '@salesforce/schema/Contact.LastName';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

import CONTACT_OBJECT from '@salesforce/schema/Contact';
const columns = [
    { label: 'First Name', fieldName: 'FirstName',editable:true },
    { label: 'Last Name', fieldName: 'LastName',editable:true},
    { label: 'Phone', fieldName: 'Phone', type: 'phone',editable:true},
    { label: 'Email', fieldName: 'Email', type: 'email',editable:true},
];

export default class DynamicContactViewer extends LightningElement {
    selectedAcnt='';
    data=[];
    columns=columns;
    fields = [FNAME_FIELD,LNAME_FIELD,PHONE_FIELD,EMAIL_FIELD];
    objectApiName = CONTACT_OBJECT;
    isLoading=false;
    options=[];
    draftValues=[];
    wiredContactResult =[];
    accountInfo;
    displayModal;
    

    @wire(getAccounts)
    wiredInfo({error,data}){
        if(data){
            this.accountList= data;
            this.options = data.map(record=>{
                return{label:record.Name,
                        value:record.Id
                };                
            });
        } else if(error){
            console.error('Error fetching Accounts>>',error);
        }
    }

    get displayDatatable(){
        return this.data.length>0;
    }
    get displayMessage(){
        return this.data.length===0 && this.selectedAcnt !=='';
    }
    get displayAccountInfo(){
        return this.accountInfo;
    }

    handleChange(event){
        this.selectedAcnt = event.detail.value;
        if(this.selectedAcnt){
            //this.getAccountsJs();
            this.accountInfo = this.accountList.find(acc=>acc.Id===this.selectedAcnt);
            this.getContactsJS(this.selectedAcnt);
        }
    }
    /*getAccountsJs(){
        this.isLoading=true;
        getAccounts({acntId:this.selectedAcnt})
        .then(result=>{
            console.log('result',result);
            this.accountInfo = result[0];
        })
        .catch(error=>{
            console.error('Error while fetching the Account details:',error);
        })
    }*/

    getContactsJS(selectedAcnt){
        this.isLoading=true;
        getContacts({acntId:selectedAcnt})
        .then(result=>{
            this.isLoading=false;
            this.data=result;
        })
        .catch(error=>{
            this.isLoading=false;
            console.error('Exception while trying to fetch the contact records',error);
        })
    }
    /*@wire(getContacts,{acntId:'$selectedAcnt'})
    wiredResult({result}){
        this.isLoading=true;
        this.wiredContactResult = result;
        if(result.data){
            this.isLoading=false;
            this.data = result.data;
        }else if(result.error){
            console.error('Exception while trying to fetch the contact records',error);
        }
    }*/
    async handleSave(event){
        this.isLoading=true;
        const records = event.detail.draftValues.slice().map((draftValue)=>{
            const fields = Object.assign({},draftValue);
            return {fields};
        });
        this.draftValues =[];
       try{
            const recordUpdatePromises = records.map((record)=> updateRecord(record));
            await Promise.all(recordUpdatePromises);
            this.isLoading =false;
            this.dispatchEvent(
                new ShowToastEvent({
                    title :"Success",
                    message :"Contacts updated",
                    variant :"success"
                })
            );
            this.getContactsJS(this.selectedAcnt);
        }
        catch(error){
           this.dispatchEvent(
            new ShowToastEvent({
                title : "Error updating or reloading contacts",
                message : error.body.message,
                variant : "error"
            })
           );
        }
    }
    handleClick(){
        this.displayModal=true;
    }
    handleClose(){
        this.displayModal=false;
    }
    handleSubmit(event){
        console.log('this.selectedAcnt',this.selectedAcnt);
        event.preventDefault();
        const fields=event.detail.fields;
        console.log('fields>',fields);
        fields.AccountId= this.selectedAcnt;
        this.template.querySelector('lightning-record-form').submit(fields);
    }
    handleSuccess(event){
        this.displayModal=false;
        this.getContactsJS(this.selectedAcnt);
        const evt = new ShowToastEvent({
            title:'Contact created',
            message:'Record Id:'+event.detail.id,
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }
    handleError(event){
        this.displayModal=false;
        console.log('event>>',event);
        const evt = new ShowToastEvent({
            title:'Error',
            message:event.detail.message,
            variant:'error'
        });
        this.dispatchEvent(evt);
    }

}