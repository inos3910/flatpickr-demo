import Utils from './utils';
export class Main extends Utils {
  constructor() {
    super();
  }

 /*
  * メニュー開閉
  */
  toggleMenu() {
    this.html.toggleClass('is-menu-active');
  }

  /*
  * メニュー開く
  */
  openMenu() {
    this.html.addClass('is-menu-active');
  }

  /*
  * メニュー閉じる
  */
  closeMenu() {
    this.html.removeClass('is-menu-active');
  }

}

export default Main;