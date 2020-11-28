self.onmessage = async function( e ){
    let response = await fetch( e.data )
    let result = await response.blob()

    self.postMessage( result )
}