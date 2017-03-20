var assert = require('assert');
var sinon = require('sinon');
var MiniRunner = require('../mini-runner');

describe('MiniRunner', function()
{
    it('should should exist', function()
    {
        assert(MiniRunner, 'MiniRunner exists');
        assert.equal(typeof MiniRunner, 'function', 'MiniRunner is a function');
    });

    it('should implement emit', function()
    {
        var complete = new MiniRunner('complete');
        var callback = sinon.spy();
        complete.add({ complete: callback });
        complete.emit();
        assert(callback.called, 'callback called');
        assert(callback.calledOnce, 'called once');
        complete.emit();
        assert(callback.calledTwice, 'called twice');
        complete.emit();
        assert(callback.calledThrice, 'called thrice');
    });

    it('should implement emit with arguments', function()
    {
        var update = new MiniRunner('update');
        var callback = sinon.spy(function(time, delta)
        {
            var len = 0;
            // Count the number of non-undefined arguments
            for (var i = 0; i < arguments.length; i++)
            {
                if (arguments[i] !== undefined)
                {
                    len++;
                }
            }
            assert.equal(len, 2, 'Arguments passed');
            assert.equal(time, 1, 'Argument 1 is passed');
            assert.equal(delta, 2, 'Argument 2 is passed');
        });
        update.add({ update: callback });
        update.emit(1, 2);
        assert(callback.called, 'callback called');
        assert(callback.calledOnce, 'called once');
    });

    it('should throw an error with too many arguments', function()
    {
        var complete = new MiniRunner('complete');
        complete.add({
            complete: function(a, b, c, d, e, f, g, h, i) {}
        });
        try {
            complete.emit(1, 2, 3, 4, 5, 6, 7, 8, 9);
            assert(false, 'Did not catch error');
        }
        catch(e) {
            assert(!!e, 'error reached');
            assert.equal(e.toString(), 'max arguments reached', 'Error message');
        }
    });

    it('should implement multiple targets', function()
    {
        var complete = new MiniRunner('complete');
        var obj = { complete: sinon.spy() };
        var obj2 = { complete: sinon.spy() };
        assert(complete.empty, 'is empty');
        complete.add(obj);
        assert(complete.contains(obj));
        complete.add(obj2);
        assert(complete.contains(obj2));
        complete.emit();
        assert(!complete.empty, 'has items');
        assert(complete.items.length, 2, 'Wrong count');
        assert(obj.complete.called, 'callback called');
        assert(obj.complete.calledOnce, 'called once');
        assert(obj2.complete.called, 'callback called');
        assert(obj2.complete.calledOnce, 'called once');
        complete.remove(obj);
        assert.equal(complete.items.length, 1, 'one item left');
        complete.remove(obj2);
        assert.equal(complete.items.length, 0, 'no items left');
        assert(complete.empty, 'is empty again');
    });

    it('should implement removeAll', function()
    {
        var complete = new MiniRunner('complete');
        var obj = { complete: function() {} };
        var obj2 = { complete: function() {} };
        var obj3 = {};

        complete
            .add(obj)
            .add(obj2)
            .add(obj3);

        assert.equal(complete.items.length, 2, 'do not add item without complete');

        complete.removeAll();
        assert(complete.empty, 'empty');
    });

    it('should not add items more than once', function()
    {
        var complete = new MiniRunner('complete');
        var obj = { complete: function() {} };
        complete.add(obj).add(obj);
        assert.equal(complete.items.length, 1, 'should only be added once');
    });
});
