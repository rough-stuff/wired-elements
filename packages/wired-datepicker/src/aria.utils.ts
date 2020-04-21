export const giveFocus = (el: HTMLElement) => {
    el.tabIndex = 0;
    el.focus();
    el.setAttribute('aria-checked', 'true');
};

export const removeFocus = (el: HTMLElement) => {
    el.tabIndex = -1;
    el.removeAttribute('aria-checked');
}
