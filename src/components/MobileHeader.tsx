'use client'

import fetchCategoriesAndCreateObject from '@/config/fakeapi-fetch'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserInfo } from '@/session'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'

const MobileHeader = ({user}: {user: UserInfo}) => {
  const {logout} = useAuth()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const pathname = usePathname()
  const PRODUCT_CATEGORIES = fetchCategoriesAndCreateObject()

  // When an item is clicked in the menu and we navigate away, the menu closes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Closes the menu if we reload the same path
  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      setIsOpen(false)
    }
  }

  // Removes second scrollbar when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen])

  // Close the menu when switching from mobile to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen])

  if (!isOpen) {
    return (
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        className='lg:hidden relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400'
      >
        <Menu className='h-6 w-6' aria-hidden='true' />
      </button>
    )
  }

  return (
    <div className='text-center'>
      <div className='relative z-40 lg:hidden'>
        <div className='fixed inset-0 bg-black bg-opacity-25' />
      </div>
      <div className='fixed overflow-y-scroll overscroll-y-none inset-0 z-40 flex'>
        <div className='w-4/5'>
          <div className='relative flex w-full max-w-sm flex-col overflow-y-auto bg-white pb-12 shadow-xl'>
            <div className='flex px-4 pb-2 pt-5'>
              <button
                type='button'
                onClick={() => setIsOpen(false)}
                className='relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400'
              >
                <X className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>
            {user ? 
              <div className='border-b border-gray-200'>
                <p className='border-transparent text-gray-900 flex-1 whitespace-nowrap border-b-2 py-4 text-base font-medium'>Hello, {user.username}</p>
              </div>
             : null}
            <div className='mt-2'>
              <ul>
                {PRODUCT_CATEGORIES.map((category) => (
                  <li key={category.label} className='space-y-10 px-4 pb-8 pt-10'>
                    <div className='border-b border-gray-200'>
                      <div className='-mb-px flex'>
                        <p className='border-transparent text-gray-900 flex-1 whitespace-nowrap border-b-2 py-4 text-base font-medium'>
                          {category.label}
                        </p>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-y-10 gap-x-4'>
                      {category.info.map((item) => (
                        <div key={item.name} className='group relative text-sm'>
                          <div className='relative aspect-square overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75'>
                            <Image fill src={item.image} alt='product category image' className='object-cover object-center' />
                          </div>
                          <Link href={item.href} className='mt-6 block font-medium text-gray-900'>
                            {item.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className='space-y-6 border-t border-gray-200 px-4 py-6'>
              { user ? (
                <>
                  {
                    // My products and sell a product options appear only on seller accounts
                    (user.role === 'author') ? (
                      <>
                        <div className="flow-root">
                          <Link onClick={() => closeOnCurrent(`${user.username}/my-products`)} href={`${user.username}/my-products`} className='-m-2 block p-2 font-medium text-gray-900'>My products</Link>
                        </div>
                        <div className="flow-root">
                          <Link onClick={() => closeOnCurrent(`${user.username}/sell`)} href={`${user.username}/sell`} className='-m-2 block p-2 font-medium text-gray-900'>Sell a Product</Link>
                        </div>
                      </>
                    )
                    // Become a seller option appears only to verified non-seller users
                    : (user.role === 'subscriber') ? (
                      <div className="flow-root">
                        <Link onClick={() => closeOnCurrent(`${user.username}/become-a-seller`)} href={`${user.username}/become-a-seller`} className='-m-2 block p-2 font-medium text-gray-900'>Become a Seller</Link>
                      </div>  
                    ) : null 
                  } 
                  <div onClick={logout} className="flow-root cursor-pointer text-gray-900 font-medium">
                    Log out
                  </div>
                </>
              )
               : 
                <>
                  <div className='flow-root'>
                    <Link onClick={() => closeOnCurrent('/login')} href='/login' className='-m-2 block p-2 font-medium text-gray-900'>
                      Login
                   </Link>
                  </div><div className='flow-root'>
                    <Link onClick={() => closeOnCurrent('/register')} href='/register' className='-m-2 block p-2 font-medium text-gray-900'>
                      Register
                    </Link>
                  </div>
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileHeader
