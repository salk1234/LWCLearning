trigger AccountOnTrigger on Account (before insert,after update,before update, after insert, after undelete) {
    switch on Trigger.operationType{
        when BEFORE_INSERT{
            AccountTriggerHandler.beforeInsertHandler(Trigger.new);
        }
        when BEFORE_UPDATE{
            AccountTriggerHandler.beforeUpdateHandler(Trigger.new,Trigger.oldMap);
        }
        when AFTER_INSERT{
            AccountTriggerHandler.afterInsertHandler(Trigger.new,Trigger.oldMap);
        }
        
        when AFTER_UPDATE{
            //this is used to avoid Recurrsion that might cause due to several other automation tools available in SF
            //calling for the first time 
            //only until 16 times SF will support Recursive calls
            if(!AccountTriggerHandler.isRunOnce){
                AccountTriggerHandler.isRunOnce = True;
                AccountTriggerHandler.afterUpdateHandler(Trigger.new, Trigger.oldMap,Trigger.newMap);
            	AccountTriggerHandler.afterInsertHandler(Trigger.new,Trigger.oldMap);
            }
            
        }
        when AFTER_UNDELETE{
            AccountTriggerHandler.afterUndeleteHandler(Trigger.new,Trigger.oldMap);
        }
    }
}