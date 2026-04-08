import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Hyperlink, Image } from '@openedx/paragon';
import classNames from 'classnames';

import messages from './custommessages';

const CustomMediumLayout = () => {
  const { formatMessage } = useIntl();

  return (
    <span className="d-flex align-items-center justify-content-center w-100">
      <div>
        <Hyperlink destination={getConfig().MARKETING_SITE_BASE_URL}>
          <Image className="logo-medium" alt={getConfig().SITE_NAME} src={getConfig().LOGO_URL} />
        </Hyperlink>
      </div>
    </span>
  );
};

export default CustomMediumLayout;
