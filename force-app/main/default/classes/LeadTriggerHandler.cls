public class LeadTriggerHandler {
    public static void beforeUpdateHandler(List<Lead> leadRec){
        for(Lead obj:leadRec){
            obj.Status = 'Working - Contacted';
            if(obj.Industry == 'Healthcare'){
                obj.LeadSource ='Purchased List';
                obj.SICCode__c = '1100';
                obj.Primary__c = 'Yes';
            }
        }
    }
    public static void handlerBeforeUpdate(List<Lead> leadRec){
        for(Lead obj: leadRec){
            if(obj.CreatedDate <= System.today()-8){
                obj.addError('Lead record is created a week ago, Updates are not allowed');
            }
        }
    }
    public static void beforeDeleteHandler(List<Lead> leadRec){
        for(Lead obj : leadRec){
            if(obj.Status == 'Working - Contacted'){
                obj.addError('You  cannot delete a lead in progress');
            }
        }
    }
    public static void afterInsertHandler(List<Lead> leadRec){
        List<Task> taskList = new List<Task>();
        for(Lead obj : leadRec){
            Task tk = new Task(OwnerId = obj.OwnerId,
                                 Description = 'Follow up with the customer',
                                  Status = 'Not Started',
                                  Subject = 'Follow Up mail',
                                  WhoId = obj.Id);
            taskList.add(tk);            
        }
        if(!taskList.isEmpty()){
            insert taskList;
        }
    }
    

}