import React from 'react';
import { CoverPagePresentation as CoverPage } from 'react-cover-page';

import logo from '~/../assets/icons/flyai_logo.png';

interface SplashScreenProps {
  visible: boolean;
}

const SplashScreen = ({ visible = true }: SplashScreenProps) => (
  <CoverPage
    loading
    visible={visible}
    icon={<img src={logo} width={200} height={100} alt='' />}
    /*title={
      <span>
        FlyAi <b style={{ fontWeight: 400 }}>Viewer</b>
      </span>
    }*/
  />
);

export default SplashScreen;
