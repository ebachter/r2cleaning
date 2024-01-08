### to execute on windows host in powershell as admin
### deleted after restart

### frontend
netsh interface portproxy add v4tov4 listenport=8081 listenaddress=0.0.0.0 connectport=8081 connectaddress=$($(wsl hostname -I).Trim());
netsh advfirewall firewall add rule name=8081 dir=in action=allow protocol=TCP localport=8081;

### backend
netsh interface portproxy add v4tov4 listenport=4000 listenaddress=0.0.0.0 connectport=4000 connectaddress=$($(wsl hostname -I).Trim());
netsh advfirewall firewall add rule name=4000 dir=in action=allow protocol=TCP localport=4000;

### delete entries
netsh interface portproxy delete v4tov4 listenport=8081 listenaddress=0.0.0.0
netsh advfirewall firewall delete rule name=8081

netsh interface portproxy delete v4tov4 listenport=4000 listenaddress=0.0.0.0
netsh advfirewall firewall delete rule name=4000