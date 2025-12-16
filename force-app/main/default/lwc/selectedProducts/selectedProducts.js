import { LightningElement,api } from 'lwc';
import getPriceBookEntries from '@salesforce/apex/OpportunityWizardCtrl.getPriceBookEntries';

const COLUMNS=[
    {label:'Product Name',fieldName:'ProductName',type:'text'},
    {label:'Quantity',fieldName:'Quantity',type:'number',editable:true},
    {label:'Sales Price',fieldName:'UnitPrice',type:'currency'},
    {label:'Date',fieldName:'Date',type:'date',editable:true},
    {label:'Product Description',fieldName:'Description',type:'text',editable:true}
]; 

export default class SelectedProducts extends LightningElement {
    @api prdIds;
    updatedData=[];
    data=[];
    cols=COLUMNS;
    quantityError;
    unitPriceError;
    discountError;
    totalAmount=0;
    updatedPbData =[];
    count;

    connectedCallback(){
        this.fetchSelectedProducts();
    }
    fetchSelectedProducts(){
        getPriceBookEntries({prdIds:this.prdIds})
        .then(result=>{
            console.log('result>',result);
            this.data=result.map(entry => ({
                        Id: entry.Id,
                        UnitPrice: entry.UnitPrice||0,
                        ProductCode: entry.ProductCode||'',
                        ProductName: entry.Product2?.Name||'',
                        Description: entry.Product2?.Description||''
                    }));
            this.count = this.data.length;
        })
        .catch(error=>{
            console.error('Error while fetching selected products>>',error);
        })
    }
    handleChange(event){
        const inputEle1 = event.target;
        const pbId = inputEle1.dataset.id;
        const fieldName = inputEle1.name;
        const fieldValue = inputEle1.value;
        const value = fieldValue===''?null:Number(event.target.value);
        let error='';
        if(fieldName==='Quantity' && value<=0){
            error = 'Quantity cannot be negative';
        }else if(fieldName === 'UnitPrice' && value<=0){
            error = 'Unit Price cannot be negative';
        }else if(fieldName === 'Discount' && (value<=0 || value>99)){
            error = 'Discount should be between 0 and 99';
        }
        
        /*if(fieldName==='Quantity'){
            if(value<0){
                //this.quantityError = 'Quantity cannot be negative';
                error = 'Quantity cannot be negative';
            }else{
                this.quantityError = '';
            }
        }
        if(fieldName === 'UnitPrice'){
            if(value<0){
                //this.unitPriceError = 'Unit Price cannot be negative';
                error = 'Unit Price cannot be negative';
            }
            else{
                this.unitPriceError = '';
            }
        }
        if(fieldName === 'Discount'){
            if(value<=0 || value>99){
                //this.discountError = 'Discount should be between 0 and 99';
                error = 'Discount should be between 0 and 99';
                console.log('Discount Error>>',this.discountError);
            }else{
                this.discountError=''
            }
        }*/
        inputEle1.setCustomValidity(error);
        inputEle1.reportValidity();

       /*this.data = this.data.map(row=>{
            return row.Id === pbId?{...row,[fieldName]:value}:row
       });
       console.log('Data>>',this.data);*/
       this.data = this.data.map(row=>{
            if(row.Id !== pbId){
                return row;
            }
            const updated = {...row};
            updated[fieldName] = value;

            const qty = Number(updated.Quantity) || 0;
            const price = Number(updated.UnitPrice)||0;
            const dicnt = Number(updated.Discount)||0;
            const factor = (1-Math.min(Math.max(dicnt,0),100)/100);
            const lineTotal = qty * price * factor;
            updated.LineTotal = Number.isFinite(lineTotal)?Number(lineTotal.toFixed(2)):0;
            this.totalAmount = this.data.reduce((sum,row)=>{
                return sum + (Number(row.LineTotal)||0);
            },0);
            if(this.totalAmount != ''){
                this.updatedPbData.push(pbId);
            }
            return updated;
       });
       let updatedPbIDs = new Set(this.updatedPbData);
       let updatedPbIDsArr = Array.from(updatedPbIDs);
       console.log('count>>',this.count);
       console.log('this.updatedPbData.length>>',updatedPbIDsArr.length);
       if(this.count === updatedPbIDsArr.length){
        console.log('Enable next');
          const msgEvt = new CustomEvent('updatedprds',{
            detail:{
                message:true,
                priceBookData:this.data,
                totalAmount:this.totalAmount
            }
          });
          this.dispatchEvent(msgEvt);
       }
    }
}