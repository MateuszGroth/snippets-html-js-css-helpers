import React, {
  useState,
  useEffect,
  Fragment,
  useContext,
  useRef,
} from 'react';

import { context } from 'utils/context';

const defaultAlt = 'Image Alt';
const options = {
  root: null, // viewport - widok
  threshhold: 0, // czesc jaka musi byc widoczna
  rootMargin: '150px 0px 150px 0px', // margin
};

export default function Image(props) {
  const { cache } = useContext(context);
  const { imageSrc = defaultAlt, preload = false, alt } = props;
  const imageRef = useRef(null);
  const [loadImage, setLoadImage] = useState(preload);
  const [imageSource, setImageSource] = useState(null);

  const getCachedImage = async () => {
    const cachedImage = await cache.match(imageSrc);
    if (cachedImage == null) {
      try {
        cache.add(imageSrc);
      } catch (e) {
        console.log('Internal cache is overloaded');
      }
      setImageSource(imageSrc);

      return;
    }

    const blob = await cachedImage.blob();
    const imageObjectURL = URL.createObjectURL(blob);
    setImageSource(imageObjectURL);
  };

  useEffect(() => {
    if (imageRef.current == null) {
      return;
    }
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        setLoadImage(true);
        imgObserver.unobserve(entry.target);
      });
    }, options);

    imgObserver.observe(imageRef.current);

    return () => {
      if (!imageRef.current) {
        return;
      }
      imgObserver.unobserve(imageRef.current);
    };
  }, [imageRef]);

  useEffect(() => {
    if (!loadImage || imageSource != null) {
      return;
    }

    if (cache == null) {
      return;
    }

    if (cache === false) {
      setImageSource(imageSrc);
      return;
    }

    getCachedImage();
  }, [loadImage, cache]);

  let className = `mateusz-image`;

  if (props.className) {
    className += ` ${props.className}`;
  }
  if (loadImage) {
    className += ` mateusz-image--loaded`;
  }

  return (
    <Fragment>
      {imageSource != null && loadImage && cache != null ? (
        <img className={className} src={imageSource} alt={alt || defaultAlt} />
      ) : alt != null && cache != null ? (
        <img ref={imageRef} className={className} alt={alt} />
      ) : (
        <img ref={imageRef} className={className} />
      )}
    </Fragment>
  );
}
