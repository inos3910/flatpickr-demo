import Main from './main';
class Events extends Main {
  constructor() {
    super();

    this.bind();
  }

  /*
  * クリックとタップを分ける
  * @param {Object} target ターゲット要素
  * @param {Number} func 実行する関数
  */
  touchEventHandler(targetName, func){
    const $target = document.querySelector(targetName);
    if(!$target){
      return;
    }

    $target.addEventListener('click', (e) => {
      if(this.isTouch){
        return;
      }

      func(e);
    },{passive: false});

    $target.addEventListener('touchstart', (e) => {
      if(!this.isTouch){
        return;
      }

      func(e);
    },{passive: false});
  }

   /*
  * 複数要素のクリックとタップを分ける
  * @param {Object} target ターゲット要素
  * @param {Number} func 実行する関数
  */
  multipleTouchEventHandler(targetName, func){
    const $targets = document.querySelectorAll(targetName);
    [...$targets].forEach(target => {
      target.addEventListener('click', (e) => {
        if(this.isTouch){
          return;
        }

        func(e);
      },{passive: false});

      target.addEventListener('touchstart', (e) => {
        if(!this.isTouch){
          return;
        }

        func(e);
      },{passive: false});
    });
  }

  bind() {

    //スマホ：メニューボタンタップ
    document.addEventListener('click', (e) => {
      if(this.isTouch){
        return;
      }

      const self = e.target || e.srcElement;
      if(self.id !== 'js-menu-btn'){
        return;
      }

      if(e.cancelable){
        e.preventDefault();
      }

      this.toggleMenu();
    },{passive: false});

    document.addEventListener('touchstart', (e) => {
      if(!this.isTouch){
        return;
      }

      const self = e.target || e.srcElement;
      if(self.id !== 'js-menu-btn'){
        return;
      }

      if(e.cancelable){
        e.preventDefault();
      }

      this.toggleMenu();
    },{passive: false});

    //スマホ：メニュ-閉じる
    this.multipleTouchEventHandler('.js-menu-close', (e) => {
      if(e.cancelable){
        e.preventDefault();
      }
      this.closeMenu();
    });

    //アンカースクロール
    this.multipleTouchEventHandler('a', (e) => {
      this.anchorScroll(e, () => {
        this.closeMenu();
      });
    });

    //電話番号リンク PCは無効化
    this.multipleTouchEventHandler('a[href^="tel:"]', (e) => {
      if(!this.isPC){
        return;
      }
      if(e.cancelable){
        e.preventDefault();
      }
    });
  }
}

export default Events;