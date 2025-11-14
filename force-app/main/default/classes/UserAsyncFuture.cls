public class UserAsyncFuture {
    public static void afterInsertHandler(List<User> newUser){
        Set<Id> userId = new Set<Id>();
   		Id profileID = [Select Id from Profile where Name = 'Custom: Sales Profile'].Id;
    	for(User obj: newUser){
        	if(obj.ProfileId == profileId){
            	userId.add(obj.Id);
       		 }
        
   		 }
    if(!userId.isEmpty()){
        UserAsyncFuture.insertUserPermission(userId);
    }
    }
    @future
    public static void insertUserPermission(Set<Id> userId){
		Id permissionId = [Select Id from PermissionSet where Name = 'Sales_User_Permissions'].Id;
        for(Id obj:userId){
            PermissionSetAssignment psa = new PermissionSetAssignment(PermissionSetId = permissionId, AssigneeId = obj);
			insert psa;
           
        }
    }
    public static void insertUserToPublicGroup(List<User> newUsers){
        Group allUserGroup = [Select Id, Name from Group where DeveloperName = 'All_Users'];
        List<GroupMember> groupMembers = new List<GroupMember>();
        for(User obj: newUsers){
            groupMembers.add(new GroupMember(GroupId = allUserGroup.Id, UserOrGroupId = obj.Id));
        }
        if(!groupMembers.isEmpty()){
            insert groupMembers;
         }
        
    }
    @future
    public static void insertUsersToChatter(Set<Id> newUsers){
        
    }

}