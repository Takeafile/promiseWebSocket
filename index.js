module.exports = function(ws)
{
  const {CLOSED, CLOSING, CONNECTING, OPEN, readyState} = ws

  switch(readyState)
  {
    case CONNECTING:
      return new Promise(function(resolve, reject)
      {
        function cleanUp()
        {
          ws.removeEventListener('error', onError)
          ws.removeEventListener('open' , onOpen)
        }

        function onError(error)
        {
          cleanUp()
          reject(error)
        }

        function onOpen()
        {
          cleanUp()
          resolve()
        }

        ws.addEventListener('error', onError)
        ws.addEventListener('open' , onOpen)
      })

    case OPEN:
      return Promise.resolve()

    case CLOSING:
      return new Promise(function(_, reject)
      {
        function onClose(error)
        {
          ws.removeEventListener('close', onClose)
          ws.removeEventListener('error', onClose)

          reject(error)
        }

        ws.addEventListener('close', onClose)
        ws.addEventListener('error', onClose)
      })

    case CLOSED:
      return Promise.reject('Connection to signaling server already closed')
  }

  return Promise.reject(`Unknown readyState '${readyState}'`)
}
