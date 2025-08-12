const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let result = reader.result as string;
            //TODO: Лучше исправить серверную логику, чтобы она принимала стандартный MIME-тип image/jpeg вместо нестандартного image/jpg. Это устранит необходимость хакать префикс на фронте
            // Заменяем префикс для JPEG на jpg, чтобы соответствовать ожиданиям сервер
            if (file.type === 'image/jpeg') {
                result = result.replace('image/jpeg', 'image/jpg');
            }
            resolve(result);
        };
        reader.onerror = error => reject(error);
    });
};

export default fileToBase64;
