import "core-js/stable";
import "regenerator-runtime/runtime";
import flatpickr from 'flatpickr/dist/flatpickr.min.js';
import { Japanese } from "flatpickr/dist/l10n/ja.js"

class Main {
  constructor() {
    this.flatpickrInit();
  }

  //祝日一覧を取得する
  fetchHolidays() {
    const today = new Date();
    const year  = today.getFullYear();
    const url   = `https://holidays-jp.github.io/api/v1/${year}/date.json`;
    return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }

      return res.json();
    })
    .then((json) => json)
    .catch((reason) => {
      console.error(reason);
    });
  }

  //日付をフォーマット YYYY-MM-DD
  formatDate(date) {
    const year  = date.getFullYear();
    const month = date.getMonth() + 1;
    const mm    = ('00' + month).slice(-2);
    const day   = date.getDate();
    const dd    = ('00' + day).slice(-2);
    return `${year}-${mm}-${dd}`;
  }

  //祝日の場合にクラスをつける
  addHolidayClass(dayElem){
    const date      = dayElem.dateObj;
    const selectDay = this.formatDate(date);
    if(selectDay in this.holidays){
      dayElem.classList.add('is-holiday');
    }
  }

  async flatpickrInit() {
    //期間制限用の値
    //最小は翌日
    const minDate = new Date();
    this.minDate = minDate.setDate(minDate.getDate() + 1);
    //最大は3ヶ月
    const maxDate = new Date();
    this.maxDate = maxDate.setMonth(maxDate.getMonth() + 3);
    //祝日を取得
    this.holidays = await this.fetchHolidays();
    //関数を実行
    for (let i = 0; i <= 9; ++i) {
      this[`addDatePicker${i}`]();
    }
  }

  //デフォルト
  addDatePicker0() {
    this.datepicker0 = flatpickr('#js-datepicker-0');
  }

  //日本語表示
  addDatePicker1() {
    this.datepicker1 = flatpickr('#js-datepicker-1', {
      locale      : Japanese,
      dateFormat  : 'Y.m.d（D）',
      defaultDate : new Date()
    });
  }

  //期間指定
  addDatePicker2() {
    this.datepicker2 = flatpickr('#js-datepicker-2', {
      locale      : Japanese,
      dateFormat  : 'Y.m.d（D）',
      defaultDate : this.minDate,
      minDate     : this.minDate,
      maxDate     : this.maxDate,
    });
  }

  //祝日設定
  addDatePicker3() {
    this.datepicker3 = flatpickr('#js-datepicker-3', {
      locale      : Japanese,
      dateFormat  : 'Y.m.d（D）',
      defaultDate : this.minDate,
      minDate     : this.minDate,
      maxDate     : this.maxDate,
      onDayCreate : (dObj, dStr, fp, dayElem) => {
        //祝日はclassをつける
        this.addHolidayClass(dayElem);
      }
    });
  }

  //特定の期間を選択不可にする
  addDatePicker4() {
    //翌日
    const tommorow = new Date();
    tommorow.setDate(tommorow.getDate() + 1);

    //5日後の日時
    const fiveDaysLater = new Date();
    fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);

    //10日後の日時
    const tenDaysLater = new Date();
    tenDaysLater.setDate(tenDaysLater.getDate() + 10);

    this.datepicker4 = flatpickr('#js-datepicker-4', {
      locale      : Japanese,
      dateFormat  : 'Y.m.d（D）',
      defaultDate : this.minDate,
      minDate     : this.minDate,
      maxDate     : this.maxDate,
      onDayCreate : (dObj, dStr, fp, dayElem) => {
        //祝日はclassをつける
        this.addHolidayClass(dayElem);
      },
      disable     : [
      // 明日を非表示に
      this.formatDate(tommorow),
      //5日後 ~ 10日後までを非表示
      {
        from: this.formatDate(fiveDaysLater),
        to:  this.formatDate(tenDaysLater)
      },
      //水曜日だけ非表示
      (date) => date.getDay() === 3
      ],
    });
  }

  //カレンダーと時間を同時に表示
  addDatePicker5(){
    this.datepicker5 = flatpickr('#js-datepicker-5', {
      locale      : Japanese,
      dateFormat  : 'Y.m.d（D）H:i',
      defaultDate : this.minDate,
      minDate     : this.minDate,
      maxDate     : this.maxDate,
      enableTime  : true,
      minTime     : '09:00',
      maxTime     : '18:00',
      onDayCreate : (dObj, dStr, fp, dayElem) => {
        //祝日はclassをつける
        this.addHolidayClass(dayElem);
      },
    });
  }

  //時間のみ
  addDatePicker6(){
    this.datepicker6 = flatpickr('#js-datepicker-6', {
      enableTime  : true,
      noCalendar  : true,
      dateFormat  : "H:i",
      defaultDate : this.minDate,
      time_24hr   : true,
    });
  }

  //カレンダーと時間を同時に表示
  addDatePicker7(){
    this.datepicker7 = flatpickr('#js-datepicker-7', {
      locale        : Japanese,
      dateFormat    : 'Y.m.d（D）H:i',
      defaultDate   : this.minDate,
      minDate       : this.minDate,
      maxDate       : this.maxDate,
      enableTime    : true,
      minTime       : '09:00',
      maxTime       : '18:00',
      onDayCreate   : (dObj, dStr, fp, dayElem) => {
        //祝日はclassをつける
        this.addHolidayClass(dayElem);
      },
      onChange      : (selectedDates, dateStr, instance) => {
        if(!selectedDates[0]){
          return;
        }

        //明日
        const tommorow = new Date();
        tommorow.setDate(tommorow.getDate() + 1);

        //2日後の日時
        const twoDaysLater = new Date();
        twoDaysLater.setDate(twoDaysLater.getDate() + 2);

        //3日後の日時
        const threeDaysLater = new Date();
        threeDaysLater.setDate(threeDaysLater.getDate() + 3);

        const dates = [
        this.formatDate(tommorow),
        this.formatDate(twoDaysLater),
        this.formatDate(threeDaysLater)
        ];

        const selectDate = this.formatDate(selectedDates[0]);

        //明日〜3日後は10::00〜20:00
        if(dates.includes(selectDate)){
          instance.set('minTime', '10:00');
          instance.set('maxTime', '20:00');
        }
        //日曜は13:00〜20:00
        else if(selectedDates[0].getDay() === 0){
          instance.set('minTime', '13:00');
          instance.set('maxTime', '20:00');
        }
        else {
          instance.set('minTime', '09:00');
          instance.set('maxTime', '18:00');
        }
      },
    });
  }

  //カレンダーの日付変更に合わせて別枠の時間表示を変更する
  addDatePicker8(){
    this.datepicker8 = flatpickr('#js-datepicker-8', {
      locale        : Japanese,
      dateFormat    : 'Y.m.d（D）',
      defaultDate   : this.minDate,
      minDate       : this.minDate,
      maxDate       : this.maxDate,
      onDayCreate   : (dObj, dStr, fp, dayElem) => {
        //祝日はclassをつける
        this.addHolidayClass(dayElem);
      },
      onChange      : (selectedDates, dateStr, instance) => {
        if(!selectedDates[0]){
          return;
        }
        this.timeChangeByDate(selectedDates[0]);
      },
      onClose       : (selectedDates, dateStr, instance) => {
        if(!selectedDates[0]){
          return;
        }
        this.timeChangeByDate(selectedDates[0])
      },
      onReady       : (selectedDates, dateStr, instance) => {
        this.timeChangeByDate(selectedDates[0])
      }
    });
  }

  //カレンダーの日付変更に合わせて別枠の時間表示を変更する
  addDatePicker9(){
    this.datepicker9 = flatpickr('#js-datepicker-9', {
      locale        : Japanese,
      dateFormat    : 'Y.m.d（D）',
      defaultDate   : this.minDate,
      minDate       : this.minDate,
      maxDate       : this.maxDate,
      onDayCreate   : (dObj, dStr, fp, dayElem) => {
        //祝日はclassをつける
        this.addHolidayClass(dayElem);
      },
      onChange      : (selectedDates, dateStr, instance) => {
        if(!selectedDates[0]){
          return;
        }
        this.selectTimeChangeByDate(selectedDates[0]);
      },
      onClose       : (selectedDates, dateStr, instance) => {
        if(!selectedDates[0]){
          return;
        }
        this.selectTimeChangeByDate(selectedDates[0])
      },
      onReady       : (selectedDates, dateStr, instance) => {
        this.selectTimeChangeByDate(selectedDates[0])
      }
    });
  }

  //24hの一覧をセレクトボックスに追加
  addTimeList(min = '00:00', max = '23:59') {
    const $time = document.querySelector('#js-time-9');
    if(!$time){
      return;
    }

    const today       = this.formatDate(new Date());
    const minTime     = new Date(`${today} ${min}`);
    const minDateTime = minTime.getTime();
    const maxTime     = new Date(`${today} ${max}`);
    const maxDateTime = maxTime.getTime();

    let optionDom = '';
    for (let i = 0; i < 24; i++) {
      const h = ('00' + i).slice(-2);
      for (let j = 0; j < 60; j++) {
        const m = ('00' + j).slice(-2);
        const optionDate = new Date(`${today} ${h}:${m}`);
        const optionDateTime = optionDate.getTime();
        if(optionDateTime < minDateTime || optionDateTime > maxDateTime){
          continue;
        }
        optionDom += `<option value="${h}:${m}">${h}:${m}</option>`;
      }
    }
    $time.insertAdjacentHTML('beforeend', optionDom);
  }

  //日付によって時間（input type=time）を変更する
  timeChangeByDate(selectedDate) {
    const $time = document.querySelector('#js-time-8');
    if(!$time){
      return;
    }

    //明日
    const tommorow = new Date();
    tommorow.setDate(tommorow.getDate() + 1);

    //2日後の日時
    const twoDaysLater = new Date();
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);

    //3日後の日時
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const dates = [
    this.formatDate(tommorow),
    this.formatDate(twoDaysLater),
    this.formatDate(threeDaysLater)
    ];

    const selectDay = this.formatDate(selectedDate);

    //明日〜3日後は10::00〜20:00
    if(dates.includes(selectDay)){
      $time.min = '10:00';
      $time.max = '20:00';
    }
    //日曜は13:00〜20:00
    else if(selectedDate.getDay() === 0){
      $time.min = '13:00';
      $time.max = '20:00';
    }
    //デフォルト09:00〜18:00
    else {
      $time.min = '09:00';
      $time.max = '18:00';
    }

  }

  //日付によって時間（select）を変更する
  selectTimeChangeByDate(selectedDate) {
    const $time = document.querySelector('#js-time-9');
    if(!$time){
      return;
    }

    //明日
    const tommorow = new Date();
    tommorow.setDate(tommorow.getDate() + 1);

    //2日後の日時
    const twoDaysLater = new Date();
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);

    //3日後の日時
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const dates = [
    this.formatDate(tommorow),
    this.formatDate(twoDaysLater),
    this.formatDate(threeDaysLater)
    ];

    $time.innerHTML = '';

    const selectDay = this.formatDate(selectedDate);

    //明日〜3日後は10:00〜20:00
    if(dates.includes(selectDay)){
      this.addTimeList('10:00', '20:00');
    }
    //日曜は13:00〜20:00
    else if(selectedDate.getDay() === 0){
      this.addTimeList('13:00', '20:00');
    }
    //デフォルト09:00〜18:00
    else {
      this.addTimeList('09:00', '18:00');
    }

  }

}
new Main();
