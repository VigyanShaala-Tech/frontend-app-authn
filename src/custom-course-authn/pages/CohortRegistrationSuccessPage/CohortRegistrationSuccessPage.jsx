import React, { useEffect, useMemo, useState } from 'react';

import { fetchAuthenticatedUser, getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  faArrowRight,
  faCalendar,
  faCircleCheck,
  faDownload,
  faEnvelope,
  faGraduationCap,
  faThLarge,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import CohortLoadingSpinner from '../../components/CohortLoadingSpinner/CohortLoadingSpinner';
import {
  buildCohortRegisterPath,
  buildCohortSetPasswordPath,
} from '../../data/constants';
import { redirectToCohortDashboard } from '../../utils/cohortAuthRedirect';
import { normalizeCohortEnrollmentSuccess } from '../../utils/cohortEnrollmentSuccess';
import { getCohortEnrollmentSession } from '../../utils/cohortEnrollmentSession';
import { clearAllCohortRegistrationSessions } from '../../utils/cohortSessionCleanup';

import messages from './messages';

import './cohort-registration-success-page.scss';

const CohortRegistrationSuccessPage = () => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const activationKey = searchParams.get('activation_key') || '';

  const [isResolvingAccess, setIsResolvingAccess] = useState(true);

  const enrollmentData = useMemo(
    () => location.state?.enrollment || getCohortEnrollmentSession(slug),
    [location.state, slug],
  );

  const enrollment = useMemo(
    () => normalizeCohortEnrollmentSuccess(enrollmentData),
    [enrollmentData],
  );

  const hasEnrollmentData = Boolean(
    enrollmentData
    && (enrollment.email || enrollment.courseTitle),
  );

  useEffect(() => {
    let mounted = true;

    const resolveAccess = async () => {
      if (hasEnrollmentData) {
        if (mounted) {
          setIsResolvingAccess(false);
        }
        return;
      }

      const authenticatedUser = await fetchAuthenticatedUser({
        forceRefresh: !!getAuthenticatedUser(),
      });

      if (!mounted) {
        return;
      }

      if (authenticatedUser?.username) {
        clearAllCohortRegistrationSessions(slug);
        redirectToCohortDashboard();
        return;
      }

      if (slug && activationKey) {
        navigate(
          buildCohortSetPasswordPath(slug, { activationKey }),
          { replace: true },
        );
        return;
      }

      if (slug) {
        navigate(buildCohortRegisterPath(slug), { replace: true });
        return;
      }

      navigate(buildCohortRegisterPath(''), { replace: true });
    };

    resolveAccess();

    return () => {
      mounted = false;
    };
  }, [activationKey, hasEnrollmentData, navigate, slug]);

  const handleDashboardClick = () => {
    clearAllCohortRegistrationSessions(slug);
    if (enrollment.dashboardUrl) {
      window.location.assign(enrollment.dashboardUrl);
    }
  };

  const handleAppDownloadClick = () => {
    if (enrollment.appDownloadUrl) {
      window.location.assign(enrollment.appDownloadUrl);
    }
  };

  if (isResolvingAccess || !hasEnrollmentData) {
    return (
      <div className="cohort-registration-success-page">
        <div className="cohort-registration-success-page__card">
          <CohortLoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="cohort-registration-success-page">
      <div className="cohort-registration-success-page__card">
        <div className="cohort-registration-success-page__confetti" aria-hidden>
          <span className="cohort-registration-success-page__confetti-item cohort-registration-success-page__confetti-item--1">✦</span>
          <span className="cohort-registration-success-page__confetti-item cohort-registration-success-page__confetti-item--2">✶</span>
          <span className="cohort-registration-success-page__confetti-item cohort-registration-success-page__confetti-item--3">✺</span>
          <span className="cohort-registration-success-page__confetti-item cohort-registration-success-page__confetti-item--4">✦</span>
          <span className="cohort-registration-success-page__confetti-item cohort-registration-success-page__confetti-item--5">✷</span>
          <span className="cohort-registration-success-page__confetti-item cohort-registration-success-page__confetti-item--6">✦</span>
        </div>

        <div className="cohort-registration-success-page__check-wrap">
          <div className="cohort-registration-success-page__check-circle">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="cohort-registration-success-page__check-icon"
              aria-hidden
            />
          </div>
        </div>

        <h1 className="cohort-registration-success-page__title">
          🎉
          {' '}
          {intl.formatMessage(messages.title)}
        </h1>
        <p className="cohort-registration-success-page__subtitle">
          {intl.formatMessage(messages.subtitle)}
        </p>

        {enrollment.courseTitle && (
          <div className="cohort-registration-success-page__course-card">
            <div className="cohort-registration-success-page__course-icon-wrap">
              <FontAwesomeIcon icon={faGraduationCap} aria-hidden />
            </div>
            <div className="cohort-registration-success-page__course-meta">
              <p className="cohort-registration-success-page__course-label">
                {intl.formatMessage(messages.enrolledIn)}
              </p>
              <p className="cohort-registration-success-page__course-title" title={enrollment.courseTitle}>
                {enrollment.courseTitle}
              </p>
              {enrollment.courseStartDate && (
                <p className="cohort-registration-success-page__course-date">
                  <FontAwesomeIcon icon={faCalendar} aria-hidden />
                  {intl.formatMessage(messages.startDate)}
                  {' '}
                  {enrollment.courseStartDate}
                </p>
              )}
            </div>
          </div>
        )}

        {enrollment.email && (
          <div className="cohort-registration-success-page__email-row">
            <div className="cohort-registration-success-page__email-icon-wrap">
              <FontAwesomeIcon icon={faEnvelope} aria-hidden />
            </div>
            <div className="cohort-registration-success-page__email-text">
              {intl.formatMessage(messages.emailConfirmation)}
              {' '}
              <a
                href={`mailto:${enrollment.email}`}
                className="cohort-registration-success-page__email-link"
              >
                {enrollment.email}
              </a>
            </div>
          </div>
        )}

        <button
          type="button"
          className="cohort-registration-success-page__dashboard-btn"
          onClick={handleDashboardClick}
        >
          <FontAwesomeIcon icon={faThLarge} aria-hidden />
          {intl.formatMessage(messages.goToDashboard)}
          <FontAwesomeIcon
            icon={faArrowRight}
            className="cohort-registration-success-page__dashboard-arrow"
            aria-hidden
          />
        </button>

        {enrollment.appDownloadUrl && (
          <button
            type="button"
            className="cohort-registration-success-page__app-link"
            onClick={handleAppDownloadClick}
          >
            <FontAwesomeIcon icon={faDownload} aria-hidden />
            {intl.formatMessage(messages.downloadApp)}
            <FontAwesomeIcon icon={faArrowRight} className="cohort-registration-success-page__dashboard-arrow" aria-hidden />
          </button>
        )}

        <p className="cohort-registration-success-page__support">
          {intl.formatMessage(messages.needHelp)}
          {' '}
          <a
            href={`mailto:${enrollment.supportEmail}`}
            className="text-primary btn btn-link p-0 cohort-registration-success-page__support-link"
          >
            {enrollment.supportEmail}
          </a>
        </p>

      </div>
    </div>
  );
};

export default CohortRegistrationSuccessPage;
