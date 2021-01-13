import React from 'react';
import { ReactComponent as Curve } from '../../public/assets/curve.svg';
import { ReactComponent as Logo } from '../../public/nx-logo-white.svg';
import css from './layout.module.scss';

export const Header = () => (
  <header className={css.header}>
    <Curve className={css.curve} />
    <Logo className={css.logo} />
  </header>
);
