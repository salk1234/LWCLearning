public class AccountTriggerHandler {
    public static Boolean isRunOnce = False;
    public static void beforeInsertHandler(List<Account> acc){
	Map<Id,Id> acntVsOwnerID = new Map<Id,Id>();
        for(Account acnt : acc){
            acntVsOwnerId.put(acnt.Id,acnt.OwnerId);          
        }
        Map<Id,User> userVsOwnerID = new Map<Id,User>([Select Id, Name from User where Id IN: acntVsOwnerId.values()]);
        for(Account acn:acc){
            acn.Sales_Representative__c = userVsOwnerId.get(acntVsOwnerId.get(acn.Id)).Name;
        }
    }
    public static void beforeUpdateHandler(List<Account> acc,Map<Id,Account> oldAccountMap){
        for(Account acnt: acc){
            if(acnt.Industry == 'Agriculture'&& acnt.Type == 'Prospect'){
			   if(acnt.Ownership == 'Private' && acnt.Ownership != oldAccountMap.get(acnt.Id).ownership)
            {
                acnt.addError('You can not update ownership field as it is set to private');
            }
            else{
                acnt.Name = 'Testing update functionality';
            }
          }
        }
    }
    public static void afterInsertHandler(List<Account> acc,Map<Id,Account> oldMap){
    List<Contact> con = new List<Contact>();
         for(Account acnt:acc){
         	if(acnt.No_of_Contacts__c!= null && acnt.No_of_Contacts__c != oldMap.get(acnt.Id).No_of_Contacts__c && oldMap.get(acnt.Id).No_of_Contacts__c == null){
        		for(Integer i =0;i<acnt.No_of_Contacts__c;i++){
            		Contact cont = new Contact();
                	cont.LastName ='SalesforceMakesSense'+acnt.Name+i;
                	cont.AccountId = acnt.Id;
                	con.add(cont);
        }
             }
         }
        if(!con.isEmpty()){
         insert con;
        }
    }
        
        
    public static void afterUpdateHandler(List<Account> acc, Map<Id,Account> oldAccountMap, Map<Id,Account> newAccountMap){
        List<Id> acntIdList = new List<Id>();
        Set<Id> accountIds = new Set<Id>();
   		for(Account acnt : acc){
            if(acnt.BillingCity !=oldAccountMap .get(acnt.Id).BillingCity){
                accountIds.add(acnt.Id);
            }
            if(acnt.Website!= oldAccountMap.get(acnt.Id).Website){
                accountIds.add(acnt.Id);
            }
            if(acnt.Industry != oldAccountMap.get(acnt.Id).Industry && acnt.Industry == 'Biotechnology'){
                    acntIdList.add(acnt.Id);
                }
            			            
        }
        updateRelatedContacts(acntIdList);
        
     List<Contact> listofContacts = [Select Id, MailingCity, AccountId from Contact where AccountId In :accountIds];
        for(Contact contact:listofContacts){
            contact.MailingCity = newAccountMap.get(contact.AccountId).BillingCity;
        }
        if(!listofContacts.isEmpty()){
            update listofContacts;
        }
    }
    //As this is after undelete handler, we can not directly loop over the newly comming records and then update the record,
	//as records will be in read only mode in 'After' triggers.
    public static void afterUndeleteHandler(List<Account> acc,Map<Id, Account> oldAcntMap){
        List<Account> acntUpdate = new List<Account>();
        Set<Id> acntId = new Set<Id>();
        for(Account acnt: acc){
            acntId.add(acnt.ID);
        }
        List<Account> accList = [Select Id, Name from Account where Id IN: acntId];
        for(Account obj:accList){
            obj.Name = 'Restored '+obj.Name;
            acntUpdate.add(obj);
        }
        
        if(!acntUpdate.isEmpty()){
            update acntUpdate;
        }
    }
    @future
    public static void updateRelatedContacts(List<Id> accountId){
        List<Contact> updateCon = new List<Contact>();
        List<Contact> updateConList= [Select Id, LeadSource from Contact where AccountId IN: accountId];
        for(Contact con : updateConList){
            con.LeadSource = 'Phone';
            updateCon.add(con);
        }
        if(!updateCon.isEmpty()){
            update updateCon;
        }
    }
}