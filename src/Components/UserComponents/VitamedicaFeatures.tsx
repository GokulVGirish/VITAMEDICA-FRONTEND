import React from "react"

const ThingsExplained=()=>{

  return (
    <div className="relative font-inter antialiased">
      <h1 className="text-center font-bold text-4xl mt-6">
        Explore Vitamedica
      </h1>
      <main className="relative  flex flex-col justify-center bg-white overflow-hidden">
        <div className="w-full max-w-[92vw] mx-auto px-4 md:px-6 py-10">
         
          <div className="group flex max-md:flex-col justify-center gap-2">
     
            <article className="group/article relative w-full rounded-xl overflow-hidden md:group-hover:[&:not(:hover)]:w-[20%] md:group-focus-within:[&:not(:focus-within):not(:hover)]:w-[20%] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.15)] before:absolute before:inset-x-0 before:bottom-0 before:h-1/3 before:bg-gradient-to-t before:from-black/50 before:transition-opacity md:before:opacity-0 md:hover:before:opacity-100 focus-within:before:opacity-100 after:opacity-0 md:group-hover:[&:not(:hover)]:after:opacity-100 md:group-focus-within:[&:not(:focus-within):not(:hover)]:after:opacity-100 after:absolute after:inset-0 after:bg-white/30 after:backdrop-blur after:transition-all focus-within:ring focus-within:ring-indigo-300">
              <a className="absolute inset-0 text-white z-10" href="#0">
                <span className="absolute inset-x-0 bottom-0 text-lg font-medium p-6 md:px-12 md:py-8 md:whitespace-nowrap md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:translate-y-2 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] group-hover/article:delay-300 group-focus-within/article:delay-300 whitespace-nowrap bg-black bg-opacity-20">
                  "Say goodbye to long waiting times and tedious phone calls.
                  With VitaMedica,
                  <br /> you can book doctor appointments online with just a few
                  clicks. Our user-friendly interface <br />
                  ensures a hassle-free scheduling experience."
                </span>
              </a>
              <img
                className="object-cover h-72 md:h-[480px] md:w-auto"
                src="https://cruip-tutorials.vercel.app/image-accordion/image-01.jpg"
                width="960"
                height="480"
                alt="Image 01"
              />
            </article>
            {/* Second Article */}
            <article className="group/article relative w-full rounded-xl overflow-hidden md:group-hover:[&:not(:hover)]:w-[20%] md:group-focus-within:[&:not(:focus-within):not(:hover)]:w-[20%] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.15)] before:absolute before:inset-x-0 before:bottom-0 before:h-1/3 before:bg-gradient-to-t before:from-black/50 before:transition-opacity md:before:opacity-0 md:hover:before:opacity-100 focus-within:before:opacity-100 after:opacity-0 md:group-hover:[&:not(:hover)]:after:opacity-100 md:group-focus-within:[&:not(:focus-within):not(:hover)]:after:opacity-100 after:absolute after:inset-0 after:bg-white/30 after:backdrop-blur after:transition-all focus-within:ring focus-within:ring-indigo-300">
              <a className="absolute inset-0 text-white z-10" href="#0">
                <span className="absolute inset-x-0 bottom-0 text-lg font-medium p-6 md:px-12 md:py-8 md:whitespace-nowrap md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:translate-y-2 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] group-hover/article:delay-300 group-focus-within/article:delay-300 whitespace-nowrap bg-black bg-opacity-20">
                  "Get to know your doctor before your visit. Our detailed
                  profiles include doctors' specialties,
                  <br /> qualifications, patient reviews, and more. Make
                  informed decisions about your healthcare provider,
                  <br /> Read honest reviews and ratings from other patients.
                  Our transparent review system helps you choose <br /> the
                  right doctor based on real experiences and feedback"
                </span>
              </a>
              <img
                className="object-cover h-72 md:h-[480px] md:w-auto transform scale-x-[-1]"
                src="https://cruip-tutorials.vercel.app/image-accordion/image-02.jpg"
                width="960"
                height="480"
                alt="Image 02"
              />
            </article>
         
            <article className="group/article relative w-full rounded-xl overflow-hidden md:group-hover:[&:not(:hover)]:w-[20%] md:group-focus-within:[&:not(:focus-within):not(:hover)]:w-[20%] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.15)] before:absolute before:inset-x-0 before:bottom-0 before:h-1/3 before:bg-gradient-to-t before:from-black/50 before:transition-opacity md:before:opacity-0 md:hover:before:opacity-100 focus-within:before:opacity-100 after:opacity-0 md:group-hover:[&:not(:hover)]:after:opacity-100 md:group-focus-within:[&:not(:focus-within):not(:hover)]:after:opacity-100 after:absolute after:inset-0 after:bg-white/30 after:backdrop-blur after:transition-all focus-within:ring focus-within:ring-indigo-300">
              <a className="absolute inset-0 text-white z-10" href="#0">
                <span className="absolute inset-x-0 bottom-0 text-lg font-medium p-6 md:px-12 md:py-8 md:whitespace-nowrap md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:translate-y-2 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] group-hover/article:delay-300 group-focus-within/article:delay-300 whitespace-nowrap bg-black bg-opacity-20">
                  "Our dedicated support team is available around the clock to
                  assist you with any queries or issues
                  <br />
                  Your satisfaction and well-being are our top priorities.
                  Experience a new level of convenience and quality
                  <br /> in healthcare with VitaMedica. Join us today and take
                  the first step towards better health!"
                </span>
              </a>
              <img
                className="object-cover h-72 md:h-[480px] md:w-auto"
                src="https://cruip-tutorials.vercel.app/image-accordion/image-03.jpg"
                width="960"
                height="480"
                alt="Image 03"
              />
            </article>
          </div>
      
        </div>
      </main>

      
    </div>
  );

}
export default React.memo(ThingsExplained)