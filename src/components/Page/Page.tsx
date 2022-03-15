import React from 'react';
import clsx from 'clsx';
import Head from 'next/head';

import styles from './Page.module.css';

export type PageProps = {
  children: React.ReactNode;
  className?: string;
};

const Page = ({ children, className }: PageProps) => {
  return <main className={clsx(className, styles.base)}>{children}</main>;
};

export default Page;
