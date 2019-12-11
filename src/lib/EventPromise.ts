import EventEmitter from "eventemitter3";

enum EventStates {
    "READY"  = "READY",
    "WAITING" = "WAITING"
}

export default class EventPromise {
    private ee =  new EventEmitter();
    private events : {[key: string]:  EventStates} = {};
    private eventsLastResult : {[key: string]: any} = {};

    once(eventName: string) {
        return new Promise((resolve, reject) =>  {
            if (this.events[eventName] != EventStates.READY){
                this.events[eventName] = EventStates.WAITING;
                this.ee.once(eventName, (res)=>{
                    this.events[eventName] =  EventStates.READY;
                    this.eventsLastResult[eventName] =  res;
                    resolve(res);
                })
            } else {
                resolve(this.eventsLastResult[eventName])
            }
        });
    }

    emit(eventName: string, ...args: any[]){
        this.ee.emit(eventName,  ...args)
    }
}
