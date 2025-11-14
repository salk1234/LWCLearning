import { LightningElement,track } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';

const columns = [
    { label: 'Opportunity name', fieldName: 'opportunityName', type: 'text' },
    {
        label: 'Confidence',
        fieldName: 'confidence',
        type: 'percent',
        cellAttributes: {
            iconName: { fieldName: 'trendIcon' },
            iconPosition: 'right',
        },
    },
    {
        label: 'Amount',
        fieldName: 'amount',
        type: 'currency',
        typeAttributes: { currencyCode: 'EUR', step: '0.001' },
    },
    { label: 'Contact Email', fieldName: 'contact', type: 'email' },
    { label: 'Contact Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Checked', fieldName: 'isChecked', type: 'boolean' },
];

const data = [
    {
        id: 'a',
        opportunityName: 'Cloudhub',
        confidence: 0.2,
        amount: 25000,
        contact: 'jrogers@cloudhub.com',
        phone: '2352235235',
        trendIcon: 'utility:down',
        isChecked : true,
    },
    {
        id: 'b',
        opportunityName: 'Quip',
        confidence: 0.78,
        amount: 740000,
        contact: 'quipy@quip.com',
        phone: '2352235235',
        trendIcon: 'utility:up',
        isChecked : false,
    },
    
];
   
export default class ModalDemoInLWC extends LightningElement {
    @track isShowModal = true;

   isShowModal = true;
   data = data;
   columns = columns;
   selectedOpps =[];
    selectedAccounts= [];
    unselectedAccounts= [];
    isRecChecked =[];

   selectedAccountsJS(event) {
        this.selectedAccounts= [];
        this.unselectedAccounts= [];
        const selRows = [...event.detail.selectedRows];
        if(Array.isArray(selRows)){
            this.isRecChecked = selRows.filter(element => element.isChecked === false);
            this.selectedAccounts = selRows.map(element =>element.opportunityName);
        }
        /*if(Array.isArray(this.data)){
            this.data.forEach(element=>{
                if((!this.selectedAccounts.includes(element.opportunityName)) && (element.isDisabled === false) && (element.isChecked === true)){
                    this.unselectedAccounts.push(element.opportunityName);
                }
            });
        }*/
        console.log('Selected Acnt',this.selectedAccounts);
        console.log('recChecked Acnt', this.isRecChecked);
   }

   /* getSelectedName(event) {
        const selectedRows = event.detail.selectedRows;
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++) {
            this.selectedOpps.push(selectedRows[i].opportunityName);
            //alert('You selected: ' + selectedRows[i].opportunityName);
        }
        console.log("Selected Opps",this.selectedOpps);
    }

    selectedRowsJS(){
        this.selectedOpps.push(this.data.findIndex(row=> row.id ===event.detail.draftValues[0].id));
        console.log(this.selectedOpps);
    }

    handleSelectJs(){
        var selectedAccounts = this.template.querySelector("lightning-datatable").getSelectedRows();
        console.log(selectedAccounts.opportunityName);
    }*/



    closeModalHandler(){
            this.dispatchEvent(new CloseActionScreenEvent());
    }
}