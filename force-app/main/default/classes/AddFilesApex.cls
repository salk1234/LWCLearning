public class AddFilesApex {

    @AuraEnabled
    public static List<ContentDocument> getContentDocumentDetails(List<String> documentIds)
     {
       return [SELECT Id, Title FROM ContentDocument WHERE Id IN : documentIds];
    }
    
    @AuraEnabled
    public static void deleteUploadedBaselineFile(String documentId)
     {
       ContentDocument cd = new ContentDocument(Id = documentId);
       delete cd;
    }

    @AuraEnabled
    public static List<Account> searchTemplates(String searchText){
      List<Account> acntList = [SELECT Id, Name,AccountNumber, BillingAddress from Account where Name =: searchText OR AccountNumber =: searchText];
      return acntList;
    }

    @AuraEnabled(cacheable = true)
    public static List<Contact> getContacts(String accountId){
      List<Contact> conList = [SELECT Id, FirstName,LastName,Email, AccountId from Contact where AccountId =: accountId];
      return conList;
    }

}