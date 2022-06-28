import React from 'react';
import styles from './Header.module.scss';
import { useApplications } from "../../providers/ApplicationsProvider";
import DateFormat from "../DateFormat/DateFormat";

function Header() {
  const { applications, lastUpdated, paused, environments } = useApplications();

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <b>🚀 </b>
        <span>Houstn</span>
      </div>

      <div className={styles.lastUpdated}>
        <b>updated: </b>
        <DateFormat value={lastUpdated} format="dd MMM HH:mm:ss" />
        {paused && (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M2 2h20v20h-20z" />
          </svg>
        )}
        {!paused && (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M3 22v-20l18 10-18 10z" />
          </svg>
        )}
      </div>
    </header>
  )
}

export default Header;
