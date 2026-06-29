import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import { sendPageEvent, sendTrackEvent } from '@edx/frontend-platform/analytics';
import { getAuthService } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Icon,
  Tab,
  Tabs,
  Hyperlink,
} from '@openedx/paragon';
import { ChevronLeft } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';
import { Navigate, useNavigate } from 'react-router-dom';

import BaseContainer from '../base-container';
import { clearThirdPartyAuthContextErrorMessage } from '../common-components/data/actions';
import {
  tpaProvidersSelector,
} from '../common-components/data/selectors';
import messages from '../common-components/custommessages';
import { LOGIN_PAGE, REGISTER_PAGE } from '../data/constants';
import {
  getTpaHint, getTpaProvider, updatePathWithQueryParams,
} from '../data/utils';
import { backupLoginForm } from '../login/data/actions';
import CustomLoginPage from "../login/CustomLoginPage";
import  CustomRegistrationPage  from '../register/CustomRegistrationPage';
import { backupRegistrationForm } from '../register/data/actions';
import './customLogistration.scss';

const CustomLogistration = ({
  selectedPage,
}) => {
  const tpaHint = getTpaHint();
  const tpaProviders = useSelector(tpaProvidersSelector);
  const dispatch = useDispatch();
  const {
    providers,
    secondaryProviders,
  } = tpaProviders;
  const { formatMessage } = useIntl();
  const [institutionLogin, setInstitutionLogin] = useState(false);
  const [key, setKey] = useState('');
  const navigate = useNavigate();
  const disablePublicAccountCreation = getConfig().ALLOW_PUBLIC_ACCOUNT_CREATION === false;
  const hideRegistrationLink = getConfig().SHOW_REGISTRATION_LINKS === false;

  useEffect(() => {
    const authService = getAuthService();
    if (authService) {
      authService.getCsrfTokenService()
        .getCsrfToken(getConfig().LMS_BASE_URL);
    }
  });

  useEffect(() => {
    if (disablePublicAccountCreation) {
      navigate(updatePathWithQueryParams(LOGIN_PAGE));
    }
  }, [navigate, disablePublicAccountCreation]);

  const handleInstitutionLogin = (e) => {
    sendTrackEvent('edx.bi.institution_login_form.toggled', { category: 'user-engagement' });
    if (typeof e === 'string') {
      sendPageEvent('login_and_registration', e === '/login' ? 'login' : 'register');
    } else {
      sendPageEvent('login_and_registration', e.target.dataset.eventName);
    }

    setInstitutionLogin(!institutionLogin);
  };

  const handleOnSelect = (tabKey, currentTab) => {
    if (tabKey === currentTab) {
      return;
    }
    sendTrackEvent(`edx.bi.${tabKey.replace('/', '')}_form.toggled`, { category: 'user-engagement' });
    dispatch(clearThirdPartyAuthContextErrorMessage());
    if (tabKey === LOGIN_PAGE) {
      dispatch(backupRegistrationForm());
    } else if (tabKey === REGISTER_PAGE) {
      dispatch(backupLoginForm());
    }
    setKey(tabKey);
  };

  const tabTitle = (
    <div className="d-flex">
      <Icon src={ChevronLeft} className="left-icon" />
      <span className="ml-2">
        {selectedPage === LOGIN_PAGE
          ? formatMessage(messages['logistration.sign.in'])
          : formatMessage(messages['logistration.register'])}
      </span>
    </div>
  );

  const isValidTpaHint = () => {
    const { provider } = getTpaProvider(tpaHint, providers, secondaryProviders);
    return !!provider;
  };

  const switchToPage = (targetPage) => {
    sendTrackEvent(`edx.bi.${targetPage.replace('/', '')}_form.toggled`, { category: 'user-engagement' });
    dispatch(clearThirdPartyAuthContextErrorMessage());

    if (targetPage === LOGIN_PAGE) {
      dispatch(backupRegistrationForm());
    } else if (targetPage === REGISTER_PAGE) {
      dispatch(backupLoginForm());
    }

    navigate(updatePathWithQueryParams(targetPage));
  };

  const otherPage = selectedPage === LOGIN_PAGE ? REGISTER_PAGE : LOGIN_PAGE;

  return (
    <BaseContainer>
      <div className='main-wrapper d-flex align-items-center justify-content-center'>
        {disablePublicAccountCreation
          ? (
              <>
                {institutionLogin && (
                  <Tabs defaultActiveKey="" id="controlled-tab" onSelect={handleInstitutionLogin}>
                    <Tab title={tabTitle} eventKey={LOGIN_PAGE} />
                  </Tabs>
                )}
                <div id="main-content" className="main-content">
                  {!institutionLogin && (
                    <h3 className="mb-1">{formatMessage(messages['logistration.sign.in'])}</h3>
                  )}
                  <LoginComponentSlot
                    institutionLogin={institutionLogin}
                    handleInstitutionLogin={handleInstitutionLogin}
                  />
                </div>
              </>
            )
            : (
              <div id="main-content" className="main-content">
                <h3 className="mb-4.5 component-header">
                  {formatMessage(messages[selectedPage === LOGIN_PAGE ? 'logistration.sign.in' : 'logistration.register'])}
                </h3>
                  {selectedPage === LOGIN_PAGE
                    ? (
                      <div className="logincomponentcontainer">
                        <div className='component-message'>
                          <p className='text-muted'>{formatMessage(messages['logistration.dont.have.account'])}</p>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              switchToPage(otherPage);
                            }}
                            className="font-weight-bold text-primary"
                          >
                            {formatMessage(messages['logistration.sign.up.link'])}
                          </a>
                        </div>
                        <CustomLoginPage
                          institutionLogin={institutionLogin}
                          handleInstitutionLogin={handleInstitutionLogin}
                        />
                        <p>
                          {formatMessage(messages['logistration.signin.terms.agreement'])} 
                          <Hyperlink variant="muted" destination={`${getConfig().CATALOG_MICROFRONTEND_URL}terms`} target="_blank" className='ml-1 mr-1'>
                            {formatMessage(messages['logistration.signin.terms.agreement.term'])}
                          </Hyperlink>
                          {formatMessage(messages['logistration.signin.terms.agreement.and'])} 
                          <Hyperlink variant="muted" destination={`${getConfig().CATALOG_MICROFRONTEND_URL}privacy`} target="_blank" className='ml-1'>
                            {formatMessage(messages['logistration.signin.terms.agreement.privacy'])}
                          </Hyperlink>
                        </p>
                      </div>
                    )
                    : (
                      <div className="registrationcomponentcontainer">
                        <div className='component-message'>
                          <p>{formatMessage(messages['logistration.already.have.account'])} </p>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              switchToPage(otherPage);
                            }}
                            className="font-weight-bold text-primary"
                          >
                            {formatMessage(messages['logistration.sign.in'])}
                          </a>
                        </div>
                        <CustomRegistrationPage
                          institutionLogin={institutionLogin}
                          handleInstitutionLogin={handleInstitutionLogin}
                        />
                      </div>
                    )}
              </div>
            )
        }
      </div>
    </BaseContainer>
  );
};

CustomLogistration.propTypes = {
  selectedPage: PropTypes.string,
};

CustomLogistration.defaultProps = {
  selectedPage: REGISTER_PAGE,
};

export default CustomLogistration;
