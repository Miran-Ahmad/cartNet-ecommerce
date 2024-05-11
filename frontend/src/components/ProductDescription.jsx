import React from 'react'

const ProductDescription = () => {
  return (
    <div className='max-padd-container mt-20'>
        <div className='flex gap-3 mb-4'>
            <button className='btn-dark-outline rounded-sm !text-xs !py-[6px] w-36'>Description</button>
            <button className='btn-dark-outline rounded-sm !text-xs !py-[6px] w-36'>Care Guide</button>
            <button className='btn-dark-outline rounded-sm !text-xs !py-[6px] w-36'>Size Guide</button>
        </div>
        <div className='flex flex-col pb-16'>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium repellendus tempora suscipit corporis fuga? Laboriosam perspiciatis officia tempora assumenda, quae, minus eos natus doloribus, iure cumque pariatur optio enim vel!</p>
            <p className='text-sm'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit ut maxime in voluptates dignissimos hic eos obcaecati consectetur, labore tempore! Excepturi ratione iste culpa ab facere autem. Nulla, laboriosam necessitatibus?</p>
        </div>
    </div>
  )
}

export default ProductDescription