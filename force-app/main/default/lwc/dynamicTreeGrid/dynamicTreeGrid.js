import { LightningElement,wire } from 'lwc';
import getContacts from '@salesforce/apex/DynamicTreeGrid.getNewContactsForAccounts';
import getAdditionalContacts from '@salesforce/apex/DynamicTreeGrid.getAdditionalContacts';
const actions = [
    { label: 'View More Record', name: 'view_record' }
];

const COLUMNS =[
    {label:'Account Name',fieldName:'Name',type:'text'},
    {
        type: "action",
        label: "View Record",
        typeAttributes: {
        rowActions: actions,
        menuAlignment: "right",
        },
    }
]

export default class DynamicTreeGrid extends LightningElement {
    data=[];
    cols=COLUMNS;
    expandedRows =[];
    offset=0;


    @wire(getContacts)
    wiredContacts({data,error}){
        if(error){
            console.error('Error in fetching contacts>>',error);
        }else if(data){
            var strData = JSON.parse(JSON.stringify(data));
            this.data = strData.map(account=>{
                return {
                    ...account,
                    _children: account.Contacts
                }
            });
            this.offset=10;
            console.log('Data>>',this.data);
        }
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        switch (action.name) {
        case "view_record":
            console.log('row>>',row);
            this.fetchAdditionalRecords(row.Id, this.offset);
            break;
        }
    }
    fetchAdditionalRecords(accountId, offset){
        getAdditionalContacts({acntId:accountId, offsetVal:offset})
        .then(result=>{
            console.log('Additional Records>>',result);
            if(result.length === 0){
                alert('No more records to display');
                return;
            }
            const additionalContacts = JSON.parse(JSON.stringify(result));
            const accountIndex = this.data.findIndex(accountId);
            if(accountIndex !== -1){
                this.data[accountIndex]._children = [...this.data[accountIndex]._children,...additionalContacts];
                this.data = [...this.data];
                this.offset +=10;
            }
        })
        .catch(error=>{
            console.error('Error in fetching additional records>>',error);
        })
    }

    handleRowToggle(event){
        const currentRow = event.detail.name;
        console.log('Toggled Row>>',event.detail);
        if(event.detail.isExpanded){
            this.expandedRows = [currentRow];
        }else{
            this.expandedRows = [];
        }
    }

    get currentExpandedStr(){
        const grid = this.template.querySelector('lightning-tree-grid');
        return grid?.getCurrentExpanded().toString??[];
    }
}