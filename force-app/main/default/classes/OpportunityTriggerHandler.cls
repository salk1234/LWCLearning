public class OpportunityTriggerHandler {
    public static void afterInsertHandler(List<Opportunity> oppo){
        List<Task> taskList = new List<Task>();
        List<Id> oppId = new List<Id>();
        for(Opportunity op: oppo){
            oppId.add(op.Id);
        }
        List<OpportunityTeamMember> opMemList = [Select Id,OpportunityId from OpportunityTeamMember where OpportunityId IN: oppId];
        List<OpportunityTeamMember> deletedList = new List<OpportunityTeamMember>(); 
      
        for(Opportunity obj:oppo){
        if(obj.StageName == 'Closed Won'){
                Task tk = new Task(Priority = 'High',
                                  OwnerId = obj.OwnerId, 
                                  Description = 'Please split the revenu amongst the team members',
                                  Status = 'Not Started',
                                  Subject = 'Split revenue',
                                  WhatId = obj.Id);
                taskList.add(tk);             
            }
            else if(obj.StageName == 'Closed Lost'){
                for(OpportunityTeamMember opMem :opMemList){
                    if(obj.Id == opMem.OpportunityId){
                        deletedList.add(opMem);
                    }
                }
            }
        }
        if(!taskList.isEmpty())
        insert taskList;
        
        if(!deletedList.isEmpty())
        delete deletedList;
    }
    public static void beforeUpdateHandler(List<Opportunity> op, Map<Id,Opportunity> oldOpp){
        for(Opportunity opp:op){
            if(opp.StageName != oldOpp.get(opp.Id).StageName && opp.Probability !=null && opp.ExpectedRevenue != null)
                opp.Amount = opp.Probability * opp.ExpectedRevenue;
             }
    }
    public static void afterDeleteHandler(List<Opportunity> oldOpp){
        
        Set<Id> acntId = new Set<Id>();
        Map<Id,Id> oppVsAcntId = new Map<Id,Id>();
        Map<Id,Id> accntVsOwnrId = new Map<Id,Id>();
        
        for(Opportunity ops : oldOpp){
            acntId.add(ops.AccountId);
            oppVsAcntId.put(ops.Id,ops.AccountId);
        }
        
        List<Account> acc = [Select Id, OwnerId from Account where Id IN: acntId];
        
        for(Account acnt:acc){
            accntVsOwnrId.put(acnt.Id,acnt.OwnerId);
        }
        
        List<Task> taskList = new List<Task>();
        for(Opportunity op :oldOpp){
            Task tk = new Task(Priority = 'High',
                                  OwnerId = accntVsOwnrId.get(oppVsAcntId.get(op.Id)), 
                                  Description = 'Reason for Opportunity Deletion',
                                  Status = 'Not Started',
                                  Subject = 'Opportunity Deleted');
            taskList.add(tk);            
        }
        if(!taskList.IsEmpty())
        insert taskList;
              
    }
    public static void afterUpdateHandler(List<Opportunity> newRec, Map<Id, Opportunity> oppOldMap){
        
        ID roleId = [Select Id,Name from UserRole where Name =: 'Opportunists'].Id;
        List<User> roleUser = [Select Id, UserRoleId from User where UserRoleId =:roleId];
        List<OpportunityTeamMember> opMemList = new List<OpportunityTeamMember>();
            
        for(Opportunity opp:newRec){
            if(opp.StageName == 'Needs Analysis' && opp.StageName != oppOldMap.get(opp.Id).StageName){
                for(User newUser : roleUser){
                OpportunityTeamMember opteamMem = new OpportunityTeamMember(OpportunityId = opp.Id,
                                                                             UserId = newUser.Id);
                    opMemList.add(opteamMem);
                    
                        }
                }
        }
        if(!opMemList.isEmpty()){
            insert opMemList;
        }
    }
    public static void afterHandlerUpdate(List<Opportunity> newRec, Map<Id,Opportunity> oldOppRec){
        List<Id> oppOwnerId = new List<Id>();
        List<Id> acntId = new List<Id>();
        List<String> teamMemberEmail = new List<String>();
        List<Id> oppId = new List<Id>();
        List<String> acntOwnerEmail = new List<String>();
        List<String> oppOwnerEmail = new List<String>();
        List<String> emailsToBeSent = new List<String>();

        
        for(Opportunity opp: newRec){
            if(opp.StageName == 'Closed Won'&& opp.StageName != oldOppRec.get(opp.Id).StageName){
                oppOwnerId.add(opp.OwnerId);
                acntId.add(opp.AccountId);
                oppId.add(opp.Id);
                    
            }
        }
        List<Opportunity> oppo = [Select OwnerId, Owner.Email from Opportunity where OwnerId IN: oppOwnerId];
        for(Opportunity ops: oppo){
            oppOwnerEmail.add(ops.Owner.Email);
        }
        List<Account> acnt = [Select OwnerId, Owner.Email from Account where ID IN:acntId];
        for(Account acc:acnt){ 
            acntOwnerEmail.add(acc.Owner.Email);
        }
        List<OpportunityTeamMember> oppTeam = [Select UserId, User.Email from OpportunityTeamMember where OpportunityId IN:oppId];
        for(OpportunityTeamMember op:oppTeam){
            teamMemberEmail.add(op.User.Email);
        }
        for(String email : emailsToBeSent){
            System.debug(email);
        }
        
        if(!emailsToBeSent.isEmpty()){
            
            Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage>();  
            
            for(Id opIds : oppId){
                Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
                message.toAddresses = emailsToBeSent;
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
    public static void handlerAfterUpdate(List<Opportunity> opp, Map<Id,Opportunity> oldOppoMap){
        List<Task> taskList = new List<Task>();
        for(Opportunity obj:opp){
            if(oldOppoMap.get(obj.Id).StageName == 'Perception Analysis'){
            if((obj.StageName == 'Qualification' || obj.StageName == 'Prospecting')&& obj.StageName != oldOppoMap.get(obj.Id).StageName)
            {
                        Task tk = new Task(WhatId = obj.Id, Status = 'Not Started', Priority = 'High',
                                           Subject = 'URGENT -- LOOK INTO THIS',Description = 'Oportunity stage moved back',
                                           IsReminderSet = True,ReminderDateTime = System.today()+1);    
                taskList.add(tk);
                        
            }
            }
        }
        insert taskList;
    }
}