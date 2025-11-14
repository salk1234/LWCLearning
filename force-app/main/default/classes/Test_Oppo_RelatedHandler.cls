public class Test_Oppo_RelatedHandler {
    public static void beforeInsertHandler(List<Test_Oppo_related__c> newList){
        for(Test_Oppo_related__c obj : newList ){
            if(obj.Rebate_Eligibility_Field__c == true && obj.Rebate_Eligibility_Start__c == 'Immediately' && obj.Alignment_Effective_Date__c !=null ){
                obj.Rebate_Eligibility_Start_Date__c = obj.Alignment_Effective_Date__c;
            }
            else if(obj.Rebate_Eligibility_Field__c == true && obj.Rebate_Eligibility_Start__c == 'Monthly' && obj.Alignment_Effective_Date__c !=null ) {
                if(obj.Alignment_Effective_Date__c.month()<12){
                    obj.Rebate_Eligibility_Start_Date__c  = date.newInstance(obj.Alignment_Effective_Date__c.year(),obj.Alignment_Effective_Date__c.month()+1,01);
                }
                else if(obj.Alignment_Effective_Date__c.month() == 12) {
                    obj.Rebate_Eligibility_Start_Date__c  = date.newInstance(obj.Alignment_Effective_Date__c.year()+1, 01 ,01);   
                }
                if(obj.Alignment_Effective_Date__c.day() ==01 && obj.Alignment_Effective_Date__c.month() == (Date.today()).month()+1){
                    obj.Rebate_Eligibility_Start_Date__c = obj.Alignment_Effective_Date__c;
                }
            }
            else if(obj.Rebate_Eligibility_Field__c == true && obj.Rebate_Eligibility_Start__c == 'Quarterly' && obj.Alignment_Effective_Date__c!=null){
                Date startDate = [Select StartDate from Period where Type = 'Quarter' and StartDate >: obj.Alignment_Effective_Date__c ORDER BY StartDate limit 1].StartDate;
                obj.Rebate_Eligibility_Start_Date__c = startDate;
                Date startDay = [Select StartDate, EndDate From Period where Type = 'Quarter' and StartDate = NEXT_FISCAL_QUARTER].StartDate;
                if(obj.Alignment_Effective_Date__c == startDay){
                    obj.Rebate_Eligibility_Start_Date__c = obj.Alignment_Effective_Date__c;
            	}
            }
       }
    }
    public static void beforeUpdateHandler(List<Test_Oppo_related__c> newList, Map<Id,Test_Oppo_related__c> o){
        System.debug('Before Update Handler');
        for(Test_Oppo_related__c obj : newList){
        if(obj.Rebate_Eligibility_Field__c == true && obj.Rebate_Eligibility_Start__c == 'Immediately' && obj.Rebate_Eligibility_Start__c != o.get(obj.Id).Rebate_Eligibility_Start__c && obj.Alignment_Effective_Date__c !=null ){
            obj.Rebate_Eligibility_Start_Date__c = obj.Alignment_Effective_Date__c;
        }
        else if(obj.Rebate_Eligibility_Field__c == true && obj.Rebate_Eligibility_Start__c == 'Monthly' && obj.Rebate_Eligibility_Start__c != o.get(obj.Id).Rebate_Eligibility_Start__c  && obj.Alignment_Effective_Date__c !=null ) {
            if(obj.Alignment_Effective_Date__c.month()<12){
                obj.Rebate_Eligibility_Start_Date__c  = date.newInstance(obj.Alignment_Effective_Date__c.year(),obj.Alignment_Effective_Date__c.month()+1,01);
            }
            else if(obj.Alignment_Effective_Date__c.month() == 12) {
                obj.Rebate_Eligibility_Start_Date__c  = date.newInstance(obj.Alignment_Effective_Date__c.year()+1, 01 ,01);   
            }
            if(obj.Alignment_Effective_Date__c.day() ==01 && obj.Alignment_Effective_Date__c.month() == (Date.today()).month()+1){
                obj.Rebate_Eligibility_Start_Date__c = obj.Alignment_Effective_Date__c;
            }
        }
        else if(obj.Rebate_Eligibility_Field__c == true && obj.Rebate_Eligibility_Start__c == 'Quarterly' && obj.Rebate_Eligibility_Start__c != o.get(obj.Id).Rebate_Eligibility_Start__c  && obj.Alignment_Effective_Date__c!=null){
            Date startDate = [Select StartDate from Period where Type = 'Quarter' and StartDate >: obj.Alignment_Effective_Date__c ORDER BY StartDate limit 1].StartDate;
            obj.Rebate_Eligibility_Start_Date__c = startDate;
            Date startDay = [Select StartDate, EndDate From Period where Type = 'Quarter' and StartDate = NEXT_FISCAL_QUARTER].StartDate;
            if(obj.Alignment_Effective_Date__c == startDay){
                obj.Rebate_Eligibility_Start_Date__c = obj.Alignment_Effective_Date__c;
            }
        }
        }
    }
}