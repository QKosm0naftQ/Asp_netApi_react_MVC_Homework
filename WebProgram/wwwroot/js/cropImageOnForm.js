let input, image, croppedDataInput, cropper, cropContainer;
let defaultAvatar, croppedPreview;

document.addEventListener("DOMContentLoaded", function () {
    input = document.getElementById("Image");
    image = document.getElementById("croppingImage");
    croppedDataInput = document.getElementById("croppedImageData");
    cropContainer = document.getElementById("imageCropContainer");

    defaultAvatar = document.getElementById("defaultAvatar");
    croppedPreview = document.getElementById("croppedPreview");

    input.addEventListener("change", function () {
        const file = this.files[0];
        if (file && /^image\/\w+/.test(file.type)) {
            const url = URL.createObjectURL(file);
            image.src = url;
            cropContainer.style.display = "block";
            image.style.display = "block";

            defaultAvatar.classList.add("d-none");
            croppedPreview.classList.remove("d-none");

            if (cropper) cropper.destroy();

            cropper = new Cropper(image, {
                aspectRatio: 1,
                viewMode: 1,
                autoCropArea: 1,
                preview: "#croppedPreview",
                cropend: function () {
                    const canvas = cropper.getCroppedCanvas();
                    croppedDataInput.value = canvas.toDataURL("image/webp");

                    canvas.toBlob(function (blob) {
                        const file = new File([blob], "cropped-image.webp", { type: "image/webp" });
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        input.files = dataTransfer.files;
                    }, "image/webp");
                }
            });
        }
    });
});
