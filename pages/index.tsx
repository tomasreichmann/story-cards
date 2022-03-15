import React from 'react';
import Game from '../src/components/interactive/Game/Game';
import Page from '../src/components/Page/Page';
import PostCards from '../src/components/PostCards/PostCards';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <Page className={styles.base}>
      <Game />
    </Page>
  );
}
