export default class EventEmitter{
    constructor(){
        this.__events = {}
    }

    on( eventName , eventListener ){
        if( this.__events[eventName] ){
            this.__events[eventName].push( eventListener )
            return
        }

        this.__events[eventName] = [ eventListener ]
    }

    off( eventName , eventListener ){
        eventListener = eventListener || null

        if( typeof this.__events[eventName] === 'undefined' ){
            throw new Error(UnknownEventError(eventName))
        }

        if( eventListener === null ){
            this.__events[eventName] = []
        }else{
            this.__events[eventName] = this.__events[eventName].filter(listener => listener !== eventListener)
        }

        if( this.__events[eventName].length <= 0 ){
            delete this.__events[eventName]
        }
    }

    emit( eventName , eventParameter ){
        if( typeof this.__events[eventName] === 'undefined' || this.__events[eventName] === null ){
            throw new Error(UnknownEventError(eventName))
        }

        this.__events[eventName].forEach(listener => listener(eventParameter))
    }
}

function UnknownEventError( eventName ){
    return `Unknown event (${eventName})`
}