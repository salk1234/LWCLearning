/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 04-05-2026
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class InvoiceTreeGridCntrl {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountRecs(){
        try{
            return[SELECT Id, Name from Account WITH SECURITY_ENFORCED];
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> fetchContactRecs(String accntId, Integer offsetVal){
        try{
            System.debug('acntId: '+ accntId +'offsetVal: '+ offsetVal);
            return[SELECT Id, Name from Contact WHERE AccountId = :accntId WITH SECURITY_ENFORCED LIMIT 10 OFFSET :offsetVal];
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
}