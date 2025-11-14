trigger CaseTrigger on Case (before insert, before delete) {
    switch on Trigger.operationType{
        when BEFORE_INSERT{
            CaseTriggerHandler.beforeInsertHandler(Trigger.new);
        }
        when BEFORE_DELETE{
            CaseTriggerHandler.beforeDeleteHandler(Trigger.old);
        }
    
    }
}