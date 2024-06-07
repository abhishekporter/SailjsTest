
# API Details:
## 1. upload api: 
end point -> POST /upload-csv. 
Expects csvFile as param having value path to csv file to be process. It returns uniqueId as responsed which can be later used to get status of file
## 2. status api: 
end point -> GET /status.
 Expects uniqueId as param having value which was returned during upload process. Throws error if uniqueId is invalid

# Design
Design docs are present in designs directory.
Status api is pretty simple. It fetchs values from db and respnds based on completion Status

Upload api has been broken down in segments where first segments storess fil, reads it and pushes per row task. 

Later cron wakes and does status check.

For further scaling we can add isSuccessfull boolean/ Flag to handle in case for some row the service might have failed.
