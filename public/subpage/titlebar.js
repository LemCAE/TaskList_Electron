['minimize', 'maximize', 'close'].forEach(action => {
    document.getElementById(action).addEventListener('click', () => {
        window.subwAPI[action]();
    });
});
const maximizeSVG = `
<svg t="1725463363630" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4129" width="200" height="200">
    <path d="M836.224 917.333333h-644.266667a85.589333 85.589333 0 0 1-85.333333-85.333333V187.733333a85.589333 85.589333 0 0 1 85.333333-85.333333h644.266667a85.589333 85.589333 0 0 1 85.333333 85.333333v644.266667a91.690667 91.690667 0 0 1-85.333333 85.333333zM191.957333 170.666667a22.869333 22.869333 0 0 0-21.333333 21.333333v644.266667a22.869333 22.869333 0 0 0 21.333333 21.333333h644.266667a22.869333 22.869333 0 0 0 21.333333-21.333333V192a22.869333 22.869333 0 0 0-21.333333-21.333333z" p-id="4130"></path>
</svg>`;
const unmaximizeSVG = `
<svg t="1725463429338" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4293" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
    <path d="M836.224 106.666667h-490.666667a85.589333 85.589333 0 0 0-85.333333 85.333333V256h-64a85.589333 85.589333 0 0 0-85.333333 85.333333v490.666667a85.589333 85.589333 0 0 0 85.333333 85.333333h490.666667a85.589333 85.589333 0 0 0 85.333333-85.333333V768h64a85.589333 85.589333 0 0 0 85.333333-85.333333V192a85.589333 85.589333 0 0 0-85.333333-85.333333z m-132.266667 725.333333a20.138667 20.138667 0 0 1-21.333333 21.333333h-490.666667a20.138667 20.138667 0 0 1-21.333333-21.333333V341.333333a20.138667 20.138667 0 0 1 21.333333-21.333333h494.933334a20.138667 20.138667 0 0 1 21.333333 21.333333v490.666667z m153.6-149.333333a20.138667 20.138667 0 0 1-21.333333 21.333333h-64V341.333333a85.589333 85.589333 0 0 0-85.333333-85.333333h-362.666667V192a20.138667 20.138667 0 0 1 21.333333-21.333333h490.666667a20.138667 20.138667 0 0 1 21.333333 21.333333z" p-id="4294"></path>
</svg>`;
const maximizeButton = document.getElementById('maximize');
document.addEventListener('DOMContentLoaded', () => {
    window.subwAPI.isWindowMaximized().then(isMaximized => {
        if (isMaximized) {
            maximizeButton.innerHTML = unmaximizeSVG;
            const svg = maximizeButton.querySelector('svg');
            svg.style.height = '20px';
            svg.style.width = '20px';
        } else {
            maximizeButton.innerHTML = maximizeSVG;
            const svg = maximizeButton.querySelector('svg');
            svg.style.height = '20px';
            svg.style.width = '20px';
        }
    });
});
window.subwAPI.onWindowMaximized(() => {
    maximizeButton.innerHTML = unmaximizeSVG;
    const svg = maximizeButton.querySelector('svg');
    svg.style.height = '20px';
    svg.style.width = '20px';
});

window.subwAPI.onWindowUnmaximized(() => {
    maximizeButton.innerHTML = maximizeSVG;
    const svg = maximizeButton.querySelector('svg');
    svg.style.height = '20px';
    svg.style.width = '20px';
});
['minimize', 'maximize', 'close'].forEach(action => {
    const svg = document.getElementById(action).querySelector('svg');
    if (svg) {
        svg.style.width = '20px';
        svg.style.height = '20px';
    }
});