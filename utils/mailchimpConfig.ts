// This code is not used in the app, but it's the configuration values for the MailChimp extension
// that I'm saving for later

// do NOT format this file

const memberTagsWatchPath = "users";
const memberTagsWatchConfig = {
  "memberTags": [
    "jobApp", 
    "emailSignUp",
    "contactedMe",
    "appWaitlist",
    "respondedToSurvey",
    "customSubscriptions",
    "contactsContactedMe",
    "customAppWaitlist"
  ],
  "subscriberEmail": "emailAddress"
}

const mergeFieldsWatchPath = "users";
const mergeFieldsWatchConfig = {   
  "mergeFields": {     
    "firstName": "FNAME",     
    "lastName": "LNAME"   
  },   
    "statusField": {     
      "documentPath": "isSubscribed",     
      "statusFormat": "boolean"   
    },   
    "subscriberEmail": "emailAddress" 
}

const memberEventsWatchPath = "users";
const memberEventsWatchConfig = {
  "memberEvents": ["activity"],
  "subscriberEmail": "emailAddress"
}