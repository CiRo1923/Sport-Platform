import axios from 'axios';
import LazyLoad from 'vanilla-lazyload';
import {
  prjs, j$, svgRequire, validate
} from '_factory.js';

new LazyLoad({
  elements_selector: '.lazy',
  use_native: true
});

/* 一次載入使用到的 svg */
svgRequire(require.context('../assets/svg/', true, /\.svg$/));

export const refresh = () => {
  window.location.reload();
};

export const acc = (obj) => {
  for (let i = 0; i < j$(obj.ctrl)[0].length; i += 1) {
    const ctrlElem = j$(obj.ctrl).eq(i);
    const bdElem = j$(obj.bd).eq(i);

    if (ctrlElem.hasClass('act')) {
      bdElem[0][0].style.maxHeight = `${bdElem.height()}px`;
    } else {
      bdElem[0][0].style.maxHeight = 0;
    }
  }

  prjs.$d.on('click', obj.ctrl, e => {
    const elem = j$(e.$this);
    const nextElem = elem.next(obj.bd);
    const maxHeight = parseInt(nextElem[0][0].style.maxHeight, 10);

    elem.toggleClass('act');

    if (maxHeight === 0) {
      nextElem[0][0].style.maxHeight = `${nextElem.height()}px`;
    } else {
      nextElem[0][0].style.maxHeight = 0;
    }
  });
};

prjs.$d.on('click', '.jRefresh', ()=> {
  refresh();
});

j$('[\\:validate]').on('blur', e => {
  const $this = j$(e.$this);

  validate($this);
});

prjs.$d.on('click', '.jSubmit', e => {
  const $cxt = j$('[\\:validate]');
  const $pop = j$('.jPop');
  let isError = 0;

  $cxt[0].forEach(el => {
    validate(j$(el), error => {
      if (error) {
        isError += 1;
      }
    });
  });

  if (isError !== 0) {
    e.preventDefault();
  } else if (j$('[\\:ajax]').attr(':ajax')) {
    const $form = j$('[\\:ajax]');
    const url = $form.attr(':ajax');
    const method = /method=([^?&#]*)/.exec(url)[1];
    const formdata = /formdata=([^?&#]*)/.exec(url)[1];
    const getData = () => {
      const kvpairs = {};
      for (let i = 0; i < $form.find('[name]')[0].length; i += 1) {
        const elem = $form.find('[name]')[0][i];
        kvpairs[elem.name] = elem.value;
      }

      return kvpairs;
    };
    const formData = (data) => {
      const newFormData = new FormData();
      Object.keys(data).forEach(key => {
        newFormData.append(key, data[key]);
      });

      return newFormData;
    };
    const axiosApi = method === 'post' ? axios.post : axios.get;
    const data = formdata ? formData(getData()) : getData();
    axiosApi(url, data).then(() => {
      $pop.addClass('act');
    });
  } else {
    j$('form')[0][0].submit();
  }
});
