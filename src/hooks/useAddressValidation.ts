import { GoogleAddressComponent } from 'components/CustomerForm/types';

import validateAddress from 'utils/validateAddress';

const useAddressValidation = () => {
    const validateAddressInput = async (address: string) => {
        try {
            const { result } = await validateAddress(address);

            const isPossibleStreetNumber = result?.address.formattedAddress.includes('#'); // street Number entered after street name by user
            const hasStreetNumberComponent = result?.address?.addressComponents?.some(
                (component: GoogleAddressComponent) => component.componentType === 'street_number'
            );
            const hasStreetNumber = isPossibleStreetNumber || hasStreetNumberComponent;

            const isValidGranularity =
                result?.verdict?.validationGranularity === 'PREMISE' || result?.verdict?.validationGranularity === 'SUB_PREMISE';

            const hasUnconfirmedRequiredComponents = ['route', 'locality', 'postal_code', 'country'].some(type =>
                result?.address?.unconfirmedComponentTypes?.includes(type)
            );

            if (
                !result || // Unsupported region code
                !hasStreetNumber || // there is nothing looks like street number
                hasUnconfirmedRequiredComponents ||
                !isValidGranularity // validation is not strong enough
            ) {
                return { result, isValidAddress: false };
            } else {
                return { result, isValidAddress: true };
            }
        } catch (error) {
            console.error('useAddressValidation:', error);
            return { result: null, isValidAddress: false };
        }
    };

    return { validateAddressInput };
};

export default useAddressValidation;
