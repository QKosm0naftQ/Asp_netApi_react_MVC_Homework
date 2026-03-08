import React, { useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import './ImageUploader.css';

const ImageUploaderSortable = ({ images, setImages }) => {
    const imageListRef = useRef(null);
    const fileInputRef = useRef(null);
    const imagesRef = useRef(images); // зберігаємо поточний масив

    // завжди актуалізуємо ref до images
    useEffect(() => {
        imagesRef.current = images;
    }, [images]);

    useEffect(() => {
        const sortable = new Sortable(imageListRef.current, {
            animation: 150,
            ghostClass: 'opacity-50',
            onEnd: (evt) => {
                const currentImages = [...imagesRef.current];
                const [moved] = currentImages.splice(evt.oldIndex, 1);
                currentImages.splice(evt.newIndex, 0, moved);
                setImages(currentImages);
            }
        });

        return () => sortable.destroy();
    }, [setImages]); // ⚠️ НЕ `[images, setImages]`

    const handleFiles = (event) => {
        const files = event.target.files;
        const newImages = [];

        Array.from(files).forEach((file) => {
            if (!file.type.startsWith('image/')) return;
            newImages.push( file );
        });

        setImages((prev) => [...prev, ...newImages]);
        fileInputRef.current.value = '';
    };

    const handleDelete = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFiles}
                className="form-control mb-3"
            />
            <div
                ref={imageListRef}
                className="row g-2"
                id="imageList"
            >
                {images.map((img, index) => (
                    <div className="col-3" key={index}>
                        <div className="position-relative">
                            <img
                                src={URL.createObjectURL(img)}
                                alt="preview"
                                className="img-fluid rounded border"
                                style={{ height: '100px', objectFit: 'cover' }}
                            />
                            <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
                                onClick={() => handleDelete(index)}
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUploaderSortable;