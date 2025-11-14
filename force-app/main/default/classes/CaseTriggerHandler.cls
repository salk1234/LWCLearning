public class CaseTriggerHandler {
    public static void beforeInsertHandler(List<Case> newRec){
        for(Case obj : newRec){
            if(obj.Origin == 'Phone'){
                obj.Priority = 'High';
            }
            else
            {
                obj.Priority = 'Low';
            }
        }
    }
    public static void beforeDeleteHandler(List<Case> oldRec){
        Id currentUserProfileId = UserInfo.getProfileId(); // UserInfo class is an existing one using which we can get the details of the logged in user.
        // SOQL are bulkified and return list of records, So need to use . operator and retrive the Id 
        Id sysAdminProfileId =[Select Id from Profile where Name = 'System Administrator'LIMIT 1].Id;
        if(currentUserProfileId != sysAdminProfileId)
        {
            for(Case obj: oldRec){
                obj.addError('Does not have access to delete a case');
            }
        }
    }

}