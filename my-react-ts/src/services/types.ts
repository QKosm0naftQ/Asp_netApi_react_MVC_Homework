export interface ICategoryItem {
    id: number;
    name: string;
    slug: string;
    image: string;
}

export interface ICategoryCreate {
    name: string;
    slug: string;
    imageFile: string;
}

export interface ICategoryEdit
{
    id: number;
    name: string;
    slug: string;
    imageFile: string;
}

export interface ICategoryDelete
{
    id: number;
}

export interface ServerError {
    status: number;
    data: {
        errors: Record<string, string[]>;
    };
}

export interface IRegister
{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    imageFile: string;
}