class ApiError {
    constructor (statuscode = 400 , message = "All field require" , error = null) {
        this.message = message,
        this.statuscode = statuscode,
        this.status = false
        this.error = error
        this.data = null
    }
}

export {ApiError}