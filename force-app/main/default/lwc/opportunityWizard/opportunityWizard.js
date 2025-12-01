import { LightningElement,wire,api } from 'lwc';

export default class OpportunityWizard extends LightningElement {
    displayOppoPage=true;;
    oppoName;
    selectAcntId;
    closeDate;
    Stage;
    Amount;
    stepDetails="1";
    errorValidation=false;
    displayProdPage=false;
    
    /*handleClick() {
        this.stepDetails ='1'
        this.displayOppoPage=true;    
        console.log('this.modal>>',this.displayOppoPage);    
    }*/
    get disableNext(){
        console.log('In disable next>>',this.selectAcntId,this.closeDate,this.Stage,this.Amount,this.oppoName);
        return !(this.selectAcntId && this.closeDate && this.Stage && this.Amount && this.oppoName);
    }
    nextPage1(){
       this.displayOppoPage=false;
       this.stepDetails="2";
       this.displayProdPage=true;
    } 
    handleChange(event){
        console.log('Event>',event.detail);
        this.closeDate = event.detail.closeDate;
        this.Stage = event.detail.stageName;
        this.Amount = event.detail.amount;
        this.oppoName = event.detail.oppoName;
        this.selectAcntId = event.detail.selectedAcntId;
    }
}   