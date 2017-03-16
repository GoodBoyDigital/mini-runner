
//custom object that dispatch a `started` signal
var myObject = {
  started : new signals.Signal()
};
function onStarted(param1, param2){
  alert(param1 + param2);
}
myObject.started.add(onStarted); //add listener
myObject.started.dispatch('foo', 'bar'); //dispatch signal passing custom parameters
myObject.started.remove(onStarted); //remove a single listener

/**
 * A Runner is a highly performant and simple alternative to signals. Best used in situations
 * where events are dispatched to many objects at high frequency (say every frame!)
 *
 *
 * like a signal..
 * ```
 * var myObject = {
 *     loaded : new Runner('loaded')
 * }
 *
 * var listener = {
 *     loaded : function(){
 *         // thin
 *     }
 * }
 *
 * myObject.update.add(listener);
 *
 * myObject.loaded.emit();
 * ```
 *
 * Or for handling calling the same function on many items
 * ```
 * var myGame = {
 *     update : new Runner('update')
 * }
 *
 * var gameObject = {
 *     update : function(time){
 *         // update my gamey state
 *     }
 * }
 *
 * myGame.update.add(gameObject1);
 *
 * myGame.update.emit(time);
 * ```
 *
 * @param {string} the function name that will be executed on the listeners added to this runner.
 */
var Runner = function(name)
{
    this.items = [];
    this._name = name;

    /**
     * Dispatch/Broadcast Runner to all listeners added to the queue.
     * @params {...params} params optional parameters to pass to each listener
     */
    this.dispatch = this.emit = this.run = Runner.generateRun(name, argsLength);
}

var p = Runner.prototype;

/**
 * Add a listener to the runner
 *
 * Runners do not need to have scope or functions passed to them.
 * All that is required is to pass the listening object and ensure that it has contains a function that has the same name
 * as the name provided to the runner when it was created.
 *
 * Eg A listener passed to this runner will require a 'complete' function.
 *
 * ```
 * var complete = new Runner('complete');
 * ```
 *
 * The scope used will be the object itself.
 *
 * @param {Object} The object that will be listening.
 */
p.add = function(item)
{
    if(!item[this._name])return;

    this.remove(item);
    this.items.push(item);
}

/**
 * Remove a single listener from the dispatch queue.
 * @param {Object} The listenr that you would like to remove.
 */
p.remove = function(item)
{
    const index = this.items.indexOf(item);

    if(index !== -1)
    {
        this.items.splice(index, 1);
    }
}

/**
 * Check to see if the listener is already in the runner
 * @param {Object} The listener that you would like to check.
 */
p.contains = function(item)
{
    return this.items.indexOf(item) !== -1;
}

/**
 * Remove all listeners from the runner
 */
p.removeAll = function()
{
    this.items.length = 0;
}

/**
 * true if there are no this runner contains no listeners
 *
 * @member {boolean}
 * @readonly
 */
Object.defineProperty(p, 'empty', {
    get: function()
    {
        return this.items.length === 0;
    }
});

Runner.generateRun(name, argsLength)
{
    const key = name + '|' + argsLength;

    let func = Runner.hash[key];

    if(!func)
    {
        if(argsLength > 0)
        {
            let args = 'arg0';

            for(let i = 1; i < argsLength; i++)
            {
                args += ',arg'+i;
            }

            func = new Function(args,  'var items = this.items; for(var i=0;i<items.length;i++){ items[i].'+name+'('+args+'); }');
        }
        else
        {
            func = new Function('var items = this.items; for(var i=0;i<items.length;i++){ items[i].'+name+'(); }');
        }

        Runner.hash[key] = func;
    }

    return func;
}


Runner.hash = {};
