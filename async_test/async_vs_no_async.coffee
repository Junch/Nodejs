fs = require('fs')
async = require('async')

load_file_contents = (path, callback) ->
    fs.open path, 'r', (err, f) ->
        if err
            callback err
            return
        else if (!f)
            callback {error: "invalid_handle", message: "bad file handle from fs.open"}
            return

        fs.fstat f, (err, stats) ->
            if err
                callback err
                return

            if stats.isFile
                b = new Buffer 10000
                fs.read f, b, 0, 10000, null, (err, br, buf) ->
                    if err
                        callback err
                        return

                    fs.close f, (err) ->
                        if (err)
                            callback err
                            return
                        callback null, b.toString 'utf8', 0, br
            else
                callback make_error 'not_file', "Can't load directory"
                return

load_file_contents2 = (path, callback) ->
    f = null

    async.waterfall [
        (cb) ->
            fs.open path, 'r', cb

        (handle, cb) ->
            f = handle
            fs.fstat f, cb

        (stats, cb) ->
            b = new Buffer 10000
            if stats.isFile
                fs.read f, b, 0, 10000, null, cb
            else
                callback make_error 'not_file', "Can't load directory"

        (bytes_read, buffer, cb) ->
            fs.close f, (err)->
                if err
                    cb err
                else
                    cb null, buffer.toString 'utf8', 0, bytes_read
    ],

    (err, file_contents)->
        callback err, file_contents


load_file_contents "test.txt", (err, contents) ->
    if err
        console.log err
    else
        console.log contents

load_file_contents2 "test.txt", (err, contents) ->
    if err
        console.log err
    else
        console.log contents

make_error = (err, msg) ->
    e = new Error msg
    e.code = msg
    return e