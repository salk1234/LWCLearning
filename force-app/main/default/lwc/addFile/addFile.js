import {LightningElement,track,api} from 'lwc';
import {FlowAttributeChangeEvent} from 'lightning/flowSupport';
import deleteContentDocument  from '@salesforce/apex/AddFilesApex.deleteUploadedBaselineFile';
import getContentDocument  from '@salesforce/apex/AddFilesApex.getContentDocumentDetails';

export default class GpoRebatePaymentFileUpload extends LightningElement {
    @track uploadedFiles;
    @track uploadedAllFiles = [];
    @track uploadedBaseFiles = [];
    @track contentDocId = [];
    @track isMultipleFilePresent = false;
    @api contentDocumentIds = [];
    @api noOfFilesToShow;
    @api isDuplicatePresent = false;
    
    // this is to handle uploaded files
    @api apexTest;
    @api apexTest1;

    connectedCallback(){
        if(this.contentDocumentIds){
            this.getDocumentDetails();
        }
    }
    getDocumentDetails(){
        getContentDocument({
            "documentIds" : this.contentDocumentIds
        })
        .then(result => {
           let documents = result;
           let documentDetails = [];
           documents.forEach(element => {
                documentDetails.push({
                    key: element.Id, 
                    value: element.Title
                });
            });
            this.uploadedAllFiles = documentDetails;
        });
    }  

    handleUploadFinished(event) {
        this.uploadedFiles = event.detail.files;
        // second time onwards file upload
        if (this.uploadedAllFiles.length > 0) {
            // if uploaded files length greater than 3 then show more link
            if (this.uploadedAllFiles.length >= this.noOfFilesToShow) {
                this.isMultipleFilePresent = true;
                // push files to uploadedAllFiles
                for (let i = 0; i < this.uploadedFiles.length; i++) {
                    this.uploadedAllFiles.push({
                        key: this.uploadedFiles[i].documentId,
                        value: this.uploadedFiles[i].name
                    });
                    //push ContentDocumentId to contentDocId
                    this.contentDocId.push(this.uploadedFiles[i].documentId);
                }
            } else {
                // if uploaded files length less than 3
                let uploadedFilesCount = this.uploadedAllFiles.length + this.uploadedFiles.length;
                // if uploaded files greater than 3 then show more link
                if (uploadedFilesCount > this.noOfFilesToShow) {
                    this.isMultipleFilePresent = true;
                }
                for (let i = 0; i < this.uploadedFiles.length; i++) {
                    // uploadedBaseFilesCount will store length of uploadedBaseFiles
                    let uploadedBaseFilesCount = this.noOfFilesToShow - this.uploadedBaseFiles.length;
                    // push files in uploadedBaseFiles with length uploadedBaseFilesCount
                    if (i <= uploadedBaseFilesCount) {
                        this.uploadedBaseFiles.push({
                            key: this.uploadedFiles[i].documentId,
                            value: this.uploadedFiles[i].name
                        });
                    }
                    // push all files to uploadedAllFiles
                    this.uploadedAllFiles.push({
                        key: this.uploadedFiles[i].documentId,
                        value: this.uploadedFiles[i].name

                    });
                    //push ContentDocumentId in contentDocId
                    this.contentDocId.push(this.uploadedFiles[i].documentId);
                }
            }
        } else { // first time file upload
            // show more link if uploaded files length greater than 3
            if (this.uploadedFiles.length > this.noOfFilesToShow) {
                this.isMultipleFilePresent = true;
            }
            for (let i = 0; i < this.uploadedFiles.length; i++) {
                // this is to push first 3 files to uploadedBaseFiles
                if (i < this.noOfFilesToShow) {
                    this.uploadedBaseFiles.push({
                        key: this.uploadedFiles[i].documentId,
                        value: this.uploadedFiles[i].name
                    });
                }
                // this is to store all files in uploadedAllFiles
                this.uploadedAllFiles.push({
                    key: this.uploadedFiles[i].documentId,
                    value: this.uploadedFiles[i].name
                });
                // this is to store ContentDocument id 
                this.contentDocId.push(this.uploadedFiles[i].documentId);
            }

        }
        // set flow parameters using FlowAttributeChangeEvent
        if (this.contentDocId.length > 0) {
            const attributeChangeEvent = new FlowAttributeChangeEvent('contentDocumentIds', this.contentDocId);
            this.dispatchEvent(attributeChangeEvent);
        }
    }
    // this is to disable more link
    handleMoreClick() {
        this.isMultipleFilePresent = false;
    }
    //delete uploaded file added as Part of TREN-4689
    removeFile(event){
        let documentId = event.target.dataset.id;
        let finalUploadedBaseFiles= this.uploadedBaseFiles.filter(function(ele){ 
            return ele.key != documentId;
        });
        this.uploadedBaseFiles = finalUploadedBaseFiles;
        let finalUploadedAllFiles = this.uploadedAllFiles.filter(function(ele){ 
            return ele.key != documentId;
        });
        this.uploadedAllFiles = finalUploadedAllFiles;
        let finalContentDocId = this.contentDocId.filter(function(ele){ 
            return ele != documentId;
        });
        this.contentDocId = finalContentDocId;

        deleteContentDocument({
            "documentId" : documentId
        })
        .then(result => {
            const attributeChangeEvent = new FlowAttributeChangeEvent('contentDocumentIds', this.contentDocId);
            this.dispatchEvent(attributeChangeEvent);
        });        
    }
}