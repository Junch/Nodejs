# http://stackoverflow.com/questions/8965855/coffeescript-when-to-use-fat-arrow-over-arrow-and-vice-versa

class A
	constructor: (@msg) ->
	thin: -> console.log @msg
	fat: => console.log @msg

x = new A("yo")
x.thin()   # "yo"
x.fat()    # "yo"

fn = (callback) -> callback()

fn(x.thin) # "undefined"
fn(x.fat)  # "yo"
fn(-> x.thin())  #"yo"
