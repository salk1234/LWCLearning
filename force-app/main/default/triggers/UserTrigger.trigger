trigger UserTrigger on User (after insert) {
    switch on Trigger.operationType{
        when AFTER_INSERT{
            UserAsyncFuture.afterInsertHandler(Trigger.new);
            UserAsyncFuture.insertUserToPublicGroup(Trigger.new);
        }
    }

}