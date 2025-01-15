import React from 'react'
import Header from './header'
import Hero from './hero'
import About from './about'
import Why from './why'
import Banner from './banner'
import Building from './building'
import Footer from './footer'

function landing() {
  return (
    <>
         <div className="hero">
          <div className="container mx-auto px-4">
              <Header/>
              <Hero/>
          </div>
         </div>

         <div className="container mx-auto px-4">
             <div className="grid grid-cols-12 gap-12">
                <div className="col-span-12 xl:col-span-6">
                    <Building/>
                </div>
                <div className="col-span-12 xl:col-span-6 flex">
                    <About/>
                </div>
             </div>
             
             <Why/>
             <Banner/>
            
             <Footer/>
         </div>
    
    </>
  )
}

export default landing