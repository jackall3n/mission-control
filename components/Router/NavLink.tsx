import React from 'react'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'

export interface NavLinkProps extends LinkProps {
  children: React.ReactElement
}

function NavLink({ children, href, ...props }: NavLinkProps) {
  const router = useRouter()

  console.log(router.pathname, router)

  return (
    <Link href={href} {...props}>
      {router.asPath === href ? React.cloneElement(children, { 'data-active': true }) : children}
    </Link>
  )
}

export default NavLink
