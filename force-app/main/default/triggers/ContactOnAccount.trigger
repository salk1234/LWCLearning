trigger ContactOnAccount on Contact (before insert,after insert, after delete) {
    Set<Id> accountIds = new Set<Id>();
    if(Trigger.isBefore && Trigger.isInsert){
        for(Contact con : Trigger.new){
            if(con.AccountId == null){
                con.addError('Cannot create contact without account');
            }
            accountIds.add(con.AccountId);
            
        }
    }
    Map<Id,Account> mapOfAcntToConts = new Map<Id,Account> ([Select Id, (Select Id from Contacts) from Account where Id IN: accountIds]);
    for(Contact con : Trigger.new){
        if(mapOfAcntToConts.containsKey(con.AccountId)&& mapOfAcntToConts.get(con.AccountId).Contacts.size()>=5)
            con.addError('cannot have more than 5 related contacts per acnt');
    }

}