
async = require 'async'

async.auto {
    numbers: (callback) ->
        setTimeout ()->
            callback null, [1, 2, 3]
            2000

    strings: (callback) ->
        setTimeout ()->
            callback null, ['a', 'b', 'c']
            2000

    assemble: ['numbers', 'strings', (callback, thus_far)->
        callback null, {
            numbers: thus_far.numbers.join ", "
            strings: "'" + thus_far.strings.join("',  '") + "'"
        }
    ]
}, (err, results) ->
    if err
        console.log(err)
    else
        console.log(results)
