###
There are two types of user accounts we need to think about:

1. Local accounts
2. Accounts on the master server

Every account on the master server may create a game server 
using the createGameServer method.

To connect to the master server, we need to login to the 
master server, and call createGameServer with the url of our 
game server (likely Meteor.absoluteUrl)

When we start this Game Server, we instantiate a Login object 
with our url

###
serverNamePattern = /^[a-z][a-z0-9\-_ ]{1,126}[a-z0-9]$/
serverNameDescription = "Server name must begin and end with a 
  letter, be 128 characters or less, and contain only lower 
  case letters, numbers, dash, space, and underscore characters"

class Uplink
  constructor: (url, name)->
    @url = null
    @connection = null
    @name = null
    name and @setServerName name
    url and @connect url

  connect: (url)->
    if @connection then @connection.disconnect()
    @url = urlz.clean(url)
    @connection = DDP.connect(@url)

  login: (email, password)->
    @connection.call 'login',
      password: password
      user: {email: email}
      (err, res)->
        if err
          console.log 'Uplink Login Error:', err
          throw err

  setServerName: (serverName)->
    unless serverNamePattern.test(serverName)
      throw new Meteor.Error serverNameDescription + ': ' + serverName
    @name = serverName

  createGameServer: ->
    # will fail if we haven't set the name and connection
    @connection.call 'createGameServer', @name, Meteor.absoluteUrl()

# This will be our connection to the main server
# The game server must .connect to www.pixelaether.com
AetherUplink = new Uplink
