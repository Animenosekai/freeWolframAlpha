async function request(endpoint) {
    try {
        let request = await fetch(endpoint)
        response = await request.json()
        if (response.success) {
            response = response.data
        } else {
            response = null
        }
    } catch {
        response = null
    }
    return response
}