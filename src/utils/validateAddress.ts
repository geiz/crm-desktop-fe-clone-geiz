import { Method } from 'types/common';

const validateAddress = async (address: string) => {
    try {
        const resp = await fetch(`https://addressvalidation.googleapis.com/v1:validateAddress?key=${import.meta.env.VITE_GOOGLE_MAP_API}`, {
            method: Method.POST,
            body: JSON.stringify({
                address: {
                    addressLines: [address]
                }
            })
        });

        return await resp.json();
    } catch (err) {
        console.error('validateAddress:', err);
        return { result: null };
    }
};

export default validateAddress;
