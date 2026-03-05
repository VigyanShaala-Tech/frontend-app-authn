import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEnvelope } from '@fortawesome/free-solid-svg-icons';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Hyperlink, Image } from '@openedx/paragon';

import messages from './custommessages';

const CustomLargeLayout = () => {
  const pathname = window.location.pathname;

  let component = 'unknown';

  if (pathname.includes('/authn/register')) {
    component = 'registration';
  } else if (pathname.includes('/authn/login')) {
    component = 'login';
  } else if (pathname.includes('/authn/reset')) {
    component = 'forgotpassword';
  }
  const { formatMessage } = useIntl();

  const benefits = [
    'register.benefit.access_courses',
    'register.benefit.learn_experts',
    'register.benefit.get_certified',
    'register.benefit.join_community',
  ];

  const avatars = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&h=60&fit=crop',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop',
  ];

  const renderContent = () => {
    if (component === 'registration') {
      return (
        <div className="registration-left-container text-white">
          <h1 className="message-header text-white">
            {formatMessage(messages['register.start.journey'])}
          </h1>
          <p className="message-describe">
            {formatMessage(messages['register.paragraph'])}
          </p>
          <div className="list-container">
            {benefits.map((messageId, index) => (
              <div key={index} className="d-flex mt-2 align-items-center">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="w-4 h-4 p-2 rounded-full mr-3 text-white bg-light-color"
                />
                <span className="list-item">
                  {formatMessage(messages[messageId])}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (component === 'login') {
      return (
        <div className="login-left-container">
          <h1 className="message-header text-white">
            {formatMessage(messages['login.welcome_back'])}
          </h1>
          <p className="message-describe">
            {formatMessage(messages['login.paragraph'])}
          </p>
          <div className="list-container">
            <div className="avatars-container d-flex justify-content-left align-items-center">
              {avatars.map((avatar, index) => (
                <div
                  key={index}
                  className="avatar-item rounded-circle overflow-hidden border border-white shadow-sm"
                  style={{ zIndex: avatars.length - index }}
                >
                  <img
                    src={avatar}
                    alt={`Student ${index + 1}`}
                    className="w-100 h-100 object-cover"
                  />
                </div>
              ))}
              <div className="extra-count ml-2">
                {formatMessage(messages['login.join_learners'], { count: '25k' })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (component === 'forgotpassword') {
      return (
        <div className="forgot-password-left-container">
          <h1 className="message-header text-white">
            {formatMessage(messages['forgot_password.header'])}
          </h1>
          <p className="message-describe">
            {formatMessage(messages['forgot_password.paragraph'])}
          </p>
          <div className="list-container d-flex align-items-center">
            <div className="rounded-full p-3 mr-3 text-white bg-light-color">
              <FontAwesomeIcon icon={faEnvelope} className="mail-icon" />
            </div>
            <span className="list-item">
              {formatMessage(messages['forgot_password.check_inbox'])}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="auth-left w-50 d-flex">
      <div className="auth-left-container">
        <Hyperlink destination={getConfig().MARKETING_SITE_BASE_URL} className="mb-8 block">
          <Image
            className="logo"
            alt={getConfig().SITE_NAME}
            src={getConfig().LOGO_WHITE_URL}
          />
        </Hyperlink>

        {renderContent()}
      </div>
    </div>
  );
};

export default CustomLargeLayout;