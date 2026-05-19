import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css'
import 'swiper/css/thumbs'
import 'swiper/css/navigation'
//@ts-ignore
import '../../../styles/Components/itemPage/itemPage.css'
import { useState } from 'react'

export function ProductImages({images}: {images: string[]}) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <div className="productImages">
      <Swiper
        modules={[Thumbs, Navigation]}
        thumbs={{ swiper: thumbsSwiper }}
        navigation
        loop={true}
        className="mainSwiper"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <img src={img} alt={`product-${i}`} />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        modules={[Thumbs]}
        onSwiper={setThumbsSwiper}
        slidesPerView={4}
        spaceBetween={8}
        watchSlidesProgress
        className="thumbSwiper"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <img src={img} alt={`thumb-${i}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}