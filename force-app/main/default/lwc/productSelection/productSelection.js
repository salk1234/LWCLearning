import { LightningElement, wire,api } from 'lwc';
import getPriceBookEntries from '@salesforce/apex/OpportunityWizardCtrl.getPriceBookEntries';
import fetchPriceBookEntries from '@salesforce/apex/OpportunityWizardCtrl.fetchPriceBookEntries';

 const COLUMNS =[
    {label:'Product Name',fieldName:'ProductName',type:'text'},
    {label:'List Price',fieldName:'UnitPrice',type:'currency'},
    {label:'Product Code',fieldName:'ProductCode',type:'text'},
    {label:'Description',fieldName:'Description',type:'text'}
]
export default class ProductSelection extends LightningElement {
    data=[];
    cols=COLUMNS;
    searchKey ='';
    selectedRows=[];
    displayProducts;
    connectedCallback(){
        this.displayProducts =true;
        this.fetchPriceBookEntriesJS();
    }
    fetchPriceBookEntriesJS(){
        fetchPriceBookEntries({searchTerm:this.searchKey})
        .then(result=>{
            this.data=result.map(entry => ({
                        Id: entry.Id,
                        UnitPrice: entry.UnitPrice||0,
                        ProductCode: entry.ProductCode||'',
                        ProductName: entry.Product2?.Name||'',
                        Description: entry.Product2?.Description||''
                    }));

            console.log('Data::>>',this.data);
        })
        .catch(error=>{
            console.error('Error while calling fetchPRiceBookEntries>>',error);
        })
    }
    handleKeyUp(evt) {
        const isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {
            this.searchKey = evt.target.value;
        }
        this.fetchPriceBookEntriesJS();
    }
    getSelectedProducts(event){
        this.selectedRows = event.detail.selectedRows;
        console.log('Selected Rows are>>',this.selectedRows);
    }
    getSelectedRows(){
        this.displayProducts = false;
        this.displaySelectedRows = true;
    }
}