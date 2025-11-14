trigger TaskTrigger on Task (before insert,after insert, before update) {
    if(Trigger.isBefore && Trigger.isInsert){
        for(Task obj : Trigger.new){
            obj.Priority = 'High';
        }
       // update obj; not required as the scenario is before insert and the data is inserted and after that record is inserted.
    }
    if(Trigger.isAfter && Trigger.isInsert){
        Set<Id> contactIdList = new Set<Id>();
		List<Contact> conList = new List<Contact>();
        Map<Id,Integer> conCountMap = new Map<Id, Integer>();
        
        for(Task taskRec : Trigger.new){
            if(taskRec.WhoId !=null && String.valueOf(taskRec.WhoId).startsWith('003')){
                contactIdList.add(taskRec.WhoId);
                if(conCountMap.containsKey(taskRec.WhoId)){
                    Integer countVar = conCountMap.get(taskRec.WhoId)+1;
               		 conCountMap.put(taskRec.WhoId,countVar);
                         }
                else
                {
                    conCountMap.put(taskRec.WhoId,1);
                }
            }
        }
        List<Contact> cons = [Select Id,Number_of_Task__c from Contact where Id IN: contactIdList];
        for(Contact con: cons){
            if(con.Number_of_Task__c !=null){
            con.Number_of_Task__c = con.Number_of_Task__c + conCountMap.get(con.Id);
            }
            else{
                con.Number_of_Task__c =con.Number_of_Task__c;
            }
            conList.add(con);
        }
        if(!conList.isEmpty()){
            update conList;
        }
    } 
    if(trigger.isBefore && trigger.isUpdate){
        
         Map<Id,Id> taskVsCon = new Map<Id,Id>();
         Set<Id> contactIdSet = new Set<Id>();
          Set<Id> accountIdSet = new Set<Id>();
        Map<Id,Id> conVsAccount = new Map<Id,Id>();
        
        for(Task tk :Trigger.new){
		if(String.valueOf(tk.whoId).startsWith('003')){
            taskVsCon.put(tk.Id, tk.whoId);    
            contactIdSet.add(tk.whoId);
                }
        }
        List<Contact> conList = [Select Id, AccountId from Contact where Id In:contactIdSet];
        for(Contact con:conList){
            conVsAccount.put(con.Id,con.AccountId);
            accountIdSet.add(con.AccountId);
            
        }
        Map<Id,Account> accountMap = new Map<Id,Account>([Select Id, Modify_Task__c from Account where Id IN: accountIdSet]);
        
        for(Task obj:Trigger.new){
            Id acnt = conVsAccount.get(taskVsCon.get(obj.Id));
            if(accountMap.get(acnt).Modify_Task__c == False)                
            {
                obj.addError('Does not have sufficient permissions to edit this record');
                
            }
          
        }
        
        
    }
}