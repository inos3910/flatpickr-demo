import 'lazysizes';
import 'lazysizes/plugins/aspectratio/ls.aspectratio.js';
require('intersection-observer');

export class Utils {
  constructor() {
    this.win     = $(window);
    this.doc     = $(document);
    this.body    = $('body');
    this.html    = $('html');
    this.isTouch = this.isTouchDevice();

    this.default();
  }

  //初期設定
  default() {
    this.lazyload();
    this.objectFitImages();
    this.picturefill();
    this.scrollEffectByPosition();
    this.setIntersectionObserver();
  }

  //タッチデバイス判定
  isTouchDevice() {
    const isTouch  = ('ontouchstart' in document) && ('orientation' in window);
    const isSp     = this.isSp();
    const isTablet = this.isTablet();
    return isTouch && (isSp || isTablet);
  }

  //lazysizes
  lazyload() {
    if (typeof lazySizes != 'undefined') {
      lazySizes.cfg.throttleDelay = 66;
      lazySizes.cfg.loadMode  = 2;
      lazySizes.cfg.expFactor = 3;
    }
  }

  //css object-fit polyfill
  objectFitImages() {
    if (typeof objectFitImages != 'undefined') {
      objectFitImages('img');
    }
  }

  //css object-fit polyfill
  picturefill() {
    if (typeof picturefill != 'undefined') {
      picturefill();
    }
  }

  //スマホ判定
  isSp() {
    const ua = navigator.userAgent;
    const isSp = (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || (ua.indexOf('Android') > 0) && (ua.indexOf('Mobile') > 0) || ua.indexOf('Windows Phone') > 0);
    return isSp;
  }

  //タブレット判定
  isTablet() {
    const ua = navigator.userAgent;
    const isSp = this.isSp();
    if(isSp){
      return false;
    }
    //タブレットの場合
    else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
      return true;
    }
    else{
      return false;
    }
  }

  //PC判定
  isPC() {
    return !(this.isSp() || this.isTablet());
  }

  //各デバイス判定
  device() {
    return {
      isSp     : this.isSp(),
      isTablet : this.isTablet(),
      isPC     : this.isPC()
    };
  }

  //IE・Edge判定
  isIE() {
    const ua = navigator.userAgent.toLowerCase();
    const isIE = (ua.indexOf('msie') > -1 || ua.indexOf('trident') > -1 || ua.indexOf('edge') > -1);
    return isIE;
  }

  /*
  * ターゲット位置へのスクロールアニメーション
  * @param {Object} target ターゲット要素
  * @param {Number} speed ターゲット要素
  */
  scrollTo(target, speed) {
    if (!$(target)[0]) {
      return;
    }
    const targetPos    = $(target).offset().top;
    const $header      = $('#js-header');
    const headerHeight = $header[0] ? $header.innerHeight() : 0;
    return anime({
      targets     : 'html,body',
      scrollTop   : targetPos - headerHeight,
      duration    : speed ? speed : 800,
      easing      : 'easeInOutExpo',
      elasticity  : 300,
      begin       : () => {
        this.noevent();
      },
      complete    : () => {
        this.cancelNoevent();
      }
    });
  }

  scrollControl(e){
    e.preventDefault();
  }

  noevent(){
    const $html = $('html');
    $html.addClass('u-noevent');
    document.addEventListener('touchmove', this.scrollControl, {passive: false});
  }

  cancelNoevent(){
    const $html = $('html');
    $html.removeClass('u-noevent');
    document.removeEventListener('touchmove', this.scrollControl, {passive: false});
  }

  /*
  * アンカースクロール
  * @param {Object} e イベントオブジェクト
  * @param {Function} cb コールバック関数
  */
  anchorScroll(e, cb = null) {
    const $target = $(e.currentTarget.hash);
    if(!$target[0]){
      return;
    }

    if(e.cancelable){
      e.preventDefault();
    }
    e.stopPropagation();
    this.scrollTo($target, 800);
    if(cb){
      cb();
    }
  }


  //画面内の位置で要素を出現させるエフェクト
  setIntersectionObserver(elems = null){
    const _elems = elems ? elems : document.querySelectorAll('.is-ev');
    const options = {
      threshold: 0
    }

    const callback = (entries, observer) => {
      entries.forEach(entry => {
       if (entry.isIntersecting) {
         entry.target.classList.add('is-effect');
         observer.unobserve(entry.target);
       }
     });
    }

    const observer  = new IntersectionObserver(callback, options);

    const observers = Array.from(_elems);
    observers.forEach(el => {
      observer.observe(el);
    });
  }

  //スクロール位置が要素を超えていたらエフェクトを発火
  scrollEffectByPosition(){
    const scrollPosition = this.win.scrollTop();
    const $observers = $('.is-ev');
    $.each($observers, (i, el) => {
      const $target = $(el);
      const targetPosition = $target.offset().top;
      if(scrollPosition >= targetPosition){
        $target.addClass('is-effect');
      }
    });
  }
}

export default Utils;