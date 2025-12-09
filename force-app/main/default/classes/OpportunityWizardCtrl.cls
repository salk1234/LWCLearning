/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 12-07-2025
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
        List<PricebookEntry> pbEntries =[Select Id,UnitPrice,ProductCode,Product2.Name,Product2.Description from PriceBookEntry WHERE Product2.Name LIKE :searchKey WITH SECURITY_ENFORCED LIMIT 1000];
        System.debug('at line 18');
        return pbEntries;
    }
}