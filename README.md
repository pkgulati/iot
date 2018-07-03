# iot
Application to learn and share IOT stuff

## Optimize
1. Simple Periodic like every 6 or 8 hours
2. Day time Periodic 
3. FCM Immediate
4. 5,15 mins after FCM, if moving, then every 15 mins, till long stationary

# Building 30
12.8496886,77.6659607
"type" : {"nin" : ["FCMResponse", "TeamApplication", "FCMJobFinish", "WifiJob", "FCMJobStart"]} 

// using 
{"fields":{"name":true, "justtime":true},"order":"time DESC", "limit":100,  "where":{"name": {"nin":["locadmin","praveen", "ajith"]} ,"type": "MainActivity"}}

{"order":"time DESC", "limit":100}

{"order":"smsTime DESC", "limit":100}

{"order":"time DESC", "limit":100, "where":{"type":"SwipeLocationResult"}}

{"fields":{"jobs":true,"type":true, "name":false, "jobName":true,"latitude":false, "provider":false, "accuracy":false, "longitude":false, "jobId":true, "time":false, "batteryPercentage" : true, "justtime":true},"order":"time DESC", "limit":100, "where":{"name":"xyz"}}

{"fields":{"jobs":true,"type":true, "name":true, "jobName":true,"latitude":true, "provider":true, "accuracy":true, "longitude":true, "jobId":true, "time":true, "batteryPercentage" : true, "justtime":true},"order":"time DESC", "limit":100, "where":{"name":"xyz"}}

{"fields":{"jobs":true,"type":true, "name":true, "jobName":true,"latitude":true, "provider":true, "accuracy":true, "longitude":true, "jobId":true, "time":true, "batteryPercentage" : true, "justtime":true},"order":"time DESC", "limit":100, "where":{"jobId": 23,"name":"xyz", "locationType": "IdleJob"}}


{"fields":{"jobs":true,"baseLocationDistance":false, "baseLocationAccuracy" : false, "jobId":true, "yyyymmdd":false, "speed":false, "accuracy":true, "provider":true,"justtime":true,"type":true,"name":true,"locationType":true}, "order":"time DESC", "limit":100, "where":{"userId":"5b1f90a7f26a18280968a567" }}

{"fields":{"jobs":true,"baseLocationDistance":true, "baseLocationAccuracy" : true, "jobId":true, "yyyymmdd":false, "speed":true, "accuracy":true, "provider":true,"justtime":true,"type":true,"name":true,"locationType":true}, "order":"time DESC", "limit":100, "where":{"userId":"5b1f90a7f26a18280968a567" }}


{"fields":{"jobId":true, "yyyymmdd":false, "speed":false, "accuracy":false, "provider":false,"justtime":true,"type":true,"name":false,"locationType":true}, "order":"time DESC", "limit":100, "where":{"name":"praveen" }}


{"fields":{"jobId":false, "yyyymmdd":false, "speed":false, "accuracy":false, "provider":false,"justtime":true,"type":true,"name":false,"locationType":true}, "order":"time DESC", "limit":100, "where":{"name":"shashi" ,  "type" : {"nin" : ["FCMResponse", "TeamApplication", "FCMJobFinish", "WifiJob", "FCMJobStart"]}  }}


{"fields":{"jobId":true, "yyyymmdd":true, "speed":true, "accuracy":true, "provider":true,"justtime":true,"type":true,"name":false,"locationType":true},"order":"time DESC", "limit":100, "where":{  "name":"xyz" }}

{"fields":{"jobId":false, "yyyymmdd":false, "speed":true, "accuracy":true, "provider":true,"justtime":true,"type":true,"name":false,"locationType":true}, "order":"time DESC", "limit":100, "where":{"name":"shashi" ,  "type" : {"nin" : ["FCMResponse", "TeamApplication", "FCMJobFinish", "WifiJob", "FCMJobStart"]}  }}

"fields":{"jobId":true, "yyyymmdd":true, "speed":true, "accuracy":true, "provider":true,"justtime":true,"type":true,"name":false,"locationType":true}

