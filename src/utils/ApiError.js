class ApiError {
    constructor (statuscode , message  , error = null) {
        this.message = message,
        this.statuscode = statuscode,
        this.status = false
        this.error = error
        this.data = null
    };
};

export {ApiError}