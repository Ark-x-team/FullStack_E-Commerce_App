import Footer from "../components/Footer";

const AboutUs = () => {
  const coverImage =
    "https://images.pexels.com/photos/3184302/pexels-photo-3184302.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const teamImage =
    "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  return (
    <>
      <div
        className="relative after:absolute after:w-full after:h-full after:bg-gradient-to-t after:from-white dark:after:from-black after:to-transparent after:left-0 after:top-0 
    "
      >
        <div className="h-64 md:h-80 lg:h-96 w-full relative after:absolute after:w-full after:h-full after:bg-gradient-to-t after:from-white dark:after:from-black after:to-transparent after:left-0 after:top-0">
          <img
            src={coverImage}
            alt=""
            className="absolute h-full w-full object-cover lg:object-center"
          />
        </div>
        <h1 className="w-full absolute top-3/4 left-2/4 -translate-x-2/4 -translate-y-2/4 z-10 font-title capitalize text-center text-3xl md:text-4xl lg:text-5xl text-primary ">
          About us
        </h1>
      </div>
      <div className="main-container px-4 lg:px-4 my-12 md:my-16 lg:my-20">
        <div className="flex flex-col lg:flex-row lg:justify-evenly items-center gap-8 md:gap-14 lg:gap-28">
          <span className="flex flex-col gap-4 lg:max-w-xl">
            <h1 className="text-2xl md:text-3xl lg:text-4xl capitalize">
              Lorem ipsum dolor sit.
            </h1>
            <p className="dark:text-light">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
              aliquid, corporis enim laudantium accusamus fugit sequi,
              laboriosam eum velit odio earum odit modi facere sed atque minima
              consequuntur numquam unde.
            </p>
          </span>
          <div className="h-fit relative -rotate-3 after:absolute after:w-full after:h-full after:bg-gradient-to-tr after:from-white dark:after:from-black after:to-transparent after:left-0 after:top-0">
            <img
              src={teamImage}
              alt="design"
              className="w-80 md:w-96 lg:w-80 h-60 md:h-72 lg:h-60 rounded-3xl object-cover"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;