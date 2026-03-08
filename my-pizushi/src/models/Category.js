export class Category {
    constructor(id, name, slug, image) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.image = image;
    }

    static fromJson(json) {
        return new Category(
            json.id,
            json.name,
            json.slug,
            json.image
        );
    }

    toFormData() {
        const formData = new FormData();
        formData.append("Id", this.id);
        formData.append("Name", this.name);
        formData.append("Slug", this.slug);
        if (this.image instanceof File) {
            formData.append("Image", this.image);
        }
        return formData;
    }
}