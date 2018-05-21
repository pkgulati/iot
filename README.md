# iot
Application to learn and share IOT stuff

# Building 30
12.8496886,77.6659607

# links
Thread sleep?

https://stackoverflow.com/questions/1520887/how-to-pause-sleep-thread-or-process-in-android


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
db.AuthSession.update({},{$set:{'ttl':67737600}},{multi:true})

{"fields":{"jobId":true,"justtime":true,"type":true,"name":true,"locationType":true},"order":"time DESC", "limit":100, "where":{ "name": "shashi"}}

{"fields":{"batteryPercentage":true,"justtime":true,"type":true,"name":true,"locationType":true},"order":"time DESC", "limit":100, "where":{"name": "ajith"}}

{"order":"time DESC", "where":{"name":"funny"}, "fields":{"accuracy":true,"latitude":true, "longitude" :true, "time":true,"justtime":true,"timediff":true,"distance":true, "speed":true, "name":true}}

{"order":"time DESC", "limit":100, "where":{"name":"rama"}}
{"order":"time DESC", "limit":100, "where":{"name":"ajith"}}
{"order":"time DESC", "limit":100, "where":{"name":"praveen"}}

{"order":"time DESC", "limit":100, "where":{"type":"LocationJobIntentEnqueue"}}
LocationJobIntentEnqueue
"fields":{"justtime":true},

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


