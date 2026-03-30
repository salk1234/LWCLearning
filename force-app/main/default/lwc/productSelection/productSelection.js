import { LightningElement, wire,api } from 'lwc';
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
    @api selectedRowsParent;
    selectedRows=[];
    displayProducts;
    selectedProducts=[];
    @api count=0;
    hasRendered = false;

    connectedCallback(){
        console.log('this.selectedRowsParent>>',this.selectedRowsParent);
        this.displayProducts =true;
        this.fetchPriceBookEntriesJS();
        //this.selectedRows = this.selectedRowsParent;
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
    renderedCallback() {

        console.log('renderedCallback>>',this.data);
        if (!this.hasRendered && this.data.length > 0) {
            console.log('At lien 48');
            this.hasRendered = true;
            this.applyPreviousSelections();
        }
    }
    applyPreviousSelections() {
        if (this.selectedRowsParent && this.selectedRowsParent.length > 0) {
            // Update internal state
            this.selectedRows = [...this.selectedRowsParent];
            this.count = this.selectedRows.length;
            
            // Find the full product records for selected IDs
            this.selectedProducts = this.data.filter(product => 
                this.selectedRowsParent.includes(product.Id)
            );
            
        }
    }

    handleKeyUp(evt) {
        const isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {
            this.searchKey = evt.target.value;
        }
        this.fetchPriceBookEntriesJS();
    }
    getSelectedProducts(event){
        const selected = event.detail.selectedRows;
        this.selectedProducts = selected;
        this.count = selected.length;
        this.selectedRows = selected.map(r => r.Id);
        console.log('Selected Rows are>>',this.selectedRows);

        const msgEvt  = new CustomEvent('count',{
            detail:{
                count:this.count,
                selectedRows:this.selectedRows
            }
        });
        this.dispatchEvent(msgEvt);
    }
    getSelectedRows(){
        this.displayProducts = false;
        this.displaySelectedRows = true;
    }
    getDisplayProducts(){
        this.displayProducts=true;
        this.displaySelectedRows=false;
    }
}