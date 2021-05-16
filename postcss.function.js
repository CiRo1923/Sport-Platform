const CONFIG = require('./config.js');

module.exports = {
  functions: {
    vmp(value) {
      const NumValue = parseInt(value, 10);
      const toPositive = NumValue < 0 ? (NumValue * -1) : NumValue;
      const basicWidth = CONFIG.desktopMinWidth;
      return (toPositive > 1) ? `${((NumValue / basicWidth) * 100).toFixed(3)}vw` : value;
    },
    vmt(value) {
      const NumValue = parseInt(value, 10);
      const toPositive = NumValue < 0 ? (NumValue * -1) : NumValue;
      const basicWidth = 768;
      return (toPositive > 1) ? `${((NumValue / basicWidth) * 100).toFixed(3)}vw` : value;
    },
    vmm(value) {
      const NumValue = parseInt(value, 10);
      const toPositive = NumValue < 0 ? (NumValue * -1) : NumValue;
      const basicWidth = CONFIG.basicMobileWidth;
      return (toPositive > 1) ? `${((NumValue / basicWidth) * 100).toFixed(3)}vw` : value;
    },
    mediaQuery(value, type) {
      let deviceValue = CONFIG.desktopMinWidth;
      let returnValue = `${deviceValue}px`;

      if (value === 'tablet') {
        deviceValue = 768;
      } else if (value === 'mobile') {
        deviceValue = CONFIG.mobileMaxWidth;
      }

      if (type === '+') {
        returnValue = `${(deviceValue + 1)}px`;
      } else if (type === '-') {
        returnValue = `${(deviceValue - 1)}px`;
      }

      return returnValue;
    }
  }
};
