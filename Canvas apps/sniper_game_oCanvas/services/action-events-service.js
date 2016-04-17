var actionEventsService = (function(){

    var self = (function (){
        this.subscribers = {};
        return this;
    }());

    self.getPossibleActions = function(actionCntrl){
        var actionNames = Object.keys(actionCntrl);
        for(var i = 0; i < actionNames.length; i++){
            if (validator.validateFunction(actionCntrl[actionNames[i]])){
                self.subscribers[actionNames[i]] = {};
                self.subscribers[actionNames[i]].started = [];
                self.subscribers[actionNames[i]].finished = [];
            }
        }
    };

    function updateSubscribers(actionName, isStarting, model){
        var eventListenersSlot;
        if(!actionName){
            return;
        }
        if (model){
            var modelName = model.name;
            if(!self.subscribers[actionName][modelName]){
                self.subscribers[actionName][modelName] = {};
                self.subscribers[actionName][modelName].started = [];
                self.subscribers[actionName][modelName].finished = [];
            }
            eventListenersSlot = isStarting ? self.subscribers[actionName][modelName].started : self.subscribers[actionName][modelName].finished;
        }else{
            eventListenersSlot = isStarting ? self.subscribers[actionName].started : self.subscribers[actionName].finished;
        }

        return eventListenersSlot;
    }

    self.addSubscriberToActionEvent = function(actionName, isStarting, action, params, model){
        var queue = updateSubscribers(actionName, isStarting, model);
        if (action && validator.validateFunction(action)){
            queue.push({
                action: action,
                params: params
            });
        }
    };

    self.triggerActionEventSubscribers = function(actionName, isStarting, model){
        var eventSubscribers = updateSubscribers(actionName, isStarting, model);
        while(eventSubscribers.length > 0){
            var obj = eventSubscribers.pop();
            var action = obj.action;
            var params = obj.params;
            validator.validateFunction(action);
            action(params[0], params[1], params[2], params[3], params[4], params[5], params[6]);
        }
    };

    return self;
}());