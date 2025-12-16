import { LightningElement,wire,api } from 'lwc';
import createOpportunityRecords from '@salesforce/apex/OpportunityWizardCtrl.createOpportunityRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


const COLUMNS =[
    {label:'Product Name',fieldName:'ProductName',type:'text'},
    {label:'Quantity',fieldName:'Quantity',type:'number'},
    {label:'Sales Price',fieldName:'UnitPrice',type:'currency'},
    {label:'Discount',fieldName:'Discount',type:'date'},
    {label:'Line Total',fieldName:'LineTotal',type:'text'}
]

export default class OpportunityWizard extends LightningElement {
    prdCount=0;

    displayOppoPage=true;;
    oppoName;
    selectAcntId;
    closeDate;
    Stage;
    Amount;
    stepDetails="1";
    errorValidation=false;
    displayProdPage=false;
    selectedProdIds;
    priceBookEntries=[];
    enableNext3=false;
    displayDetails=false;
    COLS = COLUMNS;
    totalAmount;
    nxtLabelName = 'Next';
    
 
    get disableNext(){
        if(this.stepDetails==="1"){
            return !(this.selectAcntId && this.closeDate && this.Stage && this.Amount && this.oppoName);  
        }
        if(this.stepDetails==="2"){
            /* const child = this.template.querySelector('c-product-selection');
            this.prdCount = child?.count??0; */
            return this.prdCount == 0;
            // return this.template.querySelector('c-product-selection')?.count??0;
        }
        if(this.stepDetails==="3"){
            return !this.enableNext3;
        }
    }
    nextPage1(){
       this.displayOppoPage=false;
       this.stepDetails="2";
       this.displayProdPage=true;
       if(this.stepDetails==="2" && this.prdCount>0 ){
            this.stepDetails="3";
           this.displayProdPage=false;
           this.displaySelectedProd=true;
       }
       if(this.stepDetails==="3" && this.enableNext3){
            this.stepDetails="4";
            this.nxtLabelName ="Save"
            this.displaySelectedProd=false;
            this.displayDetails=true;
        }
        if(this.stepDetails === "4"){
            this.createOpportunityJs();
        }
    } 
    createOpportunityJs(){
        const oppo = {
            Name : this.oppoName,
            StageName : this.Stage,
            Amount : this.Amount,
            CloseDate : this.closeDate,
            AccountId : this.selectAcntId
        }
        const OppoLineItems = (this.priceBookEntries|| []).map(row=>({
            PricebookEntryId : row.Id,
            Discount: row.Discount,
            UnitPrice : row.UnitPrice,
            Quantity : row.Quantity,
        }));
        console.log('this.OppoLineItems>>',OppoLineItems);
        createOpportunityRecords({oppo:oppo, lineItem:OppoLineItems})
        .then(result=>{
            if(result === true){
                const evt = new ShowToastEvent({
                    title:'Opportunity Created',
                    message :'Opportunity and Opportunity Line Item created successfully.',
                    variant: 'success'
                });
                this.dispatchEvent(evt);
            }
            else if(result === false){
                const evt = new ShowToastEvent({
                    title:'Error',
                    message : 'Opportunity and LineItem record creation failed.',
                    variant :'error'
                });
                this.dispatchEvent(evt);
            }
        })
        .catch(error=>{
            console.log('Error while calling the createOpportunityJs>>',error);
        })

    }
    handleChange(event){
        console.log('Event>',event.detail);
        this.closeDate = event.detail.closeDate;
        this.Stage = event.detail.stageName;
        this.Amount = event.detail.amount;
        this.oppoName = event.detail.oppoName;
        this.selectAcntId = event.detail.selectedAcntId;
    }
    updatePrdCnt(event){
        this.prdCount = event.detail.count;
        this.selectedProdIds = event.detail.selectedRows;
    }
    updatedPriceEntry(event){
        this.enableNext3 = event.detail.message;
        this.priceBookEntries = event.detail.priceBookData;
        this.totalAmount = event.detail.totalAmount;
    }


}   