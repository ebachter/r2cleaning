self.addEventListener('message', (event) => {
  // console.log('Worker received:', event.data)
  // return;
  // const msg = JSON.parse(event.data);
  // console.log('Worker received:', event.data)
  const {DOMAIN_WS, authToken} = event.data;
  if (event.data.taskid) {
    this.ws.send(JSON.stringify(event.data));
  }

  if (DOMAIN_WS && authToken) {
    this.ws = new WebSocket(`${DOMAIN_WS}/objects?sessionToken=${authToken}`); // u1:p1@
    // const socket = new WebSocket(`ws://52.59.135.184:8081/?sessionToken=${data.token}`); // u1:p1@

    this.ws.onopen = () => {
      console.log('worker ws connected');
      // console.log('to ws { sendMulti: 1 }')
      ws.send(JSON.stringify({sendMulti: 1}));
    };

    this.ws.onmessage = (e) => {
      // console.log('ws connected');
      // console.log('+++ from worker ws +++', e.data);
      const wsmsg = JSON.parse(e.data);
      // const { sid, value } = wsmsg;

      self.postMessage(wsmsg);

      /* if (wsmsg.type === 'online') {
        self.postMessage({ objectid: sid, on: wsmsg.on });
      }
      if (wsmsg.switch) {
        self.postMessage({ objectid: sid, actorid: wsmsg.switch, stateid: value });
      }*/
    };

    /* socket.onclose = () => {
      console.log('ws disconnected');
    };*/
  }
  // self.postMessage('from Worker 2');
});
// self.postMessage('from Worker');
