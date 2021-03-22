// ! will not work
// js will be executed before the drawing even happens, so the opacity 0 will not be even noticed
// el will be created with opacity 1 from the start
// it is like
// opacity = 0, then append then add transition, then opacity = 1, then draw, so it sees opacity 1 when drawing - did not see 0
const el = document.createElement('div');
el.style.opacity = '0';
body.appendChild(el);
el.style.transition = 'opacity 500ms ease-in-out';
el.style.opacity = '1';

// ? this will work
// because it will draw the element to getComputedStyle, so it gets drawned with opacity 0
const el = document.createElement('div');
el.style.opacity = '0';
body.appendChild(el);
getComputedStyle(el).opacity;
el.style.transition = 'opacity 500ms ease-in-out';
el.style.opacity = '1';

// if wanna remove el when transition ends
// like this

el.style.opacity = '0';

el.addEventListener('transitionend', (ev) => {
  // ! have to check if ev.target is the el, because the transitionend might be called when some inside transition ends
  if (ev.target !== el) return;
  el.remove();
});

// but if it is already opacity 0, it will not fire the transitionend so gotta do smth like this

if (getComputedStyle(el).opacity === '0') {
  el.remove();

  return;
}
el.style.opacity = '0';

el.addEventListener('transitionend', (ev) => {
  // ! have to check if ev.target is the el, because the transitionend might be called when some inside transition ends
  if (ev.target !== el) return;
  el.remove();
});

// best fade in is in simple css anim
/*

    @keyframes fade-in{
        from {
            opacity: 0;
        }
    }
    @keyframes fade-out{
        to {
            opacity: 0;
        }
    }
*/
const el = document.createElement('div');
el.style.animation = 'fade-in 500ms ease';
body.appendChild(el);

// then to remove el when fade out
// even if el is already opacity 0, the animationend will be called, so no need another checks

el.style.animation = 'fade-out 500ms ease';
el.addEventListener('animationend', (ev) => {
  if (ev.target !== el) return;
  el.remove();
});

// or best atm with js

const el = document.createElement('div');
body.appendChild(el);
el.animate(
  {
    opacity: 0,
    offset: 0,
  },
  {
    duration: 500,
    easing: 'ease-in-out',
  }
);

const anim = el.animate(
  { opacity: '0' },
  { duration: 500, easing: 'ease-in-out' }
);

// !this is bugged , promise resolved too late
anim.finished().then(() => el.remove());

// use that
anim.onfinish = () => el.remove();

el.animate(
  { opacity: '.2' },
  { duration: 500, easing: 'ease-in-out', fill: 'forwards' }
);
// but then this wont work, cuz animation has higher priority
el.style.opacity = '0';

// so the end function
function animateTo(el, keyframes, options, callback) {
  const anim = el.animate(keyframes, { ...options, fill: 'both' });
  anim.addEventListener('finish', () => {
    // it will commit the styles of the animation (like opacity: 1) instead of the animation being applied
    // thanks to that, we can cancel animation and simple changes like el.style.opacity = '0'; will work later on
    anim.commitStyles();
    anim.cancel();
    if (callback) {
      callback();
    }
  });
  return anim;
}
