trigger OpportunityTrigger on Opportunity (after insert,after update,after delete, before insert, before update) {
    switch on Trigger.operationType{
        when AFTER_INSERT{
            //OpportunityTriggerHandler.afterInsertHandler(Trigger.new);
        }
        when AFTER_UPDATE{
            //OpportunityTriggerHandler.afterInsertHandler(Trigger.new);
            OpportunityTriggerHandler.afterUpdateHandler(Trigger.new, Trigger.oldMap);
            OpportunityTriggerHandler.afterHandlerUpdate(Trigger.new, Trigger.oldMap);
            OpportunityTriggerHandler.handlerAfterUpdate(Trigger.new, Trigger.oldMap);
        }
        when BEFORE_UPDATE{
            OpportunityTriggerHandler.beforeUpdateHandler(Trigger.new, Trigger.oldMap);
        }
        when AFTER_DELETE{
            OpportunityTriggerHandler.afterDeleteHandler(Trigger.old);
        }
    }  
    
}