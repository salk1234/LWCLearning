trigger LeadTrigger on Lead (before update,after insert,before Delete){
   	switch on Trigger.operationType{
        when BEFORE_UPDATE{
            LeadTriggerHandler.beforeUpdateHandler(Trigger.new);
            LeadTriggerHandler.handlerbeforeUpdate(Trigger.new);
        }
   		when BEFORE_DELETE{
       		LeadTriggerHandler.beforeDeleteHandler(Trigger.new);
    }
		when AFTER_INSERT{
        	LeadTriggerHandler.afterInsertHandler(Trigger.new);
        }
    }
    
    

}