import React, { useState } from 'react';

const VideoSection = () => {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-blue-600">
      <div className="container mx-auto px-5">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[490px] py-[100px] lg:py-[140px]">
              <span className="block mb-3 text-base font-semibold text-white">
                Watch Our Intro Video
              </span>
              <h2 className="mb-6 text-3xl font-bold leading-snug text-white sm:text-4xl sm:leading-snug md:text-[40px] md:leading-snug">
                Making world a better place for you and us
              </h2>
              <p className="text-base leading-relaxed text-white mb-9">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                at quam fringilla, scelerisque nisl in, accumsan diam. Quisque
                sollicitudin risus eu tortor euismod imperdiet.
              </p>
              <a
                href="javascript:void(0)"
                className="inline-block py-3 text-base font-medium text-white border border-white rounded-full px-9 hover:bg-white hover:text-primary"
              >
                Know More
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="top-0 right-0 z-10 w-full h-full lg:absolute lg:w-1/2">
        <div className="flex items-center justify-center w-full h-full bg-bg-tenant bg-no-repeat bg-cover">
          <a
            href="javascript:void(0)"
            onClick={() => setVideoOpen(true)}
            className="absolute z-40 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 md:h-[100px] md:w-[100px]"
          >
            <span className="absolute top-0 right-0 z-[-1] h-full w-full animate-ping rounded-full bg-primary bg-opacity-20 delay-300 duration-1000"></span>
            <svg
              width="23"
              height="27"
              viewBox="0 0 23 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.5 12.634C23.1667 13.0189 23.1667 13.9811 22.5 14.366L2.25 26.0574C1.58333 26.4423 0.750001 25.9611 0.750001 25.1913L0.750002 1.80866C0.750002 1.03886 1.58334 0.557731 2.25 0.942631L22.5 12.634Z"
                fill="white"
              />
            </svg>
          </a>
        </div>
      </div>

      <span className="absolute left-0 top-0 z-[-1]">
        <svg
          width="644"
          height="489"
          viewBox="0 0 644 489"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="196" cy="41" r="448" fill="white" fillOpacity="0.04" />
        </svg>
      </span>
      <span className="absolute left-0 top-0 z-[-1]">
        <svg
          width="659"
          height="562"
          viewBox="0 0 659 562"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="211" cy="114" r="448" fill="white" fillOpacity="0.04" />
        </svg>
      </span>
      <span className="absolute right-3 top-3 z-[-1] lg:right-1/2 lg:mr-3">
        <svg
          width="50"
          height="79"
          viewBox="0 0 50 79"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="47.7119"
            cy="76.9617"
            r="1.74121"
            transform="rotate(180 47.7119 76.9617)"
            fill="white"
          />
          <circle
            cx="47.7119"
            cy="61.6385"
            r="1.74121"
            transform="rotate(180 47.7119 61.6385)"
            fill="white"
          />
          <circle
            cx="47.7119"
            cy="46.3163"
            r="1.74121"
            transform="rotate(180 47.7119 46.3163)"
            fill="white"
          />
          <circle
            cx="47.7119"
            cy="16.7159"
            r="1.74121"
            transform="rotate(180 47.7119 16.7159)"
            fill="white"
          />
          <circle
            cx="47.7119"
            cy="31.3421"
            r="1.74121"
            transform="rotate(180 47.7119 31.3421)"
            fill="white"
          />
          <circle
            cx="47.7119"
            cy="1.74122"
            r="1.74121"
            transform="rotate(180 47.7119 1.74122)"
            fill="white"
          />
          <circle
            cx="32.3916"
            cy="76.9617"
            r="1.74121"
            transform="rotate(180 32.3916 76.9617)"
            fill="white"
          />
          <circle
            cx="32.3877"
            cy="61.6384"
            r="1.74121"
            transform="rotate(180 32.3877 61.6384)"
            fill="white"
          />
          <circle
            cx="32.3916"
            cy="46.3162"
            r="1.74121"
            transform="rotate(180 32.3916 46.3162)"
            fill="white"
          />
          <circle
            cx="32.3916"
            cy="16.7161"
            r="1.74121"
            transform="rotate(180 32.3916 16.7161)"
            fill="white"
          />
          <circle
            cx="32.3877"
            cy="31.342"
            r="1.74121"
            transform="rotate(180 32.3877 31.342)"
            fill="white"
          />
          <circle
            cx="32.3916"
            cy="1.74145"
            r="1.74121"
            transform="rotate(180 32.3916 1.74145)"
            fill="white"
          />
          <circle
            cx="17.0674"
            cy="76.9617"
            r="1.74121"
            transform="rotate(180 17.0674 76.9617)"
            fill="white"
          />
          <circle
            cx="17.0674"
            cy="61.6384"
            r="1.74121"
            transform="rotate(180 17.0674 61.6384)"
            fill="white"
          />
          <circle
            cx="17.0674"
            cy="46.3162"
            r="1.74121"
            transform="rotate(180 17.0674 46.3162)"
            fill="white"
          />
          <circle
            cx="17.0674"
            cy="16.7161"
            r="1.74121"
            transform="rotate(180 17.0674 16.7161)"
            fill="white"
          />
          <circle
            cx="17.0674"
            cy="31.342"
            r="1.74121"
            transform="rotate(180 17.0674 31.342)"
            fill="white"
          />
          <circle
            cx="17.0674"
            cy="1.74145"
            r="1.74121"
            transform="rotate(180 17.0674 1.74145)"
            fill="white"
          />
          <circle
            cx="1.74316"
            cy="76.9617"
            r="1.74121"
            transform="rotate(180 1.74316 76.9617)"
            fill="white"
          />
          <circle
            cx="1.74316"
            cy="61.6385"
            r="1.74121"
            transform="rotate(180 1.74316 61.6385)"
            fill="white"
          />
          <circle
            cx="1.74316"
            cy="46.3163"
            r="1.74121"
            transform="rotate(180 1.74316 46.3163)"
            fill="white"
          />
          <circle
            cx="1.74316"
            cy="16.7159"
            r="1.74121"
            transform="rotate(180 1.74316 16.7159)"
            fill="white"
          />
          <circle
            cx="1.74316"
            cy="31.3421"
            r="1.74121"
            transform="rotate(180 1.74316 31.3421)"
            fill="white"
          />
          <circle
            cx="1.74316"
            cy="1.74122"
            r="1.74121"
            transform="rotate(180 1.74316 1.74122)"
            fill="white"
          />
        </svg>
      </span>

      {videoOpen && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-90">
          <div className="relative w-[90%] md:w-[80%] lg:w-[60%] aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://youtube.com/embed/AL_xxRhykGk?si=dPzV23Rv5M9ZtFyz?autoplay=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button
              className="absolute top-0 right-0 text-white"
              onClick={() => setVideoOpen(false)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoSection;
