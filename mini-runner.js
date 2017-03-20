
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
 */
var MiniRunner = function(name)
{
    this.items = [];
    this._name = name;
};

var p = MiniRunner.prototype;

/**
 * Dispatch/Broadcast MiniRunner to all listeners added to the queue.
 * @params {...params} params optional parameters to pass to each listener
 */
p.emit = function(a0, a1, a2, a3, a4, a5, a6, a7)
{
    if (arguments.length > 8)
    {
        throw 'max arguments reached';
    }

    var items = this.items;
    var name = this._name;

    for (var i = 0, len = items.length; i < len; i++)
    {
        items[i][name](a0, a1, a2, a3, a4, a5, a6, a7);
    }
    return this;
};

/**
 * Alias for `emit`
 */
p.dispatch = p.emit;

/**
 * Alias for `emit`
 */
p.run = p.emit;

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
    if (item[this._name])
    {
        this.remove(item);
        this.items.push(item);
    }
    return this;
};

/**
 * Remove a single listener from the dispatch queue.
 * @param {Object} The listenr that you would like to remove.
 */
p.remove = function(item)
{
    var index = this.items.indexOf(item);

    if (index !== -1)
    {
        this.items.splice(index, 1);
    }
    return this;
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
    return this;
};

/**
 * Remove all references, don't use after this.
 */
p.destroy = function()
{
    this.removeAll();
    this.items = null;
    this._name = null;
};

Object.defineProperties(p, {
    /**
     * `true` if there are no this MiniRunner contains no listeners
     *
     * @member {boolean}
     * @readonly
     */
    empty: {
        get: function()
        {
            return this.items.length === 0;
        }
    },

    /**
     * The name of the runner.
     *
     * @member {string}
     * @readonly
     */
     name: {
        get: function()
        {
            return this._name;
        }
     }
});

module.exports = MiniRunner;
