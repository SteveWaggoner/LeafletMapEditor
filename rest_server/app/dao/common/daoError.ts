
export 
class DaoError {
    public errorCode:string;
    public message:string;
    constructor(errorCode, message) {
        this.errorCode = errorCode;
        this.message = message;
    }
}

