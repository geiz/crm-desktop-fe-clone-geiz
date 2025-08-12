import { FC, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import JobsPage from 'pages/jobs/JobsPage';
import SchedulePage from 'pages/schedule/SchedulePage';

import { APP_ROUTES } from 'constants/routes';
import { useAuth } from 'hooks/useAuth';

const SettingsLayout = lazy(() => import('../layout/SettingsLayout'));
const MainLayout = lazy(() => import('../layout/MainLayout'));
const AuthLayout = lazy(() => import('../layout/AuthLayout'));
const StatusesLayout = lazy(() => import('../layout/StatusesLayout'));

const AdditionalInfoPage = lazy(() => import('../pages/settings/additional-info/AdditionalInfoPage'));
const EditDocumentPage = lazy(() => import('../pages/settings/additional-info/EditDocumentPage'));
const AddDocumentPage = lazy(() => import('../pages/settings/additional-info/AddDocumentPage'));
const EmployeesPage = lazy(() => import('../pages/settings/employees/EmployeesPage'));
const AddEmployeePage = lazy(() => import('../pages/settings/employees/AddEmployeePage'));
const EditEmployeePage = lazy(() => import('../pages/settings/employees/EditEmployeePage'));
const AppointmentType = lazy(() => import('../pages/settings/crud-settings/AppointmentTypePage'));
const BusinessUnit = lazy(() => import('../pages/settings/crud-settings/BusinessUnitPage'));
const CanceledJobReason = lazy(() => import('../pages/settings/crud-settings/CanceledJobReasonPage'));
const EstimateCancelReasonPage = lazy(() => import('../pages/settings/crud-settings/EstimateCancelReasonPage'));
const LeadSource = lazy(() => import('../pages/settings/crud-settings/LeadSourcePage'));
const Tags = lazy(() => import('../pages/settings/crud-settings/TagsPage'));
const TaxRates = lazy(() => import('../pages/settings/tax-rates/TaxRatesPage'));
const BrandPage = lazy(() => import('../pages/settings/crud-settings/BrandPage'));
const CompanyProfile = lazy(() => import('../pages/settings/profile/CompanyProfile'));
const NotFoundPage = lazy(() => import('../pages/statuses/NotFoundPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const InvitePage = lazy(() => import('../pages/auth/InvitePage'));
const RecoveryPage = lazy(() => import('../pages/auth/RecoveryPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ForbiddenResoursePage = lazy(() => import('../pages/statuses/ForbiddenResoursePage'));
const JobCreationPage = lazy(() => import('../pages/jobs/JobCreationPage'));
const JobItemPage = lazy(() => import('../pages/jobs/JobItemPage'));
const EstimateItemPage = lazy(() => import('../pages/estimates/EstimateItemPage'));
const MaterialsPage = lazy(() => import('../pages/settings/materials/MaterialsPage'));
const AddMaterialPage = lazy(() => import('../pages/settings/materials/AddMaterialPage'));
const EditMaterialPage = lazy(() => import('../pages/settings/materials/EditMaterialPage'));
const JobTypesPage = lazy(() => import('../pages/settings/job-types/JobTypesPage'));
const AddJobTypePage = lazy(() => import('../pages/settings/job-types/AddJobTypePage'));
const EditJobTypePage = lazy(() => import('../pages/settings/job-types/EditJobTypePage'));
const PriceBookPage = lazy(() => import('../pages/settings/price-book/PriceBookPage'));
const AddPriceBookPage = lazy(() => import('../pages/settings/price-book/AddPriceBookPage'));
const EditPriceBookPage = lazy(() => import('../pages/settings/price-book/EditPriceBookPage'));
const EstimateEmailPage = lazy(() => import('../pages/estimates/EstimateEmailPage'));
const EstimateNotificationSuccessPage = lazy(() => import('../pages/estimates/EstimateNotificationSuccessPage'));
const InvoiceItemPage = lazy(() => import('../pages/invoices/InvoiceItemPage'));
const InvoiceEmailPage = lazy(() => import('../pages/invoices/InvoiceEmailPage'));
const InvoiceNotificationSuccessPage = lazy(() => import('../pages/invoices/InvoiceNotificationSuccessPage'));

const AppRouter: FC = () => {
    const { isLoggedIn } = useAuth();

    return (
        <Routes>
            <Route path={APP_ROUTES.home.main} element={isLoggedIn ? <MainLayout /> : <Navigate to={APP_ROUTES.auth.login} replace />}>
                <Route path={APP_ROUTES.jobs.main} element={<JobsPage />} />
                <Route path={APP_ROUTES.jobs.item} element={<JobItemPage />} />
                <Route path={APP_ROUTES.jobs.create} element={<JobCreationPage />} />
                <Route path={APP_ROUTES.schedule.main} element={<SchedulePage />} />
                <Route path={APP_ROUTES.estimates.item} element={<EstimateItemPage />} />
                <Route path={APP_ROUTES.estimates.email} element={<EstimateEmailPage />} />
                <Route path={APP_ROUTES.estimates.notificationSuccess} element={<EstimateNotificationSuccessPage />} />
                <Route path={APP_ROUTES.jobs.invoiceItem} element={<InvoiceItemPage />} />
                <Route path={APP_ROUTES.jobs.invoiceEmail} element={<InvoiceEmailPage />} />
                <Route path={APP_ROUTES.jobs.invoiceNotificationSuccess} element={<InvoiceNotificationSuccessPage />} />
            </Route>

            <Route element={isLoggedIn ? <Navigate to={APP_ROUTES.schedule.main} /> : <AuthLayout />}>
                <Route path={APP_ROUTES.auth.invite} element={<InvitePage />} />
                <Route path={APP_ROUTES.auth.recovery} element={<RecoveryPage />} />
                <Route path={APP_ROUTES.auth.login} element={<LoginPage />} />
                <Route path={APP_ROUTES.auth.forgotPassword} element={<ForgotPasswordPage />} />
            </Route>

            <Route element={isLoggedIn ? <SettingsLayout /> : <Navigate to={APP_ROUTES.auth.login} replace />}>
                <Route path={APP_ROUTES.settings.main} element={<Navigate to={APP_ROUTES.settings.profile} replace />} />
                <Route path={APP_ROUTES.settings.employees} element={<EmployeesPage />} />
                <Route path={APP_ROUTES.settings.addEmployee} element={<AddEmployeePage />} />
                <Route path={APP_ROUTES.settings.editEmployee} element={<EditEmployeePage />} />
                <Route path={APP_ROUTES.settings.tags} element={<Tags />} />
                <Route path={APP_ROUTES.settings.businessUnit} element={<BusinessUnit />} />
                <Route path={APP_ROUTES.settings.brands} element={<BrandPage />} />
                <Route path={APP_ROUTES.settings.appointmentType} element={<AppointmentType />} />
                <Route path={APP_ROUTES.settings.cancellationReason} element={<CanceledJobReason />} />
                <Route path={APP_ROUTES.settings.estimateCancellationReason} element={<EstimateCancelReasonPage />} />
                <Route path={APP_ROUTES.settings.leadSource} element={<LeadSource />} />
                <Route path={APP_ROUTES.settings.taxes} element={<TaxRates />} />
                <Route path={APP_ROUTES.settings.priceBook} element={<PriceBookPage />} />
                <Route path={APP_ROUTES.settings.addPriceBook} element={<AddPriceBookPage />} />
                <Route path={APP_ROUTES.settings.editPriceBook} element={<EditPriceBookPage />} />
                <Route path={APP_ROUTES.settings.materials} element={<MaterialsPage />} />
                <Route path={APP_ROUTES.settings.addMaterials} element={<AddMaterialPage />} />
                <Route path={APP_ROUTES.settings.editMaterials} element={<EditMaterialPage />} />
                <Route path={APP_ROUTES.settings.jobTypes} element={<JobTypesPage />} />
                <Route path={APP_ROUTES.settings.addJobTypes} element={<AddJobTypePage />} />
                <Route path={APP_ROUTES.settings.editJobTypes} element={<EditJobTypePage />} />
                <Route path={APP_ROUTES.settings.profile} element={<CompanyProfile />} />
                <Route path={APP_ROUTES.settings.additionalInfo} element={<AdditionalInfoPage />} />
                <Route path={APP_ROUTES.settings.editDocument} element={<EditDocumentPage />} />
                <Route path={APP_ROUTES.settings.addDocument} element={<AddDocumentPage />} />
            </Route>

            <Route path={APP_ROUTES.home.main} element={<StatusesLayout />}>
                <Route path={APP_ROUTES.notFound.main} element={<NotFoundPage />} />
                <Route path={APP_ROUTES.forbbiden.main} element={<ForbiddenResoursePage />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
