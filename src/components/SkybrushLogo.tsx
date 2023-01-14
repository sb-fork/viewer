import React from 'react';

import logo from '~/../assets/icons/flyai_logo.png';

interface SkybrushLogoProps extends React.ComponentPropsWithoutRef<'img'> {
  width?: number;
}

const SkybrushLogo = ({ width = 160, ...rest }: SkybrushLogoProps) => (
  <img src={logo} alt='FlyAi Viewer' width={width} {...rest} />
);

export default SkybrushLogo;
