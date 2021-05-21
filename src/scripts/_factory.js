export const svgRequire = (req) => {
  const use = Array.prototype.slice.call(document.getElementsByTagName('use'));
  use.forEach(elem => {
    const { href } = elem;
    const svg = `${/(?!#).*/.exec(href.baseVal)[0]}.svg`;
    let files = {};

    req.keys().forEach((filename)=>{
      if (new RegExp(filename).test(svg)) {
        files[filename] = req(filename);
      }
    });
  });
};

export let j$ = null;
export let eventQueue = [];

if (typeof j$ === 'undefined') {
  window.j$ = {};
}

document.addEventListener('DOMContentLoaded', () => {
  eventQueue.forEach(fn => {
    fn();
  });
}, { passive: true });

j$ = arg => {
  var htmlEls;
  var matches;

  if (arg instanceof Function) {
    eventQueue.push(arg);
    return document;
  } if (arg instanceof Object) {
    return new j$.Fn([arg]);
  }
  if (arg instanceof HTMLElement) {
    htmlEls = [arg];
  } else {
    matches = arg ? arg.match(/^<(\w+)>$/) : null;

    if (matches) {
      htmlEls = [document.createElement(matches[1])];
    } else {
      htmlEls = Array.prototype.slice.call(document.querySelectorAll(arg));
    }
  }

  return new j$.Fn(htmlEls);
};

j$.Fn = function (elements) {
  this[0] = elements;
  return this;
};

