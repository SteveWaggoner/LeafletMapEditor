export
class Map {
    public mapid: number; //primary key

    public mapname: string;
    public censusyear: number;
    public area: string;

    public constructor(mapid:number, mapname:string, censusyear:number, area:string) {
        this.mapid = mapid;
        this.mapname = mapname;
        this.censusyear = censusyear;
        this.area = area;
    }
}
