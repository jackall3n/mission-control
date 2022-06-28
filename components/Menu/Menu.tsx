import React from 'react';
import styles from './Menu.module.scss';
import NavLink from "../Router/NavLink";
import { CogIcon, ViewGridIcon } from "@heroicons/react/outline";

function Menu({ organisation }) {
  return (
    <aside className={styles.menu}>
      <nav className={styles.navigation}>
        <NavLink href={`/${organisation}`}>
          <a>
            <ViewGridIcon />
            <span>Dashboard</span>
          </a>
        </NavLink>

        <NavLink href={`/${organisation}/settings`}>
          <a>
            <CogIcon />
            <span>Settings</span>
          </a>
        </NavLink>
      </nav>
    </aside>
  )
}

export default Menu;
