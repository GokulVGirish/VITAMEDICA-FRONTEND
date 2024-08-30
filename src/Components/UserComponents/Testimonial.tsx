import image from "@/assets/me.jpg";
function Testimonial() {
  return (
    <section className="flex flex-col items-center p-4">
      <p className="max-w-4xl text-xl font-medium text-center md:text-2xl lg:text-3xl">
        "VITAMEDICA is dedicated to delivering exceptional healthcare services,
        aiming to enhance the well-being and quality of life for individuals,Our
        mission is to provide superior health facilities that cater to the
        diverse needs of our community, fostering an environment of trust,
        innovation, and holistic healing"
      </p>
      <footer className="flex items-center gap-3 mt-6 md:mt-12">
        <img
          className="flex-shrink-0 w-12 h-12 border rounded-full border-black/10"
          src={image}
          alt="Sebastiaan Kloos"
          loading="lazy"
        />
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-bold tracking-tight"
        >
          <p>Gokul Girish</p>
          <p className="font-medium text-black/60">Founder of VITAMEDICA</p>
        </a>
      </footer>
    </section>
  );
}

export default Testimonial;
