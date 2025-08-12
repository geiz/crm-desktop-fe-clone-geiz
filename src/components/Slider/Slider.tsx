import cn from 'classnames';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import { FC, useEffect, useRef, useState } from 'react';

import ImgInfo from 'components/Slider/ImgInfo';
import Button from 'components/ui/Button';

import { FileImg } from 'types/common';

import styles from './Slider.module.css';

import 'overlayscrollbars/overlayscrollbars.css';

interface SliderProps {
    imageData: FileImg[];
    activeIndex: number;
}

const Slider: FC<SliderProps> = ({ imageData, activeIndex = 0 }) => {
    const thumbRef = useRef<HTMLDivElement | null>(null);
    const [slideIndex, setSlideIndex] = useState<number>(0);
    const [animation, setAnimation] = useState<'fadeIn' | 'fadeOut'>('fadeIn');
    const multipleImages = imageData.length > 1;

    useEffect(() => {
        if (activeIndex) setSlideIndex(activeIndex);
    }, [activeIndex]);

    // next = 1 // prev = -1
    const slide = (direction: number) => {
        setAnimation('fadeOut');
        setTimeout(() => {
            setSlideIndex(prevIndex => (prevIndex + direction + imageData.length) % imageData.length);
            setAnimation('fadeIn');
        }, 300); // animation time
    };

    const selectSlide = (index: number) => {
        setAnimation('fadeOut');
        setTimeout(() => {
            setSlideIndex(index);
            setAnimation('fadeIn');
        }, 300);
    };

    return (
        <div className={styles.imageSliderContainer}>
            <div className={styles.imageSliderWrap}>
                <div className={styles.sliderWrap}>
                    {multipleImages && (
                        <Button
                            onClick={() => slide(-1)}
                            btnStyle='icon-btn'
                            aria-label='prev'
                            className={styles.prev}
                            icon='drop-down'
                            type='button'
                        />
                    )}

                    <div className={cn(styles.slider, styles[multipleImages ? 'many' : 'one'])}>
                        <div className={cn(styles.slide, styles[animation])}>
                            <img src={imageData[slideIndex].url} alt='image' className='img-contain' />
                        </div>
                    </div>

                    {multipleImages && (
                        <Button
                            onClick={() => slide(1)}
                            aria-label='next'
                            btnStyle='icon-btn'
                            className={styles.next}
                            icon='drop-down'
                            type='button'
                        />
                    )}
                </div>
                <div className={cn(styles.infoWrap, styles[multipleImages ? 'many' : 'one'])}>
                    <ImgInfo img={imageData[slideIndex]} />
                    <span className={cn(styles.count, 'body-10M')}>
                        {slideIndex + 1}/{imageData.length}
                    </span>
                </div>
            </div>

            {/* slide thumbnails */}
            {multipleImages && (
                <OverlayScrollbarsComponent className='overlayscrollbars-react' options={{ scrollbars: { theme: 'os-theme-dark' } }}>
                    <div className={cn(styles.thumbnailList, { [styles.flexCenter]: imageData.length <= 4 })} ref={thumbRef}>
                        {imageData.map((img, i) => (
                            <div
                                key={i}
                                onClick={() => selectSlide(i)}
                                className={cn(styles.thumbItem, { [styles.active]: slideIndex === i })}>
                                <img src={img.url} alt='thumb-img' />
                                <ImgInfo img={img} classNames={styles.ellipsis} />
                            </div>
                        ))}
                    </div>
                </OverlayScrollbarsComponent>
            )}
        </div>
    );
};

export default Slider;
