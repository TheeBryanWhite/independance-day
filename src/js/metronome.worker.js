let interval = null;
let beatsPerMinute = 108;

module.exports = function(self){
    self.addEventListener('message', onReceiveMessage);

    function onReceiveMessage(e){
        switch(e.data){
            case 'start':
                start();
                break;

            case 'stop':
                stop();
                break;
        }
    }

    function start(){
        stop();
        tick();
        setInterval(tick, 60000 / beatsPerMinute / 4);
    }

    function stop(){
        if(interval){
            clearInterval(interval);
            interval = null;
        }
    }

    function tick(){
        self.postMessage('tick');
    }
}
