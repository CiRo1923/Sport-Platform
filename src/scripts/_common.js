import { svgRequire, prjs } from '_factory.js';

/* 一次載入使用到的 svg */
svgRequire(require.context('../assets/svg/', true, /\.svg$/));

export const refresh = () => {
  window.location.reload();
};

prjs.$d.on('click', '.jRefresh', ()=> {
  refresh();
});
