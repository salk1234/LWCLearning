/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 12-15-2025
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class OpportunityWizardCtrl {
    @AuraEnabled(cacheable=false)
    public static List<PricebookEntry> getPriceBookEntries(List<Id> prdIds){
        System.debug('prdIds>>'+prdIds);
        List<PricebookEntry> pbEntries =[Select Id,UnitPrice,ProductCode,Product2.Name,Product2.Description from PricebookEntry WHERE Id IN:prdIds WITH SECURITY_ENFORCED LIMIT 1000];
        System.debug('pbEntries>>'+pbEntries);
        return pbEntries;
    }
    @AuraEnabled(cacheable=false)
    public static List<PriceBookEntry> fetchPriceBookEntries(String searchTerm){
        String searchKey = '%'+searchTerm+'%';
        List<PricebookEntry> pbEntries =[Select Id,UnitPrice,ProductCode,Product2.Name,Product2.Description from PriceBookEntry WHERE Product2.Name LIKE :searchKey AND Pricebook2.Name = 'Standard Price Book'  WITH SECURITY_ENFORCED LIMIT 1000];
        System.debug('at line 18');
        return pbEntries;
    }
    @AuraEnabled(cacheable=false)
    public static Boolean createOpportunityRecords(Opportunity oppo, List<OpportunityLineItem> lineItem){
        Pricebook2 pbId = [Select Id from Pricebook2 where Name = 'Standard Price Book' WITH SECURITY_ENFORCED];
        SavePoint sp = Database.setSavepoint();
        try{
            oppo.Pricebook2Id = pbId.Id;
            if(Schema.sObjectType.Opportunity.isCreateable()){
                insert oppo;
            }
            for(OpportunityLineItem oppoLineItem : lineItem){
                oppoLineItem.OpportunityId = oppo.Id;
            }
            if(Schema.sObjectType.OpportunityLineItem.isCreateable()){
                insert lineItem;
            }
            return true;
        }catch(Exception e){
            Database.rollback(sp);
            System.debug('Error: '+e.getMessage());
            return false;
        }
    }
    public class OppoWrapper{
        //public List<PriceBookWrapper> pbs;
        public String oppoName;
        public Date closeDate;
        public String stageName;
        public Integer amount;
    }
    public class OpportunityLineItemWrapper{
        public Integer unitPrice;
        public Integer quantity;
        public Id pbId;
        public String productName;
        public Integer discount;        
    }
}
   