export function debounce(func, delay) {
    let timer
    return function (...args) {
        if (timer) {
            window.clearTimeout(timer)
        }
        timer = window.setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

export function scrollIntoView(container, selected) {
    if (!selected) {
        container.scrollTop = 0
        return
    }
    const offsetParents = []
    let pointer = selected.offsetParent
    while (pointer && container !== pointer && container.contains(pointer)) {
        offsetParents.push(pointer)
        pointer = pointer.offsetParent
    }
    const top = selected.offsetTop + offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0)
    const bottom = top + selected.offsetHeight
    const viewRectTop = container.scrollTop
    const viewRectBottom = viewRectTop + container.clientHeight
    if (top < viewRectTop) {
        container.scrollTop = top
    } else if (bottom > viewRectBottom) {
        container.scrollTop = bottom - container.clientHeight
    }
}

export function nextTick(fn) {
    const callback = window.requestIdleCallback || window.setTimeout
    callback(() => {
        fn()
    })
}