{"order":"time DESC", "limit":100, "where":{"name":"shashi" ,  "type" : {"nin" : ["FCMResponse", "TeamApplication", "FCMJobFinish", "WifiJob", "FCMJobStart"]}  }}

"locationType": {"inq" : ["PeriodicJob", "LocationJob"]}

 , "type" : {"nin" : ["FCMResponse", "TeamApplication", "FCMJobFinish", "FCMJobStart"]}

# Algo
1. If At Home and night -> Schedule Next Day morning
2. If At Office then periodic 1 hour till 5PM 


# links
Thread sleep?

https://stackoverflow.com/questions/1520887/how-to-pause-sleep-thread-or-process-in-android

https://us-east-2.console.aws.amazon.com/ec2/v2/home?region=us-east-2&state=hashArgs%23


{"fields":{"speed":true,"provider":true,"jobId":true, "justtime":true,"type":true,"name":true, "text":true, "locationType":true},"order":"time ASC", "limit":200, "where":{ "time":{"between": [1528915314506,1528965414506]},  "name": "rama"}}

###
FCM Request -> Job/Service
Request Received : All Requests ASAP 
============================================
PushJob     [just one network location]
Server decides 
[L1, L2, L3], [default 1 hour fallbackjob]

================================
Periodic Job  [parameter]
[Server decides location job L1, L2, L3]

Alarm Service
[Job Or Service]

##
FCM Foreground Service / OR FCM


# Android App
Data Refresh : Upon FCM receive 

Sending Location :
    User Triggered      :
    
    Periodic            :
   
    On Demand           : 
            Override previous demands
            Collect demands

Calling startService() multiple times does not result in starting multiple service.

adb shell input keyevent 3 // Home btn
adb shell input keyevent 4 // Back btn
adb shell input keyevent 5 // Call
adb shell input keyevent 6 // End call
adb shell input keyevent 26  // Turn Android device ON and OFF. It will toggle device to on/off status.
adb shell input keyevent 27 // Camera
adb shell input keyevent 64 // Open browser
adb shell input keyevent 66 // Enter
adb shell input keyevent 67 // Delete (backspace)
adb shell input keyevent 207 // Contacts
adb shell input keyevent 220 / 221 // Brightness down/up
adb shell input keyevent 277 / 278 /279 // Cut/Copy/Paste


The Doze mode states:

ACTIVE: Device is currently active.
INACTIVE: Device is inactive (screen off, no motion) and we are waiting to for idle.
IDLE_PENDING: Device is past the initial inactive period, and waiting for the next idle period.
SENSING: Device is currently sensing motion.
LOCATING: Device is currently finding location (and may still be sensing).
IDLE: Device is in the idle state, trying to stay asleep as much as possible.
IDLE_MAINTENANCE: Device is in the idle state, but temporarily out of idle to do regular maintenance.

Now we can trigger Doze mode via
 adb shell dumpsys deviceidle step

adb shell dumpsys deviceidle unforce


```
adb shell dumpsys battery unplug
adb shell am set-inactive com.example.kpraveen.myteam true

adb shell am set-inactive com.example.kpraveen.myteam false

adb shell am get-inactive com.example.kpraveen.myteam 


```

```
db.AuthSession.update({},{$set:{'ttl':167737600}},{multi:true})

db.Contact.update({},{$set:{"autofcm":false}}, {multi:true})

db.Contact.update({"ownerUserId":"5acb3b12146ca8f84d18a8ac"},{$set:{"autofcm":true}}, {multi:true})

m06L7Mr2Mj0tgHV3RaIVae31xAmB0bUCtpQutDBcKFlBxBJVLQvJAnvffDbiUwpK

db.UserConfiguration.update({},{$set:{"isTestUser":false}}, {multi:true})

db.UserConfiguration.update({},{$set:{"periodicJobInterval": 2700000}}, {multi:true})


{
  "title": "",
  "body": "",
  "type": "scheduleJob",
  "data": {
"jobName" : "LocationJob",
"jobId" : "901",
"time" : "1529253200000"
},
  "highPriority": true,
  "userId": "5acb3b1a146ca8f84d18a8b2"
}


22:56
{
  "title": "",
  "body": "",
  "type": "scheduleJob",
  "data": {
"jobName" : "LocationJob",
"jobId" : "905",
"time" : "1529256400000"
},
  "highPriority": true,
  "userId": "5acb3b1a146ca8f84d18a8b2"
}

906
1529258400000 :  11:30

1529260000000 : 23:56


important fields

{"fields":{"jobId":true, "yyyymmdd":true, "speed":true, "accuracy":true, "provider":true,"justtime":true,"type":true,"name":false,"locationType":true},"order":"time DESC", "limit":100, "where":{  "name":"xyz"}

```

