export const giveFocus = (el: HTMLElement) => {
    el.tabIndex = 0;
    el.focus();
};

export const removeFocus = (el: HTMLElement) => {
    el.tabIndex = -1;
}
