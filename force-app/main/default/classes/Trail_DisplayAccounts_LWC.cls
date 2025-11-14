public class Trail_DisplayAccounts_LWC {
    @AuraEnabled
    public static List<Account> getAccountInfo(String searchTerm){
        if(String.isEmpty(searchTerm)){
            System.debug('at line5');
            throw new AuraHandledException('Search Term cannot be empty');
            //return new List<Account>();
        }
        else{
            String searchItem = '%'+searchTerm+'%';
            try{
                List<Account> acntList = [SELECT Id, Name, Website FROM Account WHERE Name LIKE: searchItem];
                return acntList;
            }
            catch(Exception ex){
                System.debug('Exception:::'+ex.getMessage());
                throw new AuraHandledException('An error occured while trying to retrieve the account data.');
            } 
        }
    }
}