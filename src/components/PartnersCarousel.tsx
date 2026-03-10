import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

import fitnessChef from '@/assets/partners/fitness-chef.png';
import samhaSchool from '@/assets/partners/samha-school.png';
import dabt from '@/assets/partners/dabt.png';
import extraSteps from '@/assets/partners/extra-steps.png';
import alyaChemical from '@/assets/partners/alya-chemical.png';
import lamat from '@/assets/partners/lamat.png';
import pinkpawpal from '@/assets/partners/pinkpawpal.png';
import shapeBoutique from '@/assets/partners/shape-boutique.png';
import divanFlower from '@/assets/partners/divan-flower.png';

const partners = [
  { id: 1, name: 'Fitness Chef', logo: fitnessChef },
  { id: 2, name: 'Samha International School', logo: samhaSchool },
  { id: 3, name: 'Dabt', logo: dabt },
  { id: 4, name: 'Extra Steps', logo: extraSteps },
  { id: 5, name: 'Alya Chemical', logo: alyaChemical },
  { id: 6, name: 'LAMAT', logo: lamat },
  { id: 7, name: 'PinkPawPal', logo: pinkpawpal },
  { id: 8, name: 'Shape Boutique', logo: shapeBoutique },
  { id: 9, name: 'Divan Flower Boutique', logo: divanFlower },
];

const PartnersCarousel = () => {
  return (
    <section className="py-16 border-[0px] border-border partners-swiper">
      <div className="container-custom">
        <div className="relative">
          {/* Left fade shadow */}
          <div className="absolute left-0 top-0 h-full w-32 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, var(--background, white), transparent)' }}
          />
          {/* Right fade shadow */}
          <div className="absolute right-0 top-0 h-full w-32 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, var(--background, white), transparent)' }}
          />

          <Swiper
            dir='rtl'
            freeMode={true}
            modules={[Autoplay]}
            spaceBetween={60}
            slidesPerView={2}
            loop={true}
            speed={1860}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
            className="partners-swiper"
          >
            {partners.map((partner) => (
              <SwiperSlide key={partner.id}>
                <div className="flex items-center justify-center h-24">
                  <div className="partner-logo-container flex items-center justify-center bg-white rounded-xl h-full px-8 py-6">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="h-20 scale-[2.6] w-auto object-cover transition-all duration-300"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default PartnersCarousel;