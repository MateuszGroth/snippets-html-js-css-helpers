
(()=>{
    const header = document.querySelector('header'),
        sectionOne = document.querySelector('.home-intro'),
        sectionOneOptions = {rootMargin : '-200px 0px 0px 0px'},
        sectionOneObserver = new IntersectionObserver((entries, sectionOneObserver)=>{
        entries.forEach(entry=>{
            console.log('wcjpd');
            if (!entry.isIntersecting){
                header.classList.add('nav-scrolled');
            } else {
                header.classList.remove('nav-scrolled');
            }
        });
    }, sectionOneOptions);
    
    sectionOneObserver.observe(sectionOne);
})();


(()=>{
    const faders = document.querySelectorAll('.fade-in'),
    fadersObserverOptions = {rootMargin : '0px 0px -250px 0px', threshold : 0},
    faderObserver = new IntersectionObserver((entries, faderObserver)=>{
    entries.forEach(entry=>{
        if (entry.isIntersecting){
            entry.target.classList.add('appear');
            faderObserver.unobserve(entry.target);
        } 
    });
}, fadersObserverOptions);
    faders.forEach(fader=>{faderObserver.observe(fader)});
})();

(()=>{
    const sliders = document.querySelectorAll('.slide-in'),
    slidersObserverOptions = {rootMargin : '0px 0px -100px 0px', threshold : 0},
    slidersObserver = new IntersectionObserver((entries, slidersObserver)=>{
    entries.forEach(entry=>{
        if (entry.isIntersecting){
            entry.target.classList.add('appear');
            slidersObserver.unobserve(entry.target);
        } 
    });
}, slidersObserverOptions);
sliders.forEach(slider=>{slidersObserver.observe(slider)});
})();

(()=>{
    const preloadImage = (img)=>{
        const src = img.getAttribute('data-src');
        if(!src) return;
        img.src = src;
    }

    const images = document.querySelectorAll('[data-src]')
    const imgOptions = {rootMargin : '0px 0px 400px 0px'};
    const imgObserver = new IntersectionObserver((entries, imgObserver)=>{
        entries.forEach(entry=>{
            if (!entry.isIntersecting) return;
            
            preloadImage(entry.target);
            imgObserver.unobserve(entry.target)
        });
    },imgOptions);

    images.forEach(img=>{imgObserver.observe(img)});
})();