var actionEventsService = (function(){

    var self = (function (){
        this.subscribers = {};
        return this;
    }());

    self.getPossibleActions = function(actionCntrl){
        var actionNames = Object.keys(actionCntrl);
        for(var i = 0; i < actionNames.length; i++){
            if (validator.validateFunction(actionCntrl[actionNames[i]])){
                self.subscribers[actionNames[i]] = [];
            }
        }
    };

    function updateSubscribers(actionName, model){
        if(!actionName){
            return;
        }
        if (model){
            if(model.id){
                var modelId = model.id;
                if(!self.subscribers[actionName][modelId]){
                    self.subscribers[actionName][modelId] = [];
                }
                return self.subscribers[actionName][modelId];
            }
            var modelName = model.name;
            if(!self.subscribers[actionName][modelName]){
                self.subscribers[actionName][modelName] = [];
            }
            return self.subscribers[actionName][modelName];
        }else if(!self.subscribers[actionName]){
            self.subscribers[actionName] = [];
        }
        return self.subscribers[actionName];
    }

    // actionName - the name of the function that triggers the event
    // model - the model that executes the above (actionName) - optional
    // action - the function to be executed at the event occurrence
    // params - params for the 'action'
    self.addSubscriberToActionEvent = function(actionName, action, params, model){
        var queue = updateSubscribers(actionName, model);
        if (action && validator.validateFunction(action)){
            queue.push({
                action: action,
                params: params
            });
        }
    };

    self.triggerActionEventSubscribers = function(actionName, model){
        var eventSubscribers = updateSubscribers(actionName, model);
        while(eventSubscribers.length > 0){
            var obj = eventSubscribers.shift();
            var action = obj.action;
            var params = obj.params;
            validator.validateFunction(action);
            action(params[0], params[1], params[2], params[3], params[4], params[5], params[6]);
        }
    };

    return self;
}());