j$.Fn.prototype = {
  html: function (string) {
    if (typeof string !== 'undefined') {
      this[0].forEach(el => {
        el.innerHTML = string;
      });

      return this;
    }
    return this[0][0].innerHTML;
  },
  text: function (string) {
    let text = '';

    if (typeof string !== 'undefined') {
      this[0].forEach(el => {
        el.innerText = string;
      });

      return this;
    }

    this[0].forEach(el => {
      text += el.innerText;
    });

    return text;
  },
  parents: function (className) {
    let target = this[0][0];
    let $parents = null;

    while (target.parentNode != null && target.parentNode !== document.documentElement) {
      if (target.matches) {
        if (target.matches(className)) {
          $parents = new j$.Fn([target]);
          break;
        }
      } else if (target.msMatchesSelector) {
        if (target.msMatchesSelector(className)) {
          $parents = new j$.Fn([target]);
          break;
        }
      }
      target = target.parentNode;
    }
    return $parents;
  },
  parent: function () {
    var parents = [];
    var currentParent = null;

    this[0].forEach(el => {
      currentParent = el.parentElement;

      if (parents.indexOf(currentParent) === -1) {
        parents.push(currentParent);
      }
    });

    return new j$.Fn(parents);
  },
  prev: function () {
    let prev = null;

    this[0].forEach(el => {
      prev = el.previousElementSibling;
    });

    return new j$.Fn([prev]);
  },
  next: function () {
    let next = null;

    this[0].forEach(el => {
      next = el.nextElementSibling;
    });

    return new j$.Fn([next]);
  },
  find: function (selector) {
    let matchingElements = [];
    let currentMatchesQuery = null;
    let currentMatches = null;

    this[0].forEach(el => {
      currentMatchesQuery = el.querySelectorAll(selector);
      currentMatches = Array.prototype.slice.call(currentMatchesQuery);
      currentMatches.forEach(match => {
        if (matchingElements.indexOf(match) === -1) {
          matchingElements.push(match);
        }
      });
    });

    return new j$.Fn(matchingElements);
  },
  children: function () {
    var children = null;
    this[0].forEach(el => {
      children = el.childNodes[1];
    });
    return new j$.Fn([children]);
  },
  siblings: function () {
    let sibling = this[0][0].parentNode.firstChild;
    let siblings = [];

    while (sibling) {
      if (sibling.nodeType === 1 && sibling !== this[0][0]) {
        siblings.push(sibling);
      }

      sibling = sibling.nextSibling;
    }

    return new j$.Fn(siblings);
  },
  on: function (eventName, elementSelector, handle) {
    this[0].forEach(el => {
      if (elementSelector && typeof elementSelector === 'string') {
        el.addEventListener(eventName, e => {
          for (let target = e.target; target && target !== this; target = target.parentNode) {
            if (target.matches) {
              if (target.matches(elementSelector)) {
                e.$this = target;
                handle.call(target, e);
                break;
              }
            } else if (target.msMatchesSelector) {
              if (target.msMatchesSelector(elementSelector)) {
                e.$this = target;
                handle.call(target, e);
                break;
              }
            }
          }
        }, { passive: false });
      } else {
        const func = elementSelector;

        el.addEventListener(eventName, e => {
          e.$this = el;
          func.call(e.target, e);
        }, { passive: false });
      }
    });

    return this;
  },
  off: function (eventName, elementSelector, handle) {
    this[0].forEach(function (el) {
      if (elementSelector && typeof elementSelector === 'string') {
        el.removeEventListener(eventName, function (e) {
          for (let target = e.target; target && target !== this; target = target.parentNode) {
            if (target.matches) {
              if (target.matches(elementSelector)) {
                e.$this = target;
                handle.call(target, e);
                break;
              }
            } else if (target.msMatchesSelector) {
              if (target.msMatchesSelector(elementSelector)) {
                e.$this = target;
                handle.call(target, e);
                break;
              }
            }
          }
        }, { passive: false });
      } else {
        const func = elementSelector || null;
        el.removeEventListener(eventName, e => {
          e.$this = el;
          func.call(e.target, e);
        }, { passive: false });
      }
    });

    return this;
  },
  addClass: function (className) {
    this[0].forEach(el => {
      el.classList.add(className);
    });

    return this;
  },
  removeClass: function (className) {
    this[0].forEach(el => {
      el.classList.remove(className);
    });

    return this;
  },
  toggleClass: function (className) {
    this[0].forEach(el => {
      el.classList.toggle(className);
    });

    return this;
  },
  hasClass: function (className) {
    let hasClass = null;

    this[0].forEach(el => {
      hasClass = new RegExp('(\\s|^)' + className + '(\\s|$)').test(el.className);
      // if (el.className.replace(/[\n\t]/g, ' ').indexOf(className) > -1) {
      //   hasClass = true;
      // } else {
      //   hasClass = false;
      // }
    });

    return hasClass;
  },
  attr: function (attributeName, attributeValue) {
    if (typeof attributeValue !== 'undefined') {
      this[0].forEach(el => {
        el.setAttribute(attributeName, attributeValue);
      });

      return this;
    }
    return this[0][0].getAttribute(attributeName);
  },
  width: function () {
    let width = '';

    this[0].forEach(el => {
      width = el.innerWidth || el.offsetWidth || el.scrollWidth || el.clientWidth;
    });

    return width;
  },
  height: function () {
    let height = '';

    this[0].forEach(el => {
      height = el.innerHeight || el.offsetHeight || el.scrollHeight || el.clientHeight;
    });

    return height;
  },
  empty: function () {
    while (this[0][0].firstChild) {
      this[0][0].removeChild(this[0][0].firstChild);
    }

    return this;
  },
  remove: function () {
    this[0].forEach(function (el) {
      if (!('remove' in Element.prototype)) {
        el.parentNode.removeChild(el);
      } else {
        el.remove();
      }
    });
  },
  append: function (arg) {
    if (arg instanceof j$.Fn) {
      arg[0].forEach(function (el) {
        const elem = el.length ? el.cloneNode(true) : el;
        this[0][0].appendChild(elem);
      }.bind(this));
    } else if (arg instanceof HTMLElement) {
      const child = arg.length ? arg.cloneNode(true) : arg;
      this[0][0].appendChild(child);
    } else if (typeof arg === 'string') {
      this[0].forEach(el => {
        el.innerHTML += arg;
      });
    }

    return this;
  },
  before: function (arg) {
    if (arg instanceof j$.Fn) {
      arg[0].forEach(function (el) {
        this[0][0].parentNode.insertBefore(el, this[0][0]);
      }.bind(this));
    }

    return this;
  },
  after: function (arg) {
    if (arg instanceof j$.Fn) {
      arg[0].forEach(function (el) {
        if (this[0][0].parentNode.lastChild === this[0][0]) {
          this[0][0].parentNode.appendChild(el, this[0][0]);
        } else {
          this[0][0].parentNode.insertBefore(el, this[0][0].nextSibling);
        }
      }.bind(this));
    }

    return this;
  },
  val: function (value) {
    if (typeof value !== 'undefined') {
      this[0].forEach(el => {
        el.value = value;
      });

      return this;
    }
    return this[0][0].value;
  },
  offset: function () {
    let $el = this[0][0];
    let top = 0;
    let left = 0;

    while ($el && !Number.isNaN($el.offsetLeft) && !Number.isNaN($el.offsetTop)) {
      top += $el.offsetTop - $el.scrollTop + $el.clientTop;
      left += $el.offsetLeft - $el.scrollLeft + $el.clientLeft;

      $el = $el.offsetParent;
    }

    return { top: top, left: left };
  },
  position: function () {
    let $el = this[0][0];
    let top = 0;
    let left = 0;
    let parentTop = $el.offsetParent.offsetTop;
    let parentLeft = $el.offsetParent.offsetLeft;

    while ($el) {
      top += $el.offsetTop - $el.scrollTop + $el.clientTop;
      left += $el.offsetLeft - $el.scrollLeft + $el.clientLeft;

      $el = $el.offsetParent;
    }

    return { top: (top - parentTop), left: (left - parentLeft) };
  },
  prop: function (type, value) {
    let prop = null;

    if (typeof value !== 'undefined') {
      this[0].forEach(el => {
        el[type] = value;
      });

      return this;
    }

    this[0].forEach(el => {
      prop = el[type];
    });

    return prop;
  },
  eq: function (index) {
    return new j$.Fn([this[0][index]]);
  },
  index: function () {
    const children = this[0][0].parentNode.children;

    let num = 0;
    for (let i = 0; i < children.length; i += 1) {
      if (children[i] === this[0][0]) {
        return num;
      }
      if (children[i].nodeType === 1) {
        num += 1;
      }
    }
    return -1;
  }
};

