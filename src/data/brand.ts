// Names with their own styling, applied wherever a project title is shown as HTML.
// WIIZARD is always written with "WII" underlined.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
export const brandHtml = (text: string) => esc(text).replace(/WII(ZARD)/g, '<u class="wii">WII</u>$1');
