import { LightningElement,track, api } from 'lwc';
import searchTemplates from '@salesforce/apex/AddFilesApex.searchTemplates';
import getContacts from '@salesforce/apex/AddFilesApex.getContacts';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Account Number', fieldName: 'AccountNumber'},
    { label: 'Billing Address', fieldName: 'BillingAddress'},
];

const cols =[
    {label : 'First Name', fieldName :'FirstName'},
    {label : 'Last Name', fieldName : 'LastName'},
    {label : 'Email', fieldName : 'Email'}
]
export default class FindAccount extends LightningElement {

    @api displayContact = false;
    @api selectedAcnt =[];
    @api selectedCon =[];

    @api name1;
    @api name2;
    @api emailapi;

    cols = cols;
    columns = columns;
    accountData =[];
    accounts =[];
    isData = false;
    isConData = false;
    contactData =[];
    contact =[];
    isContactCreatedChecked = false;
    FirstName;
    LastName;
    Email;


    handleChange(event){
        this[event.target.name] = event.target.value;
        if(event.target.name == 'FirstName'){
        this.name1 = event.target.value;
        }
        else if(event.target.name == 'LastName'){
            this.name2 = event.target.value;
        }
        else{
            this.emailapi = event.target.value;
        }
    }
    
    searchAccountJS(){
        let searchText = this.template.querySelector('lightning-input').value;
        searchTemplates({
                searchText: searchText
            })
            .then(result=>{
                if(result && result.length ===0){
                    this.isData = false;
                }
                else{
                    this.isData = true;
                    result.forEach(record =>{
                        this.accountData.push({
                            'Name' :record.Name,
                            'Account Number' :record.AccountNumber,
                            'Billing Address' :record.BillingAddress,
                            'AcntId':record.Id
                        });
                    })
                }
                this.accounts = this.accountData;
                console.log('this.accounts',this.accounts);
            })
    }

    handleAcntSelection(event) {
        this.selectedAcnt = [];
        
        if (Array.isArray(event.detail.selectedRows) && event.detail.selectedRows.length > 0) 
        {
            this.selectedAcnt = event.detail.selectedRows.map(e => e.AcntId);
            this.displayContact = true;
        }

        if(this.selectedAcnt.length>0 && this.displayContact === true){
            console.log('Inside line 64');
            let acntId1 = this.selectedAcnt[0];
            this.displayContactJs(acntId1);
        }
    }

    displayContactJs(acntId){
        this.contactData = []; 
        getContacts({
            accountId : acntId
        }).then(result =>{
            console.log('Apex result:', result);
            if(result && result.length === 0){
                this.isConData = false;
            }
            else{
                result.forEach(record =>{
                    this.isConData = true;
                        this.contactData.push({
                            'First Name' :record.FirstName,
                            'Last Name' :record.LastName,
                            'ConId' :record.Id,
                            'AcntId':record.AccountId,
                            'Email':record.Email
                        });
                });
            }
            this.contact = this.contactData;
        })
    }
     handleAcntSelection(event) {
        this.selectedAcnt = [];
        
        if (Array.isArray(event.detail.selectedRows) && event.detail.selectedRows.length > 0) 
        {
            this.selectedAcnt = event.detail.selectedRows.map(e => e.AcntId);
            this.displayContact = true;
        }

        if(this.selectedAcnt.length>0 && this.displayContact === true){
            console.log('Inside line 64');
            let acntId1 = this.selectedAcnt[0];
            this.displayContactJs(acntId1);
        }
    }

    handleContactSelection(event){
        this.selctedCon =[];

        if(Array.isArray(event.detail.selectedRows) && event.detail.selectedRows.length >0){
            this.selectedCon = event.detail.selectedRows.map(e =>e.Id);
        }
    }

    handleCheckboxChange(event){
        if(event.detail.checked == true){
            this.isContactCreatedChecked   = true;
        }      
        console.log(this.isContactCreatedChecked);
    }





}