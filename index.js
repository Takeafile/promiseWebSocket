export default function(ws)
{
  const {CLOSED, CLOSING, CONNECTING, OPEN, readyState} = ws

  switch(readyState)
  {
    case CONNECTING:
      return new Promise(function(resolve, reject)
      {
        function onError(error)
        {
          ws.removeEventListener('open' , onOpen)
          reject(error)
        }

        function onOpen()
        {
          ws.removeEventListener('error', onError)
          resolve(ws)
        }

        ws.addEventListener('error', onError, {once: true})
        ws.addEventListener('open' , onOpen, {once: true})
      })

    case OPEN:
      return Promise.resolve(ws)

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
      return Promise.reject('Connection to server already closed')
  }

  return Promise.reject(`Unknown readyState '${readyState}'`)
}