"type": {"non":["FCMJobFinish", "FCMResponse", "FCMJobStart ]}

### wifijob
{"fields":{"jobId":true, "yyyymmdd":true, "speed":true, "accuracy":true, "provider":true,"justtime":true,"type":true,"name":true,"locationType":true},"order":"time DESC", "limit":100, "where":{  "type": "WifiJob" }}




### query

```
"fields":{"justtime":true, "speed":true, "averageSpeed":true, "provider":true, "longitude":true, "accuracy":true},

"fields":{"justtime":true, "batteryPercentage":true},

"fields":{"justtime":true, "type":true, "name":true},

"fields":{"justtime":true, "startedBy":true, "type":true}

"type" : {"nin" : ["LocationResult", "LocationJobResult"]},

"type" : {"inq" : ["LocationResult", "LocationJobResult"]},

2700000

locationAge

{"fields":{"locationServiceTotalTime":true,"name":true,"id":true}}

{"fields":{"jobId":true,"justtime":true,"type":true,"name":true,"locationType":true},"order":"time DESC", "limit":100, "where":{ "name": "shashi"}}

{"fields":{"batteryPercentage":true,"justtime":true,"type":true,"name":true,"locationType":true},"order":"time DESC", "limit":100, "where":{"name": "ajith"}}

{"order":"time DESC", "where":{"name":"funny"}, "fields":{"accuracy":true,"latitude":true, "longitude" :true, "time":true,"justtime":true,"timediff":true,"distance":true, "speed":true, "name":true}}



{"order":"time DESC", "limit":100, "where":{"name":"rama"}}
{"order":"time DESC", "limit":100, "where":{"name":"ajith"}}
{"order":"time DESC", "limit":100, "where":{"name":"shashi"}}
{"order":"time DESC", "limit":100, "where":{"name":"praveen"}}

{"fields":{"jobId":true,"justtime":true,"type":true,"name":true,"locationType":true},"order":"time DESC", "limit":100, "where":{  "name":"praveen"}}

"fields":{"speed":true,"provider":true,"jobId":true, "justtime":true,"type":true,"name":true, "text":true, "locationType":true}


"time":{"between": [1528915314506,1528935314506]}}

{"fields":{"speed":true,"provider":true,"jobId":true, "justtime":true,"type":true,"name":true, "text":true, "locationType":true},"order":"time DESC", "limit":100, "where":{ "type": {"nin" : ["LocationResult","ViewContact","StopViewContact"]}, "name":"ajith"}}

{"fields":{"speed":true,"provider":true,"jobId":true, "justtime":true,"type":true,"name":true, "text":true, "locationType":true},"order":"time DESC", "limit":100, "where":{ "time":{"between": [1528915314506,1528935314506]}}}

{
  "type": "InformationUpdateRequest",
  "highPriority": true,
  "userId": "5af1cf9d67bd14e24e2f8b3d"
}

{
  "type": "startWifiJob",
  "highPriority": true,
  "userId": "5acb3b18146ca8f84d18a8b0"
}

{"fields":{"speed":true,"provider":true,"jobId":true, "justtime":true,"type":true,"name":true, "text":true, "locationType":true},"order":"time ASC", "limit":100, "where":{ "time":{"between": [1528915314506,1528949314506]},  "name": "rama"}}


{"order":"time DESC", "limit":100, "where":{"name":"AlarmService"}}

{"order":"time DESC", "limit":100, "where":{"name":"AlarmService"}}

{"where":{"useJobForFCM":true, "useLocationService":true}}

{"fields":{"name":true,"id":true},"where":{"useLocationServiceForFCM":{"inq":[false,true]}}}


{"fields":{"name":true,"id":true},"where":{"useJobForFCM":true}}

between: [1528915314506,1528935314506]

{"fields":{"jobId":true,"justtime":true,"type":true,"name":true,"locationType":true},"order":"time DESC", "limit":100, "where":{ "type": "NetworkJobEnd"}}

db.ActivityArchive.find({"type":"LocationResult", "hasSpeed":true, "name" : "praveen" , time : { $gte:ISODate("2018-05-24T01:15:35.449Z"), $lt: ISODate("2018-05-24T11:15:35.449Z")}}, {time:1, speed:1, _id:0})


db.ActivityArchive.find({"type":"LocationResult",  "name" : "praveen" ,time : { $gte:ISODate("2018-05-24T01:15:35.449Z"), $lt: ISODate("2018-05-24T11:15:35.449Z")}}, {justtime:1, speed:1, _id:0}).sort({time:1})


time : {
$gte:ISODate("2018-05-24T01:15:35.449Z"),
        $lt: ISODate("2018-05-24T11:15:35.449Z")
}

        ISODate("2018-05-02T02:15:35.449Z")


{"order":"time DESC", "limit":100, "where":{"type":"LocationJobIntentEnqueue"}}
LocationJobIntentEnqueue
"fields":{"justtime":true},


{ "android": { "priority": "high" },
  "data": 
   { "type": "cancelJobs"
     },
  "token": "c3R4e3vzZ90:APA91bFSEQN0AgwnjQKl5dC1MMP5BWC4FNWKjujdSiYZ_ifD28VphggFgU9qNUw954Mt7Xm4RMbDAa2vfawnChybG6QS_EXPO8i78l3B34j1cdMFkdluI4Hf3dqnuAG7V84k5vfMDV1W" }


"fields":{"justtime":true,"type":true,"name":true,"locationType":true},
{"fields":{"justtime":true},"order":"time DESC", "limit":500, "where":{"name":"praveen", "type": "LocationResult"}}

{"order":"time DESC", "limit":500, "where":{    "deviceManufacturer": "OnePlus"}}

{"order":"time DESC", "limit":500, "where":{   "deviceModel": "E5563"  }}

"deviceModel": "SM-J730GM",
 "deviceModel": "ONEPLUS A5000",
  "deviceModel": "E5563",
     "deviceModel": "SM-G930F",

{"order":"time DESC", "limit":500, "where":{    "latitude": 0}}


{"order":"time DESC", "limit":100, "where":{"name": "praveen","locationJob":"LocationStickyService"}}

{"order":"time DESC", "limit":100, "where":{"type": "WakeLockAlarm"}}

"type": "WakeLockAlarm",
```

# inside a building 
```
{"latitude":12.9168067,"longitude":77.5857619,"name":"praveen","currentTime":1525526145137,"locationTime":1525526145115,"time":1525526145137,"type":"LocationResult","pkgtype":"NonStickyLocationService","gpsRequest":true,"hasSpeed":false,"provider":"fused","accuracy":699.9990234375,"justtime":"18:45:45"}
```

## Links

https://medium.com/@mohitgupta_87777/testing-your-app-on-doze-mode-4ee30ad6a3b0



###########
Network Job
Dynamic Period
Does not use GPS
Main two purpose
It can help save battery....
It can help if FCM is not working...
Job1 and Job2 approach Simply meant for X hour to Y hour periodic..
If base location has changed can schedule GPSJob / LocationJob
================
AlarmService : Meant for starting frequent check of location for morning and evening peak hours...
Can run LocationJob
================
FCM Based on ViewContact
At contact level you can have a flag to decide whether GPS is allowed or not
Server side can send Network/GPS/Both Wait Yes/No
setExtras





