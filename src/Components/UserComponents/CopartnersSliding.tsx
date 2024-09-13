import { useEffect, useRef } from "react";

const CopartnersSliding = () => {
  const logosRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ul = logosRef.current;
    if (ul) {
      ul.insertAdjacentHTML("afterend", ul.outerHTML);
      if (ul.nextSibling instanceof HTMLElement) {
        ul.nextSibling.setAttribute("aria-hidden", "true");
      }
    }
  }, []);

  return (
    <div className="relative font-inter antialiased">
      <main className="relative  flex flex-col justify-center overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 ">
          <div className="text-center">
            <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
              <ul
                ref={logosRef}
                className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
              >
                <li>
                  <img
                    className="h-40"
                    src="https://images.squarespace-cdn.com/content/v1/58f184622994ca3c1df2b123/1533763147491-MDE51UPMJKU93Y27G0EW/Spectrumlogo.png"
                    alt="Spectrum"
                  />
                </li>
                <li>
                  <img
                    className="h-32"
                    src="https://www.hprc.org/wp-content/uploads/2023/11/HealthPartners-Logo-Resized.png"
                    alt="hprc"
                  />
                </li>
                <li>
                  <img
                    className="h-20"
                    src="https://nursestarmedical.com/wp-content/uploads/2022/10/logo-hd.png"
                    alt="nursestar"
                  />
                </li>
                <li>
                  <img
                    className="h-24"
                    src="https://www.icn.ch/sites/default/files/styles/icn_cover_half_width_md/public/2023-05/IND_logo_2017_ENG.jpg?h=48490f64&itok=v_3-ooPD"
                    alt="nurse"
                  />
                </li>
                <li>
                  <img
                    className="h-20"
                    src="https://themedicalpartnersgroup.com/wp-content/uploads/2023/04/The-Medical-Partners-Group-Logo-Final.png"
                    alt="mpg"
                  />
                </li>
                <li>
                  <img
                    className="h-20"
                    src="https://aamsworld.com/wp-content/themes/storefront-child/assets/img/Logo_AAMS.png"
                    alt="ams"
                  />
                </li>
                <li>
                  <img
                    className="h-32"
                    src="https://mms.businesswire.com/media/20211105005139/en/922383/23/enhance_health_logo-color.jpg"
                    alt="enhance"
                  />
                </li>
                <li>
                  <img
                    className="h-20"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd7DbOnnNBC8Th0TKMI-HSb76KbCX7pSlLJYr5-bHp_p9pTsuom8E6EwN5UMtDYCzbiug&usqp=CAU"
                    alt="command"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CopartnersSliding;
