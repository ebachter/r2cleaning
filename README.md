# Cleaning TECH

## Cleaning service

### Prerequisits

```
// Setup typia
cd services/api && yarn prepare
```

### Basic commands

```
docker-compose up
yarn start:all
cd services/nativeapp && npx expo start
yarn build
lerna version
```

## Enable access in the LAN

### Frontend

```
netsh interface portproxy add v4tov4 listenport=8081 listenaddress=0.0.0.0 connectport=8081 connectaddress=$($(wsl hostname -I).Trim());
```

```
netsh advfirewall firewall add rule name=8081 dir=in action=allow protocol=TCP localport=8081;
```

### Backend

```
netsh interface portproxy add v4tov4 listenport=4000 listenaddress=0.0.0.0 connectport=4000 connectaddress=$($(wsl hostname -I).Trim());
```

```
netsh advfirewall firewall add rule name=4000 dir=in action=allow protocol=TCP localport=4000;
```

### Delete entries

```
netsh interface portproxy delete v4tov4 listenport=8081 listenaddress=0.0.0.0
netsh advfirewall firewall delete rule name=8081

netsh interface portproxy delete v4tov4 listenport=4000 listenaddress=0.0.0.0
netsh advfirewall firewall delete rule name=4000
```

### Show info

```
netsh interface portproxy show all
```

### localstack is used for localdevelopment of AWS services

List of available services: http://localhost:4566/health
