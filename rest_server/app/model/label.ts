
export 
class Label {
    public id: number;
    public text: string;
    public x: number;
    public y: number;
    constructor(id=0, text='', x=0, y=0) {
        this.id = id;
        this.text = text;
        this.x = x;
        this.y = y;
    }
}

