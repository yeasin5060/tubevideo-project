class ApiResponse {
    constructor ( statuscode , message , data = []) {
        this.statuscode = statuscode,
        this.message = message,
        this.data = data
        this.statuscode = statuscode < 300
    };
};

export {ApiResponse}