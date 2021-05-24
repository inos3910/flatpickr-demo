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
    return fetch(`https://holidays-jp.github.io/api/v1/${year}/date.json`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then((json) => {
      return json;
    })
    .catch((reason) => {
      console.error(reason);
    });
  }

  async flatpickrInit() {
    flatpickr.l10ns.ja.firstDayOfWeek = 0;

    //最小は明日
    const minDate = new Date();
    this.minDate = minDate.setDate(minDate.getDate() + 1);
    //最大は3ヶ月
    const maxDate = new Date();
    this.maxDate = maxDate.setMonth(maxDate.getMonth() + 3);

    this.holidays = await this.fetchHolidays();

    this.addDatePicker0();
    this.addDatePicker1();
    this.addDatePicker2();
    this.addDatePicker3();
    this.addDatePicker4();
    this.addDatePicker5();
    this.addDatePicker6();
    this.addDatePicker7();
  }

  //デフォルト
  addDatePicker0() {
    this.datepicker0 = flatpickr('#js-datepicker-0');
  }

  //日本語表示
  addDatePicker1() {
    this.datepicker1 = flatpickr('#js-datepicker-1', {
      locale            : Japanese,
      dateFormat        : 'Y.m.d（D）'
    });
  }

  //期間指定
  addDatePicker2() {
    this.datepicker2 = flatpickr('#js-datepicker-2', {
      locale            : Japanese,
      dateFormat        : 'Y.m.d（D）',
      minDate           : this.minDate,
      maxDate           : this.maxDate,
    });
  }

  //祝日設定
  addDatePicker3() {
    this.datepicker3 = flatpickr('#js-datepicker-3', {
      locale            : Japanese,
      dateFormat        : 'Y.m.d（D）',
      minDate           : this.minDate,
      maxDate           : this.maxDate,
      onDayCreate       : (dObj, dStr, fp, dayElem) => {
        //祝日はclassをつける
        this.addHolidayClass(dayElem);
      },
    });
  }

  //任意の日時を非表示
  addDatePicker4() {
    //明日
    const tommorow = new Date();
    tommorow.setDate(tommorow.getDate() + 1);

    //5日後の日時
    const fiveDaysLater = new Date();
    fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);

    //10日後の日時
    const tenDaysLater = new Date();
    tenDaysLater.setDate(tenDaysLater.getDate() + 10);

    this.datepicker4 = flatpickr('#js-datepicker-4', {
      locale            : Japanese,
      dateFormat        : 'Y.m.d（D）',
      minDate           : this.minDate,
      maxDate           : this.maxDate,
      onDayCreate       : (dObj, dStr, fp, dayElem) => {
        //祝日はclassをつける
        this.addHolidayClass(dayElem);
      },
      disable           : [
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
      enableTime : true,
      noCalendar : true,
      dateFormat : "H:i",
      time_24hr  : true,
    });
  }

  //カレンダーと時間を同時に表示
  addDatePicker7(){
    this.datepicker5 = flatpickr('#js-datepicker-7', {
      locale        : Japanese,
      dateFormat    : 'Y.m.d（D）H:i',
      //disableMobile : true,
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

        let dates = [];
        //明日
        const tommorow = new Date();
        tommorow.setDate(tommorow.getDate() + 1);

        //2日後の日時
        const twoDaysLater = new Date();
        twoDaysLater.setDate(twoDaysLater.getDate() + 2);

        //3日後の日時
        const threeDaysLater = new Date();
        threeDaysLater.setDate(threeDaysLater.getDate() + 3);

        dates = [
        this.formatDate(tommorow),
        this.formatDate(twoDaysLater),
        this.formatDate(threeDaysLater),
        ...dates
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

  //日付をフォーマット YYYY-MM-DD
  formatDate(date) {
    const year      = date.getFullYear();
    const month     = date.getMonth() + 1;
    const mm        = ('00' + month).slice(-2);
    const day       = date.getDate();
    const dd        = ('00' + day).slice(-2);
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



}
new Main();
