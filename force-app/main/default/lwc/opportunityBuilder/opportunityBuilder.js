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
    opportunityName =''
    closeDate='';
    stageValue='';
    amount='';

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
            if(!this.opportunityName){
                this.opportunityName = this.account?.fields?.Name?.value + '-' + new Date().getFullYear();
            }
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


    get options() {
        return this.stageOptions
            .filter(record => record.label !== 'Closed Won' && record.label !== 'Closed Lost')
            .map(record => ({
                label: record.label,
                value: record.value
            }));
    }

    handleChange(event){
        this[event.target.name] = event.target.value;
        if(this.closeDate && this.stageValue && this.amount && this.opportunityName && this.selectedAcnt){
            const complEvt = new CustomEvent('update',{
                detail:{
                    closeDate:this.closeDate,
                    stageName:this.stageValue,
                    amount:this.amount,
                    oppoName:this.opportunityName,
                    selectedAcntId:this.selectedAcnt
                }
            });
            this.dispatchEvent(complEvt);
        }
    } 
}