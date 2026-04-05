/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 04-04-2026
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class DynamicTreeGrid {
    @AuraEnabled(cacheable=true)
    public static List<Account> getNewContactsForAccounts(){
        return [Select Id,Name,(Select Name FROM Contacts) FROM Account WHERE Id IN(Select AccountId from Contact) WITH SECURITY_ENFORCED LIMIT 10] ;
    }
    @AuraEnabled
    public static List<Contact> getAdditionalContacts(Id acntId, Integer offsetVal){
        System.debug('acntId: '+ acntId);
        try {
            List<Contact> contacts = [Select Id from Contact where AccountId =: acntId WITH SECURITY_ENFORCED];
            if(contacts.size() <= offsetVal) {
                return new List<Contact>();
            }
            else{
                return [SELECT Name FROM Contact where AccountId =: acntId WITH SECURITY_ENFORCED LIMIT 10 OFFSET :offsetVal]; 
            }           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}