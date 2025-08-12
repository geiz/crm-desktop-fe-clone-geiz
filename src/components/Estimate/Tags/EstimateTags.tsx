import { useCallback } from 'react';
import { toast } from 'react-toastify';

import Expander from 'components/Expander/Expander';
import { Select } from 'components/ui/Input';

import { formatTags } from './utils';
import { ESTIMATE_ENDPOINTS } from 'constants/endpoints';
import useSelectOptions from 'hooks/useSelectOptions';
import { apiRequest } from 'services/apiUtils';
import { parametrizeURL } from 'services/utils';
import { storeTags } from 'store/slices/estimateSlice';
import { useAppDispatch } from 'store/store';
import { BaseItem, Method, SelectOption } from 'types/common';

interface Props {
    estimateId: string;
    tags: BaseItem[];
    isEditable?: boolean;
}

const EstimateTags = ({ estimateId, tags, isEditable }: Props) => {
    const { allTags, getAllTags } = useSelectOptions();

    const dispatch = useAppDispatch();

    const handleTagChange = useCallback(
        (newTags: SelectOption[]) => {
            const addedTag = newTags.find(tag => !tags.some(t => t.id === tag.value));
            const removedTag = tags.find(tag => !newTags.some(t => t.value === tag.id));
            const tag = {
                id: addedTag?.value || removedTag?.id,
                action: newTags.length > tags.length ? 'add' : 'remove'
            };

            // TODO move to api services
            apiRequest<BaseItem[]>({
                url: parametrizeURL(ESTIMATE_ENDPOINTS.tag, { estimateId, tagAction: tag.action, tagId: Number(tag.id) }),
                method: Method.PUT
            })
                .then(resp => dispatch(storeTags(resp)))
                .catch(err => toast.error(err));
        },
        [dispatch, estimateId, tags]
    );

    return (
        <Expander title='Estimate Tags'>
            <Select
                options={allTags.options}
                value={formatTags(tags)}
                isMulti
                isClearable={false}
                onFocus={getAllTags}
                onChange={handleTagChange}
                placeholder='Select tags...'
                isDisabled={!isEditable}
                isLoading={allTags.isLoading}
            />
        </Expander>
    );
};

export default EstimateTags;
