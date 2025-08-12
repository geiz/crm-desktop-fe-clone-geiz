import cn from 'classnames';
import { Loader } from 'rsuite';

import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import CompanyProfileForm from 'components/Settings/CompanyProfileForm/CompanyProfileForm';
import { emptyDefaultValues, getCompanyValues } from 'components/Settings/utilsProfile';

import { ACCEPTABLE_IMG_FORMATS } from 'constants/common';
import { SETTINGS_ENDPOINTS } from 'constants/endpoints';
import { apiRequest } from 'services/apiUtils';
import { getCompany, updateCompany } from 'services/settings/profileService';
import { setTimezone } from 'store/slices/authSlice';
import { useAppDispatch } from 'store/store';
import { Company, Method } from 'types/common';
import { CompanyFormValues } from 'types/settingsTypes';
import fileToBase64 from 'utils/fileToBase64';
import getAbbreviation from 'utils/getAbbreviation';

import styles from './CompanyProfile.module.css';
import defaultCompanyLogo from 'assets/img/default-company-logo.svg';

const CompanyProfile = () => {
    const dispatch = useAppDispatch();
    const [companyData, setCompanyData] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({ page: false, file: false });

    const methods = useForm<CompanyFormValues>({
        defaultValues: emptyDefaultValues,
        mode: 'onChange'
    });
    const { setValue, reset } = methods;

    useEffect(() => {
        setIsLoading(prev => ({ ...prev, page: true }));
        getCompany()
            .then(resp => {
                setCompanyData(resp);
                setValue('company', getCompanyValues(resp));
            })
            .catch(err => toast.error(err.message))
            .finally(() => setIsLoading(prev => ({ ...prev, page: false })));
    }, [setValue]);

    const onSubmit = (data: CompanyFormValues) => {
        setIsLoading(prev => ({ ...prev, company: true }));

        if (data.company?.timezone) dispatch(setTimezone(data.company.timezone));
        return updateCompany(data)
            .then(resp => {
                reset({ company: getCompanyValues(resp) });
                setCompanyData(resp);
                toast.success('Company updated!');
            })
            .catch(err => {
                toast.error(err.message);
            });
    };

    const handleLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
        const MAX_SIZE_MB = 5; // Maximum file size in MB
        const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // Convert MB to bytes

        if (event.target.files && event.target.files.length > 0) {
            const logoFile = event.target.files[0];

            // Validate file size
            if (logoFile.size > MAX_SIZE_BYTES) {
                toast.error(`File size should not exceed ${MAX_SIZE_MB}MB.`);
                return;
            }

            // Allowed file types
            const validTypes = ACCEPTABLE_IMG_FORMATS.split(',');
            if (!validTypes.includes(logoFile.type)) {
                toast.error(`File ${logoFile.name} has an invalid format. Only JPEG, JPG, PNG, and HEIC are allowed.`);
                return;
            }

            fileToBase64(logoFile)
                .then(base64 => {
                    setIsLoading(prev => ({ ...prev, file: true }));
                    return apiRequest<string>({ url: SETTINGS_ENDPOINTS.companyImg, method: Method.PUT, data: { image: base64 } });
                })
                .then(response => {
                    if (companyData) setCompanyData({ ...companyData, image: response });
                })
                .catch(error => {
                    toast.error(error.message || 'Failed to upload logo');
                })
                .finally(() => setIsLoading(prev => ({ ...prev, file: false })));
        }
    };

    if (isLoading.page) return <Loader size='lg' center />;

    return (
        <div className={styles.container}>
            <h3 className={cn(styles.title, 'h-16B')}>Company Profile</h3>

            <div className={styles.contentWrapper}>
                <div className={styles.changePhotoWrapper}>
                    <div className={styles.fileInputWrapper}>
                        {isLoading.file && <Loader size='sm' center />}
                        {companyData && companyData.image ? (
                            // company logo if exists
                            <img src={companyData.image} className='img-cover' alt='company logo' />
                        ) : companyData && companyData.name ? (
                            // no logo but company name exists => abbreviation
                            <div className={styles.companyAbbr}>{getAbbreviation(companyData.name)}</div>
                        ) : (
                            // no logo and no company name => default logo with padding
                            <img src={defaultCompanyLogo} className={styles.p3} alt='company logo' />
                        )}
                    </div>

                    <label className={cn(styles.customFileInput, 'body-14M')}>
                        <input type='file' accept={ACCEPTABLE_IMG_FORMATS} onChange={handleLogo} hidden />
                        {companyData && companyData.image === defaultCompanyLogo ? 'Upload' : 'Update'} company logo
                    </label>
                </div>
                <FormProvider {...methods}>
                    {companyData && <CompanyProfileForm onSubmit={onSubmit} initCompanyData={companyData} />}
                </FormProvider>
            </div>
        </div>
    );
};

export default CompanyProfile;
