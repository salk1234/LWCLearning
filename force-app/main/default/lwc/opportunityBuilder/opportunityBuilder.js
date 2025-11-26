import { LightningElement,wire } from 'lwc';
import {getRecord} from 'lightning/uiRecordApi';
import {getPicklistValues,getObjectInfo} from 'lightning/uiObjectInfoApi';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';

export default class OpportunityBuilder extends LightningElement {
    displayOpportunity;
    defaultRecordTypeId;
    stageOptions;
    account;
    selectedAcnt;
    displayProducts;
    opportunityName;
    closeDate;
    stageValue;
    amount;

     matchingInfo={
        primaryField:{fieldPath:'Name',mode:'contains'},
        additionalFields:[{fieldPath:'Phone'}],
    }

    displayInfo ={
        primaryField:'Name',
        additionalFields:['Industry'],
    };

    selectedAcntJs(evt){
        this.selectedAcnt = evt.detail.recordId;
        this.displayOpportunity = true;
        console.log('Selected Account Id>>',this.selectedAcnt);
    }

    @wire(getRecord,{recordId:'$selectedAcnt',fields:[NAME_FIELD]})
    accountInfo({data,error}){
        console.log('At line 30>>');
        if(data){
            this.account=data;
            console.log('this.account>>',this.account);
            this.opportunityName = this.account?.fields?.Name?.value + '-' + new Date().getFullYear();
        }
        else if(error){
            console.error('Error in fetching account data',error);
        }
    }

    @wire(getObjectInfo,{objectApiName:'Opportunity'})
    opportunityObjectInfo({data,error}){
        if(data){
            this.defaultRecordTypeId=data.defaultRecordTypeId;
            console.log('Default Record Type Id>>',this.defaultRecordTypeId);
        }else if(error){
            console.error('Error in fetching object info',error);
        }
    }

    @wire(getPicklistValues,{recordTypeId:'$defaultRecordTypeId',fieldApiName:STAGE_FIELD})
    stagePicklistValues({data,error}){
        if(data){
            this.stageOptions=data.values;
            console.log('this.stageOptions>>',this.stageOptions);
        }
        else if(error){
            console.error('Error in fetching picklist values',error);
        }
    }

    /*get opportunityName(){
        return this.account?.fields?.Name?.value+'-'+new Date().getFullYear();
    }*/

    get options() {
        return this.stageOptions
            .filter(record => record.label !== 'Closed Won' && record.label !== 'Closed Lost')
            .map(record => ({
                label: record.label,
                value: record.value
            }));
    }

    handleChange(event){
        try{
            console.log('onchange event>>',event.target.name, event.target.value);
        }catch(err){
            console.error('Error in onchange handler>>',err);   
        }
    }


    /*handleChange(event){
        console.log('onchange event>>',event.target.name, event.target.value);
        if(event.target.name === 'CloseDate'){
            this.closeDate = event.target.value;
        }
        else if(event.target.name === 'Stage'){
            this.stageValue = event.target.value;
        }
        else if(event.target.name === 'Amount'){
            this.amount = event.target.amount;
        }
        else if(event.target.name === 'OppoName'){
            this.opportunityName = event.target.value;
        }

        const evt = new CustomEvent('change',{
            detail:{
                closeDate:this.closeDate,
                stageName:this.stageValue,
                amount:this.amount,
                oppoName:this.opportunityName,
                selectedAcntId:this.selectedAcnt
            }
        });
        this.dispatchEvent(evt);
    }  */

    handleClose(){
        console.log('Close event from child');
        const evt = new CustomEvent('close',{
            detail:{
                message:'modal closed'
    }});
        this.dispatchEvent(evt);
    }  

}