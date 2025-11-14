/**
* @File Name : dynamicContactViewerCntrl.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : November 11, 2025
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | November 11, 2025 |   | Initial Version
**/

public class dynamicContactViewerCntrl {
	@AuraEnabled(cacheable=true)
	public static List<Account> getAccounts(){
		return [Select Id, Name, Industry from Account WITH SECURITY_ENFORCED ORDER BY CreatedDate desc];
	}
	@AuraEnabled(cacheable=false)
	public static List<Contact> getContacts(String acntId){
		if(acntId != ''){
			return [Select Id, FirstName, LastName, Phone, Email from Contact where AccountId =: acntId WITH SECURITY_ENFORCED];
		}
		else{
			return new List<Contact>();
		}
	}
}