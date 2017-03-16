
/**
 * A MiniRunner is a highly performant and simple alternative to signals. Best used in situations
 * where events are dispatched to many objects at high frequency (say every frame!)
 *
 *
 * like a signal..
 * ```
 * var myObject = {
 *     loaded : new MiniRunner('loaded')
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
 *     update : new MiniRunner('update')
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
 * @param {string} name the function name that will be executed on the listeners added to this MiniRunner.
 * @param {number} argsLength optional number of parameters that the listeners will have passed to them when MiniRunner is dispatched.
 */
var MiniRunner = function(name, argsLength)
{
    this.items = [];
    this._name = name;

    /**
     * Dispatch/Broadcast MiniRunner to all listeners added to the queue.
     * @params {...params} params optional parameters to pass to each listener
     */
    this.dispatch = this.emit = this.run = MiniRunner.generateRun(name, argsLength||0);
};

var p = MiniRunner.prototype;

/**
 * Add a listener to the MiniRunner
 *
 * MiniRunners do not need to have scope or functions passed to them.
 * All that is required is to pass the listening object and ensure that it has contains a function that has the same name
 * as the name provided to the MiniRunner when it was created.
 *
 * Eg A listener passed to this MiniRunner will require a 'complete' function.
 *
 * ```
 * var complete = new MiniRunner('complete');
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
};

/**
 * Remove a single listener from the dispatch queue.
 * @param {Object} The listenr that you would like to remove.
 */
p.remove = function(item)
{
    var index = this.items.indexOf(item);

    if(index !== -1)
    {
        this.items.splice(index, 1);
    }
};

/**
 * Check to see if the listener is already in the MiniRunner
 * @param {Object} The listener that you would like to check.
 */
p.contains = function(item)
{
    return this.items.indexOf(item) !== -1;
};

/**
 * Remove all listeners from the MiniRunner
 */
p.removeAll = function()
{
    this.items.length = 0;
};

/**
 * true if there are no this MiniRunner contains no listeners
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

MiniRunner.generateRun = function(name, argsLength)
{
    var key = name + '|' + argsLength;

    var func = MiniRunner.hash[key];

    if(!func)
    {
        if(argsLength > 0)
        {
            var args = 'arg0';

            for(var i = 1; i < argsLength; i++)
            {
                args += ',arg'+i;
            }

            /*jslint evil: true */
            func = new Function(args,  'var items = this.items; for(var i=0;i<items.length;i++){ items[i].'+name+'('+args+'); }');
        }
        else
        {
            /*jslint evil: true */
            func = new Function('var items = this.items; for(var i=0;i<items.length;i++){ items[i].'+name+'(); }');
        }

        MiniRunner.hash[key] = func;
    }

    return func;
};


MiniRunner.hash = {};

module.exports = MiniRunner;
