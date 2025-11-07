// @ts-nocheck
import Vue from 'vue';
import { addClass, removeClass } from 'element-ui/src/utils/dom';

// Attach the manager to a global key so multiple bundles reuse one instance.
const POPUP_MANAGER_KEY = '__ELEMENT_POPUP_MANAGER__';

const getGlobalContext = function() {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  return undefined;
};

const createPopupManager = function() {
  let hasModal = false;
  let hasInitZIndex = false;
  let zIndex;

  const instances = {};

  const manager = {
    modalFade: true,
    modalStack: [],
    modalDom: undefined,

    getInstance(id) {
      return instances[id];
    },

    register(id, instance) {
      if (id && instance) {
        instances[id] = instance;
      }
    },

    deregister(id) {
      if (id) {
        instances[id] = null;
        delete instances[id];
      }
    },

    nextZIndex() {
      return manager.zIndex++;
    },

    doOnModalClick() {
      const topItem = manager.modalStack[manager.modalStack.length - 1];
      if (!topItem) return;

      const instance = manager.getInstance(topItem.id);
      if (instance && instance.closeOnClickModal) {
        instance.close();
      }
    }
  };

  const getModal = function() {
    if (Vue.prototype.$isServer) return;
    let modalDom = manager.modalDom;
    if (modalDom) {
      hasModal = true;
    } else {
      hasModal = false;
      modalDom = document.createElement('div');
      manager.modalDom = modalDom;

      modalDom.addEventListener('touchmove', function(event) {
        event.preventDefault();
        event.stopPropagation();
      });

      modalDom.addEventListener('click', function() {
        manager.doOnModalClick && manager.doOnModalClick();
      });
    }

    return modalDom;
  };

  manager.openModal = function(id, zIndex, dom, modalClass, modalFade) {
    if (Vue.prototype.$isServer) return;
    if (!id || zIndex === undefined) return;
    manager.modalFade = modalFade;

    const modalStack = manager.modalStack;

    for (let i = 0, j = modalStack.length; i < j; i++) {
      const item = modalStack[i];
      if (item.id === id) {
        return;
      }
    }

    const modalDom = getModal();

    addClass(modalDom, 'v-modal');
    if (manager.modalFade && !hasModal) {
      addClass(modalDom, 'v-modal-enter');
    }
    if (modalClass) {
      let classArr = modalClass.trim().split(/\s+/);
      classArr.forEach(item => addClass(modalDom, item));
    }
    setTimeout(() => {
      removeClass(modalDom, 'v-modal-enter');
    }, 200);

    if (dom && dom.parentNode && dom.parentNode.nodeType !== 11) {
      dom.parentNode.appendChild(modalDom);
    } else {
      document.body.appendChild(modalDom);
    }

    if (zIndex) {
      modalDom.style.zIndex = zIndex;
    }
    modalDom.tabIndex = 0;
    modalDom.style.display = '';

    modalStack.push({ id: id, zIndex: zIndex, modalClass: modalClass });
  };

  manager.closeModal = function(id) {
    const modalStack = manager.modalStack;
    const modalDom = getModal();

    if (modalStack.length > 0) {
      const topItem = modalStack[modalStack.length - 1];
      if (topItem.id === id) {
        if (topItem.modalClass) {
          let classArr = topItem.modalClass.trim().split(/\s+/);
          classArr.forEach(item => removeClass(modalDom, item));
        }

        modalStack.pop();
        if (modalStack.length > 0) {
          modalDom.style.zIndex = modalStack[modalStack.length - 1].zIndex;
        }
      } else {
        for (let i = modalStack.length - 1; i >= 0; i--) {
          if (modalStack[i].id === id) {
            modalStack.splice(i, 1);
            break;
          }
        }
      }
    }

    if (modalStack.length === 0) {
      if (manager.modalFade) {
        addClass(modalDom, 'v-modal-leave');
      }
      setTimeout(() => {
        if (modalStack.length === 0) {
          if (modalDom.parentNode) modalDom.parentNode.removeChild(modalDom);
          modalDom.style.display = 'none';
          manager.modalDom = undefined;
        }
        removeClass(modalDom, 'v-modal-leave');
      }, 200);
    }
  };

  Object.defineProperty(manager, 'zIndex', {
    configurable: true,
    get() {
      if (!hasInitZIndex) {
        zIndex = zIndex || (Vue.prototype.$ELEMENT || {}).zIndex || 2000;
        hasInitZIndex = true;
      }
      return zIndex;
    },
    set(value) {
      zIndex = value;
    }
  });

  const getTopPopup = function() {
    if (Vue.prototype.$isServer) return;
    if (manager.modalStack.length > 0) {
      const topPopup = manager.modalStack[manager.modalStack.length - 1];
      if (!topPopup) return;
      const instance = manager.getInstance(topPopup.id);

      return instance;
    }
  };

  if (!Vue.prototype.$isServer && typeof window !== 'undefined') {
    // handle `esc` key when the popup is shown
    window.addEventListener('keydown', function(event) {
      if (event.keyCode === 27) {
        const topPopup = getTopPopup();

        if (topPopup && topPopup.closeOnPressEscape) {
          topPopup.handleClose
            ? topPopup.handleClose()
            : (topPopup.handleAction ? topPopup.handleAction('cancel') : topPopup.close());
        }
      }
    });
  }

  return manager;
};

const globalContext = getGlobalContext();
let PopupManager = globalContext ? globalContext[POPUP_MANAGER_KEY] : undefined;

if (!PopupManager) {
  PopupManager = createPopupManager();
  if (globalContext) {
    globalContext[POPUP_MANAGER_KEY] = PopupManager;
  }
}

export default PopupManager;
