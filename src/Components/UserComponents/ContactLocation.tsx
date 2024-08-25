import {
  faBug,
  faCreditCard,
  faFileCircleXmark,
  faPhoneVolume,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

const ContactLocationComponent = () => {
 
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 70 },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const mapVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <>
      <div className="container mt-10 mx-auto px-2 md:px-4">
        <motion.section
          className="mb-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="flex justify-center" variants={itemVariants}>
            <div className="text-center md:max-w-xl lg:max-w-3xl">
              <h2 className="mb-12 text-3xl border-l-4 border-[#928EDE] pl-2 font-extrabold text-gray-900">
                Contact us
              </h2>
            </div>
          </motion.div>

          <div className="flex flex-wrap">
            <motion.form
              className="mb-12 w-full shrink-0 grow-0 basis-auto md:px-3 lg:mb-0 lg:w-5/12 lg:px-6"
              variants={formVariants}
            >
              <div className="mb-3 w-full">
                <label
                  className="block font-medium mb-[2px] text-[#364f6b]"
                  htmlFor="exampleInputName"
                >
                  Name
                </label>
                <input
                  type="text"
                  className="px-2 py-2 border w-full outline-none rounded-md"
                  id="exampleInputName"
                  placeholder="Name"
                />
              </div>

              <div className="mb-3 w-full">
                <label
                  className="block font-medium mb-[2px] text-[#364f6b]"
                  htmlFor="exampleInputEmail"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="px-2 py-2 border w-full outline-none rounded-md"
                  id="exampleInputEmail"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="mb-3 w-full">
                <label
                  className="block font-medium mb-[2px] text-[#364f6b]"
                  htmlFor="exampleInputMessage"
                >
                  Message
                </label>
                <textarea
                  className="px-2 py-2 border rounded-[5px] w-full outline-none"
                  id="exampleInputMessage"
                  placeholder="Your message"
                ></textarea>
              </div>

              <button
                type="button"
                className="mb-6 inline-block w-full rounded bg-[#928EDE] px-6 py-2.5 font-medium uppercase leading-normal text-white hover:shadow-md hover:bg-[#716dc9]"
              >
                Send
              </button>
            </motion.form>

            <div className="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
              <motion.div
                className="flex flex-wrap"
                variants={containerVariants}
              >
                {[
                  {
                    icon: faPhoneVolume,
                    title: "Technical support",
                    email: "vitamedica.technical@gmail.com",
                    phone: "+91 9889654433",
                  },
                  {
                    icon: faCreditCard,
                    title: "Booking related questions",
                    email: "vitamedica.bookings@gmail.com",
                    phone: "+91 988965434",
                  },
                  {
                    icon: faFileCircleXmark,
                    title: "Report",
                    email: "vitamedica.report@gmail.com",
                    phone: "+91 988965422",
                  },
                  {
                    icon: faBug,
                    title: "Bug report",
                    email: "vitamedica.bugs@gmail.com",
                    phone: "+91 9889111333",
                  },
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:px-6"
                    variants={itemVariants}
                  >
                    <div className="flex items-start">
                      <div className="shrink-0">
                        <div className="inline-block rounded-md bg-teal-400-100 p-4 text-teal-700">
                          <FontAwesomeIcon
                            className="h-6 w-6"
                            icon={contact.icon}
                          />
                        </div>
                      </div>
                      <div className="ml-6 grow">
                        <p className="mb-2 font-bold">{contact.title}</p>
                        <p className="text-neutral-500">{contact.email}</p>
                        <p className="text-neutral-500">{contact.phone}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
      <motion.section
        className="bg-white mb-5"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-1 lg:px-8">
          <motion.div
            className="max-w-2xl lg:max-w-4xl mx-auto flex justify-center"
            variants={itemVariants}
          >
            <h2 className="text-3xl border-l-4 border-[#928EDE] pl-2 font-extrabold text-gray-900">
              Visit Our Location
            </h2>
          </motion.div>
          <div className="mt-16 lg:mt-20">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={mapVariants}
            >
              <div className="rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11672.945750644447!2d-122.42107853750231!3d37.7730507907087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858070cc2fbd55%3A0xa71491d736f62d5c!2sGolden%20Gate%20Bridge!5e0!3m2!1sen!2sus!4v1619524992238!5m2!1sen!2sus"
                  width="100%"
                  height="480"
                  style={{ border: 0 }}
                  loading="lazy"
                ></iframe>
              </div>
              <div>
                <div className="max-w-full mx-auto rounded-lg overflow-hidden">
                  <div className="px-6 py-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Our Address
                    </h3>
                    <p className="mt-1 text-gray-600">
                      123-c Near church road Ernakulam
                    </p>
                  </div>
                  <div className="border-t border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-medium text-gray-900">Hours</h3>
                    <p className="mt-1 text-gray-600">
                      Monday - Friday: 9am - 5pm
                    </p>
                    <p className="mt-1 text-gray-600">Saturday: 10am - 4pm</p>
                    <p className="mt-1 text-gray-600">Sunday: Closed</p>
                  </div>
                  <div className="border-t border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Contact
                    </h3>
                    <p className="mt-1 text-gray-600">Email: vitamedica@.com</p>
                    <p className="mt-1 text-gray-600">Phone: +91 6787866544</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default ContactLocationComponent;
