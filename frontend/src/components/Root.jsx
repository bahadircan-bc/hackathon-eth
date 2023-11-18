import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <div className='bg-[#121A2A] w-screen h-screen'>
      <div className='h-[50px] bg-[#d9d9d9] flex items-center justify-evenly px-[30%] bg-opacity-50 text-xs text-white'>
        <Link to={''} className='hover:no-underline text-[#f0f0f0] hover:text-[#fff] transition-colors duration-100'>Home Page</Link>
        <Link className='hover:no-underline text-[#f0f0f0] hover:text-[#fff] transition-colors duration-100'>Plinko</Link>
        <Link className='text-[#d9d9d9]'>Coin Flip</Link>
        <Link to={'staker'} className='hover:no-underline text-[#f0f0f0] hover:text-[#fff] transition-colors duration-100'>Become A Staker!</Link>
      </div>
      <Outlet/>
    </div>
  )
}
