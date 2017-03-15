

export default class Runner
{
    /**
     * This is a new slightly different take on a sort of a callback list.
     * Its real fast.. faster than signals and event emitters...
     *
     * @type {[type]}
     */
    constructor(name, argsLength = 0)
    {
        this.items = [];
        this._name = name;
        this.dispatch = this.emit = this.run = Runner.generateRun(name, argsLength);
    }

    add(item)
    {
        if(!item[this._name])return;

        this.remove(item);
        this.items.push(item);
    }

    remove(item)
    {
        const index = this.items.indexOf(item);

        if(index !== -1)
        {
            this.items.splice(index, 1);
        }
    }

    contains(item)
    {
        return this.items.indexOf(item) !== -1;
    }

    removeAll()
    {
        this.items.length = 0;
    }

    get empty()
    {
        return this.items.length === 0;
    }

    static generateRun(name, argsLength)
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
}

Runner.hash = {};
