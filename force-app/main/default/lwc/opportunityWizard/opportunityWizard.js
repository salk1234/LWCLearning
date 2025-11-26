import { LightningElement,wire,api } from 'lwc';

export default class OpportunityWizard extends LightningElement {
    displayOppoPage=true;;
    oppoName;
    selectAcntId;
    closeDate;
    Stage;
    Amount;
    stepDetails;
    errorValidation=false;
    
    handleClick() {
        this.stepDetails ='1'
        this.displayOppoPage=true;    
        console.log('this.modal>>',this.displayOppoPage);    
    }
    get disableNext(){
        return !(this.selectAcntId && this.closeDate && this.Stage && this.Amount && this.oppoName);
    }
    nextPage1(){
       console.log('Next Page clicked');
       this.displayOppoPage=false;
    }
}   