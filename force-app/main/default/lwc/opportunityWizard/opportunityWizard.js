import { LightningElement,wire,api } from 'lwc';

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
}   