import { LightningElement } from 'lwc';
import getAccounts from '@salesforce/apex/InvoiceTreeGridCntrl.getAccountRecs';
import fetchContact from  '@salesforce/apex/InvoiceTreeGridCntrl.fetchContactRecs';

const COLUMNS =[
    {label:'Name',fieldName:'Name',type:'text'}
]

export default class InvoiceTreeGrid extends LightningElement {
    cols = COLUMNS;
    data =[];
    lineItemMap ={};
    offsetMap ={}; 
    isLoading= false;  
    displayMessage = false; 

    connectedCallback(){
        this.fetchAccounts();
    }
    fetchAccounts(){
        getAccounts()
        .then(result=>{
            this.data = result;
            this.data = this.data.map(item => ({
                ...item,
                iconName: item.isExpanded ? 'utility:chevrondown' : 'utility:chevronright'
            }));
        })
        .catch(error=>{
            console.error('Error in fetching accounts>>',error);
        })
    }
    handleClickJs(event){
        this.isLoading=true;
        const acntId = event.target.dataset.id;
        if(!this.lineItemMap[acntId]){
            this.lineItemMap[acntId] = [];
            this.offsetMap[acntId] = this.offsetMap[acntId]? this.offsetMap[acntId]:0;
                fetchContact({accntId:acntId, offsetVal:this.offsetMap[acntId]})
                .then(result=>{
                    if(result.length>0){
                        this.lineItemMap[acntId] = this.lineItemMap[acntId].concat(result);
                        this.data = this.data.map(item=>{
                            if(item.Id === acntId){
                                return {
                                    ...item,
                                    isExpanded : true,
                                    children: this.lineItemMap[acntId],
                                    iconName: item.isExpanded ? 'utility:chevrondown' : 'utility:chevronright'
                                }
                            }else{
                                return{
                                    ...item,
                                    isExpanded : false,
                                    iconName: item.isExpanded ? 'utility:chevrondown' : 'utility:chevronright'
                                }
                            }
                            return item;    
                        })
                    }else{
                        this.data = this.data.map(item=>{
                            if(item.Id === acntId){
                                return {
                                    ...item,
                                    isExpanded : true,
                                    displayMessage: true,
                                    iconName: item.isExpanded ? 'utility:chevrondown' : 'utility:chevronright'
                                }
                            }else{
                                return {
                                    ...item,
                                    isExpanded : false,
                                    displayMessage: false,
                                    iconName: item.isExpanded ? 'utility:chevrondown' : 'utility:chevronright'
                                }
                            }
                            return item;
                        })
                    }
                    this.isLoading=false;
                    if(result.length >= 10){
                        this.offsetMap[acntId] += result.length;
                        this.data = this.data.map(item=>{
                            if(item.Id === acntId){
                                return{
                                    ...item,
                                    isDisplayViewMore : true
                                }
                            }
                            return item;
                        })
                    }
                })
                .catch(error=>{
                    console.error('Error in fetching contact>',error);
                })           
        }
    }
    handleLoadMore(event){
        const acntId = event.target.dataset.id;
        fetchContact({accntId:acntId, offsetVal:this.offsetMap[acntId]})
        .then(result=>{
            if(result.length>0){
                this.lineItemMap[acntId] = this.lineItemMap[acntId].concat(result);
                this.data = this.data.map(item=>{
                    if(item.Id === acntId){
                        return {
                            ...item,
                            children: this.lineItemMap[acntId]
                        }
                    }
                    return item;
                })
            }
            this.isLoading=false;
        })
        .catch(error=>{
            console.error('Error in fetching contact>',error);
        })

    }
}