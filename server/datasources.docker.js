var mongoHost = process.env.MONGO_HOST || 'localhost';
module.exports = {
  "db": {
    "host": mongoHost,
    "port": 27017,
    "url": "mongodb://+"+ mongoHost +":27017/commondb",
    "database": "commondb",
    "password": "admin",
    "name": "db",
    "connector": "mongodb",
    "user": "admin",
    "connectionTimeout": 50000
  },
  "appdb": {
    "host": mongoHost,
    "port": 27017,
    "url": "mongodb://+"+ mongoHost +":27017/appdb",
    "database": "appdb",
    "password": "admin",
    "name": "appdb",
    "connector": "mongodb",
    "user": "admin",
    "connectionTimeout": 50000
  },
  "gridfs_db": {
    "host": mongoHost,
    "port": 27017,
    "name": "gridfs_db",
    "url": "mongodb://+"+ mongoHost +":27017/gridfs_db",
    "connector": "loopback-component-storage-mongo"
  }
};