import doctor from "@/assets/cover4.jpg";
import { motion } from "framer-motion";

const Banner = () => {

  const textVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <>
      <section
        className="relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${doctor})` }}
      >
        <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
          <motion.div
            className="max-w-xl text-center p-4 rounded-md  bg-opacity-50 sm:text-left"
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            <h1 className="text-3xl font-extrabold rounded-lg text-white sm:text-5xl">
              Let us find your{" "}
              <strong className="block text-[#928EDE]">Doctor</strong>
            </h1>
            <p className="mt-4 sm:mt-6 max-w-lg text-sm sm:text-lg rounded-lg text-white font-semibold shadow-md">
              "Your health is our priority. Find your perfect doctor, book an
              appointment, and take the first step toward a healthier tomorrow."
            </p>

            <div className="mt-6 flex gap-0 justify-center sm:justify-start">
              <input
                type="text"
                placeholder="Search..."
                className="w-2/3 sm:w-1/2 bg-white px-4 py-2 text-sm text-black rounded-l-xl"
              />
              <motion.button
                className="bg-[#928EDE] px-4 py-2 rounded-r-xl text-white font-medium"
                whileHover="hover"
                variants={buttonVariants}
              >
                Search
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Banner;
