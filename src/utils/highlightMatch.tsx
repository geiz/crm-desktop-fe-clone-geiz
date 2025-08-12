// Функция для выделения совпадений в тексте
const highlightMatch = (text: string, term: string) => {
    if (!term) return text;
    if (!text) return '';
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
        regex.test(part) ? (
            <span key={index} style={{ color: 'var(--color-grey-1000)' }}>
                {part}
            </span>
        ) : (
            part
        )
    );
};

export default highlightMatch;
