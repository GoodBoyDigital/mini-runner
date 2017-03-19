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
 * @class
 * @param {string} name - The function name that will be executed on the listeners added to this MiniRunner.
 * @param {number} [argsLength=0] - Optional number of parameters that the listeners will have passed to them when MiniRunner is dispatched.
 */
function MiniRunner(name, argsLength)
{
    this.targets = [];
    this.priorities = [];
    this._name = name;

    /**
     * Dispatch/Broadcast MiniRunner to all listeners added to the queue.
     * @params {...params} params optional parameters to pass to each listener
     */
    this.dispatch = this.emit = this.run = MiniRunner.generateRun(name, argsLength || 0);
}

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
 * @param {Object} target - The object that will be listening.
 * @param {number} [priority=0] - The priority at which the object will be added.
 */
p.add = function add(target, priority)
{
    if (!target[this._name]) return;

    priority = priority || 0;

    this.remove(target, priority);

    var targets = this.targets.slice();
    var priorities = this.priorities;
    var l = targets.length;

    if (l > 0)
    {
        var i = l;

        while (i--)
        {
            // from end - if next has lower priority, insert now after
            if (priorities[i] < priority)
            {
                targets.splice(i + 1, 0, target);
                priorities.splice(i + 1, 0, priority);
                break;
            }
            // from start - if next has equal priority, insert now before
            else if (priorities[l - (i + 1)] === priority)
            {
                targets.splice(l - (i + 1), 0, target);
                priorities.splice(l - (i + 1), 0, priority);
                break;
            }
        }
    }
    else
    {
        targets.push(target);
        priorities.push(priority);
    }
    this.targets = targets;
};

/**
 * Remove a single listener from the dispatch queue.
 * @param {Object} target - The listener target that you would like to remove.
 */
p.remove = function remove(target)
{
    var index = this.targets.indexOf(target);

    if (index !== -1)
    {
        this.targets.splice(index, 1);
        this.priorities.splice(index, 1);
    }
};

/**
 * Check to see if the listener is already in the MiniRunner
 * @param {Object} target - The listener target that you would like to check.
 */
p.contains = function contains(target)
{
    return this.targets.indexOf(target) !== -1;
};

/**
 * Remove all listeners from the MiniRunner
 */
p.removeAll = function removeAll()
{
    this.targets.length = this.priorities.length = 0;
};

/**
 * True if there are no this MiniRunner contains no listeners
 *
 * @member {boolean}
 * @readonly
 */
Object.defineProperty(p, 'empty', {
    get: function()
    {
        return this.targets.length === 0;
    }
});

MiniRunner.generateRun = function generateRun(name, argsLength)
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
            func = new Function(args, 'var targets = this.targets, i = targets.length; while(i--) targets[i].'+name+'('+args+');');
        }
        else
        {
            /*jslint evil: true */
            func = new Function('var targets = this.targets, i = targets.length; while(i--) targets[i].'+name+'();');
        }

        MiniRunner.hash[key] = func;
    }

    return func;
};


MiniRunner.hash = {};

module.exports = MiniRunner;
