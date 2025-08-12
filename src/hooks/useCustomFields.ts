import { useCallback, useState } from 'react';

import { updateCustomFields } from 'services/settings/userService';
import { CustomField, CustomFieldsData, CustomFieldsRequest } from 'types/settingsTypes';

type FieldWithKey = { key: string; field: CustomField };

export const useCustomFields = () => {
    const [fields, setFields] = useState<FieldWithKey[]>([]);

    const initFieldsFromSettings = useCallback((settings: CustomFieldsData) => {
        const initializedFields: FieldWithKey[] = Object.entries(settings).map(([key, value]) => {
            if (typeof value === 'boolean') {
                return {
                    key,
                    field: {
                        name: key,
                        type: 'toggle',
                        value
                    }
                };
            }

            return {
                key,
                field: {
                    name: key,
                    type: 'multiselect',
                    value,
                    options: value.map(v => ({ label: v, value: v }))
                }
            };
        });

        setFields(initializedFields);
    }, []);

    const saveAndSubmitField = async (userId: number, key: string, newField: CustomField) => {
        const updatedFields = (() => {
            const exists = fields.find(f => f.key === key);
            if (exists) {
                return fields.map(f => (f.key === key ? { key: newField.name, field: newField } : f));
            } else {
                return [...fields, { key: newField.name, field: newField }];
            }
        })();

        setFields(updatedFields);

        const payload: CustomFieldsRequest = {};
        updatedFields.forEach(({ key, field }) => {
            payload[key] = field.value;
        });

        return updateCustomFields(userId, payload);
    };

    const deleteField = async (userId: number, key: string) => {
        const updatedFields = fields.filter(f => f.key !== key);
        setFields(updatedFields);

        const payload: CustomFieldsRequest = {};
        updatedFields.forEach(({ key, field }) => {
            payload[key] = field.value;
        });

        return updateCustomFields(userId, payload);
    };

    return {
        fields,
        initFieldsFromSettings,
        saveAndSubmitField,
        deleteField
    };
};
