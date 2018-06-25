export interface PhotoModel{
    id: number;
    owner: string;
    title: string;
    dateupload: number | Date;
    ownername: string;
    tags: string;
    latitude: number;
    longitude: number;
    place_id: string;
    url_m: string;
}
