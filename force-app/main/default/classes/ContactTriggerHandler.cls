public class ContactTriggerHandler {
    public static void beforeInsertHandler(List<Contact> newContacts){
        List<Contact> conList = [Select Id, LastName, Email, Phone from Contact LIMIT 50000];
        for(Contact con:newContacts){
            for(Contact existingCon:conList){
                if(con.LastName == existingCon.LastName && con.Email == existingCon.Email && con.Phone == existingCon.Phone){
            con.addError('Duplicate exists:' +existingCon.Id);
        }
            } 
    }
        Set<Id> accountId = new Set<Id>();
        for(Contact con:newContacts){
            accountId.add(con.AccountId);            
        }
        Map<Id, Account> acntMap = new Map<Id, Account>([Select Id,Max_Contact_Allowed__c, No_of_Contacts__c from Account where ID IN: accountId]);
        
        for(Contact con:newContacts){
            if(acntMap.get(con?.AccountId)?.Max_Contact_Allowed__c == acntMap.get(con?.AccountId)?.No_of_Contacts__c){
                con.addError('Limit Exceeded');
                
            }
        }
            
    }
    public static void beforeInsertHandle(List<Contact> newRec){
       
        Set<Id> accountIdSet = new Set<Id>();
        Map<Id, Id> conIdVsAccountId = new Map<Id,Id>();
       
        for(Contact con:newRec){
            accountIdSet.add(con.AccountId);
            conIdVsAccountId.put(con.Id, con.AccountId);
        }   
        Map<Id,Account> acntMap = new Map<Id, Account>([Select Id,BillingCity from Account where ID IN: accountIdSet]);
        for(Contact con:newRec){
            if(acntMap.containsKey(con.AccountId)){
                con.MailingCity = acntMap.get(con.AccountId).BillingCity;

                }
               }
        
}
    public static void afterInsertHandler(List<Contact> newRec){
        
        }
    
    public static void afterUpdateHandler(List<Contact> newRec, Map<Id, Contact> oldConMap){
        List<Id> acntIds = new List<Id>();
        for(Contact con:newRec){
            if(con.AccountId!=null){
            if(con.Email!= oldConMap.get(con.Id).Email || con.Phone != oldConMap.get(con.Id).Phone){
                //send email to account owner as the Email and Phone on Contact object are modified.
                acntIds.add(con.AccountId);
            }
            }
        }
         
            List<String> userEmail = new List<String>();
            List<Account> acnt = [Select OwnerId, Owner.Email from Account where Id IN: acntIds];
            for(Account acc: acnt){
                userEmail.add(acc.Owner.Email);
            }      
            
        if(!userEmail.isEmpty()){               
               

            Messaging.SingleEmailMessage[] messages = new List< Messaging.SingleEmailMessage>();  
            
            for(Id accId : acntIds){
                Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
                message.toAddresses = userEmail;
                //message.optOutPolicy = 'FILTER';
                message.subject = 'Contact Email or Phone has been modified';
                message.plainTextBody = 'The email or phone information of your child contact has been modified.';
                messages.add(message);
                    }     
           Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
           if (results[0].success) {
                System.debug('The email was sent successfully.');
            } else {
                System.debug('The email failed to send: ' + results[0].errors[0].message);
            }
             
      }
    }
}