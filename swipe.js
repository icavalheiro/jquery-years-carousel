function getTouch(event) {
    if (event.touches) return event.touches[0]
    return event;
}

export default function addSwipeListener(element, callback, startCallback, finishCallback) {
    let x;

    let handleTouchStart = (event) => {
        x = getTouch(event).clientX;

        if (startCallback) startCallback();
    }

    let handleTouchMove = (event) => {
        if (!x) return;

        let newX = getTouch(event).clientX;
        let delta = x - newX;
        x = newX;

        if (delta != 0) callback(delta);
    }

    let handleTouchEnd = () => {
        x = undefined;
        if (finishCallback) finishCallback();
    }

    element.addEventListener('touchstart', handleTouchStart, false);
    element.addEventListener('mousedown', handleTouchStart, false);
    element.addEventListener('touchmove', handleTouchMove, false);
    element.addEventListener('mousemove', handleTouchMove, false);
    element.addEventListener('touchend', handleTouchEnd, false);
    document.addEventListener('mouseup', handleTouchEnd, false);
}