export const prjs = {
  $w: j$(window),
  $d: j$(document),
  $hb: j$('html, body'),
  $b: j$('body')
};

export const validate = (elem, callback) => {
  const value = elem.val();
  const vali = JSON.parse(elem.attr(':validate').replace(/'/g, '"'));
  let errorMsg = null;

  elem.parent().removeClass('error');

  if (vali?.req && !value) {
    errorMsg = vali.req;
  } else if (value) {
    if (vali?.min && value < vali.min.val) {
      errorMsg = vali.min.msg.replace(/\$min/g, vali.min.val);
    } else if (vali?.max && value > vali.max.val) {
      errorMsg = vali.max.msg.replace(/\$max/g, vali.max.val);
    } else if (vali?.email && !/^([a-zA-Z0-9_.\-+])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value)) {
      errorMsg = vali.email;
    } else if (vali?.digital && !/^[0-9]+$/.test(value)) {
      errorMsg = vali.digital;
    } else if (vali?.password) {
      if (vali.password.length && !new RegExp(`^((?=.{${vali.password.length},}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).*|(?=.{${vali.password.length},}$)(?=.*\\d)(?=.*[a-zA-Z]))((?=.*[!\\u0022#$%&'()*+,./:;<=>?@[\\]^_\`{|}~-]).*)`).test(value)) {
        errorMsg = vali.password.msg.replace(/\$length/g, vali.password.length);
      }

      if (vali.password.same && value !== j$(vali.password.same).val()) {
        errorMsg = vali.password.msg;
      }
    } else if (vali?.phone && !/^09\d{8}$/.test(value)) {
      errorMsg = vali.phone;
    }
  }
  if (errorMsg) {
    elem.parent().addClass('error');
  }
  elem.parents('.jForm').find('.jFormError').empty().text(errorMsg);

  if (callback) {
    callback(!!errorMsg);
  }
};
