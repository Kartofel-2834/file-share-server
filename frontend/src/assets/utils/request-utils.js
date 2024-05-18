export const statusMessages = {
    200: 'Готово!',
    400: 'Ошибка при отправке запроса',
    500: 'Произошла ошибка на стороне сервера',
};

export function parseError(error) {
    const status = error?.status;
    const errors = error?.res?.errors;

    const title = statusMessages?.[status] || statusMessages[400];
    let description = '';

    if (errors && typeof errors === 'object') {
        description = Object.values(errors).join(', ');
    } 

    return { title, description };
}
