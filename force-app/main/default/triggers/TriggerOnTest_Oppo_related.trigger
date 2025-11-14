trigger TriggerOnTest_Oppo_related on Test_Oppo_related__c (before insert,before update) {
    switch on Trigger.operationType{
        when BEFORE_INSERT{
            Test_Oppo_RelatedHandler.beforeInsertHandler(Trigger.new);
        }
        when BEFORE_UPDATE{
            Test_Oppo_RelatedHandler.beforeUpdateHandler(Trigger.new,Trigger.oldMap);
        }
    }
}