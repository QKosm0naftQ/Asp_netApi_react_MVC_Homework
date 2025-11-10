export interface ICategoryItem {
    id: string;
    name: string;
    slug: string;
    image: string;
}
export interface ICategoryCreate {
    name: string;
    slug: string;
    imageFile: string;
}