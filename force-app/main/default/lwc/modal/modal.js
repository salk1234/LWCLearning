import { LightningElement, api } from 'lwc';

export default class Modal extends LightningElement {
  @api isopen = false;
  @api flowApiName; // Pass this from the parent component

  closeModal() {
    this.isopen = false;
  }

  handleFlowStatusChange(event) {
    if (event.detail.status === 'FINISHED') {
      this.closeModal();
      // Handle flow completion logic (optional)
    } else if (event.detail.status === 'CANCELED') {
      this.closeModal();
      // Handle flow cancellation logic (optional)
    }
  }
}