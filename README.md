# Runner
A simple alternative to events, signals and callbacks with an emphasis on performance.
Its like if a signal and callback had a baby.. this is kind of that baby. 

Can be used as an alternative to events / signals. 

# How to use:
```
var onComplete = new Runner('onComplete');

//listenerObject needs to have a 'onComplete' function
onComplete.add(listenerObject);

//emit and all listeners will have their 'onComplete' functions called
onComplete.emit(data);
```

Can be used to execute a funcition on many objects. Handy for games. If you need to update you game elements each frame:

```
var updateRunner = new Runner('update');

// gameItems should all have a 'update' function
updateRunner.add(gameItem1);
updateRunner.add(gameItem2);
updateRunner.add(gameItem3);

// update game elements..
updateRunner.emit();
```
# Features:
- Under the hood it dynamically creates a looping function that is highly optimised. 
- Avoids using 'call' and runs the function directly (which is faster!)
- You can pass parameters when emitting.

Pros:
- Its fast, a lot faster than events and signals.
- Great for when performance matters.
- Its light weight, with a tiny memory footprint (smaller than events and signals)


Cons:
- Not quite as flexible. All listeners / items in the runner must have the correct function name specified within the runners constructor.

# When to use:
In practive I have found the Runner increadibly useful and so thought it would be nice to share with the world. It forms the backbone of the messaging system in our game engine.

If you are calling you signals a lot to a lot of things, then I would considor using this alternative. For most cases, this performace boost is not really important enough to switch from your current fave. 

Think of this as a nice alternative for when speed really counts!


# Benchmarks

coming soon..
