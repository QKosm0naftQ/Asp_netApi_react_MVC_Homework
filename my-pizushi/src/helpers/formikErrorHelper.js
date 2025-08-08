export const mapServerErrorsToFormik = (err, setErrors) => {
    const serverErrors = {};
    const { response } = err;
    const { data } = response || {};

    if (data && typeof data === 'object') {
        const { errors } = data;
        if (errors && typeof errors === 'object') {
            Object.entries(errors).forEach(([key, messages]) => {
                if (key === "") {
                    serverErrors.general = Array.isArray(messages)
                        ? messages.join(" ")
                        : messages;
                }
                const field = key.charAt(0).toLowerCase() + key.slice(1);
                serverErrors[field] = Array.isArray(messages)
                    ? messages.join(" ")
                    : messages;
            });
        } else if (data.message) {
            serverErrors.general = data.message;
        } else {
            serverErrors.general = "Сервер повернув невідому помилку";
        }
    } else {
        serverErrors.general = "Сталася помилка з'єднання із сервером";
    }

    setErrors(serverErrors);
};