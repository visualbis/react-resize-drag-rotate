export const getLength = (x, y) => Math.sqrt(x * x + y * y)

export const getAngle = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
  const dot = x1 * x2 + y1 * y2
  const det = x1 * y2 - y1 * x2
  const angle = Math.atan2(det, dot) / Math.PI * 180
  return (angle + 360) % 360
}

export const degToRadian = (deg) => deg * Math.PI / 180

const cos = (deg) => Math.cos(degToRadian(deg))
const sin = (deg) => Math.sin(degToRadian(deg))

const setWidthAndDeltaW = (width, deltaW, minWidth) => {
  const expectedWidth = width + deltaW
  if (expectedWidth > minWidth) {
    width = expectedWidth
  } else {
    deltaW = minWidth - width
    width = minWidth
  }
  return { width, deltaW }
}

const setHeightAndDeltaH = (height, deltaH, minHeight) => {
  const expectedHeight = height + deltaH
  if (expectedHeight > minHeight) {
    height = expectedHeight
  } else {
    deltaH = minHeight - height
    height = minHeight
  }
  return { height, deltaH }
}

export const getNewStyle = (type, rect, deltaW, deltaH, ratio, minWidth, minHeight) => {
  let { width, height, centerX, centerY, rotateAngle } = rect
  const widthFlag = width < 0 ? -1 : 1
  const heightFlag = height < 0 ? -1 : 1
  width = Math.abs(width)
  height = Math.abs(height)
  switch (type) {
    case 'r': {
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth)
      width = widthAndDeltaW.width
      deltaW = widthAndDeltaW.deltaW
      if (ratio) {
        deltaH = deltaW / ratio
        height = width / ratio
        // 左上角固定
        centerX += deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle)
        centerY += deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle)
      } else {
        // 左边固定
        centerX += deltaW / 2 * cos(rotateAngle)
        centerY += deltaW / 2 * sin(rotateAngle)
      }
      break
    }
    case 'tr': {
      deltaH = -deltaH
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth)
      width = widthAndDeltaW.width
      deltaW = widthAndDeltaW.deltaW
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight)
      height = heightAndDeltaH.height
      deltaH = heightAndDeltaH.deltaH
      if (ratio) {
        deltaW = deltaH * ratio
        width = height * ratio
      }
      centerX += deltaW / 2 * cos(rotateAngle) + deltaH / 2 * sin(rotateAngle)
      centerY += deltaW / 2 * sin(rotateAngle) - deltaH / 2 * cos(rotateAngle)
      break
    }
    case 'br': {
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth)
      width = widthAndDeltaW.width
      deltaW = widthAndDeltaW.deltaW
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight)
      height = heightAndDeltaH.height
      deltaH = heightAndDeltaH.deltaH
      if (ratio) {
        deltaW = deltaH * ratio
        width = height * ratio
      }
      centerX += deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle)
      centerY += deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle)
      break
    }
    case 'b': {
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight)
      height = heightAndDeltaH.height
      deltaH = heightAndDeltaH.deltaH
      if (ratio) {
        deltaW = deltaH * ratio
        width = height * ratio
        // 左上角固定
        centerX += deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle)
        centerY += deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle)
      } else {
        // 上边固定
        centerX -= deltaH / 2 * sin(rotateAngle)
        centerY += deltaH / 2 * cos(rotateAngle)
      }
      break
    }
    case 'bl': {
      deltaW = -deltaW
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth)
      width = widthAndDeltaW.width
      deltaW = widthAndDeltaW.deltaW
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight)
      height = heightAndDeltaH.height
      deltaH = heightAndDeltaH.deltaH
      if (ratio) {
        height = width / ratio
        deltaH = deltaW / ratio
      }
      centerX -= deltaW / 2 * cos(rotateAngle) + deltaH / 2 * sin(rotateAngle)
      centerY -= deltaW / 2 * sin(rotateAngle) - deltaH / 2 * cos(rotateAngle)
      break
    }
    case 'l': {
      deltaW = -deltaW
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth)
      width = widthAndDeltaW.width
      deltaW = widthAndDeltaW.deltaW
      if (ratio) {
        height = width / ratio
        deltaH = deltaW / ratio
        // 右上角固定
        centerX -= deltaW / 2 * cos(rotateAngle) + deltaH / 2 * sin(rotateAngle)
        centerY -= deltaW / 2 * sin(rotateAngle) - deltaH / 2 * cos(rotateAngle)
      } else {
        // 右边固定
        centerX -= deltaW / 2 * cos(rotateAngle)
        centerY -= deltaW / 2 * sin(rotateAngle)
      }
      break
    }
    case 'tl': {
      deltaW = -deltaW
      deltaH = -deltaH
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth)
      width = widthAndDeltaW.width
      deltaW = widthAndDeltaW.deltaW
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight)
      height = heightAndDeltaH.height
      deltaH = heightAndDeltaH.deltaH
      if (ratio) {
        width = height * ratio
        deltaW = deltaH * ratio
      }
      centerX -= deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle)
      centerY -= deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle)
      break
    }
    case 't': {
      deltaH = -deltaH
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight)
      height = heightAndDeltaH.height
      deltaH = heightAndDeltaH.deltaH
      if (ratio) {
        width = height * ratio
        deltaW = deltaH * ratio
        // 左下角固定
        centerX += deltaW / 2 * cos(rotateAngle) + deltaH / 2 * sin(rotateAngle)
        centerY += deltaW / 2 * sin(rotateAngle) - deltaH / 2 * cos(rotateAngle)
      } else {
        centerX += deltaH / 2 * sin(rotateAngle)
        centerY -= deltaH / 2 * cos(rotateAngle)
      }
      break
    }
  }

  return {
    position: {
      centerX,
      centerY
    },
    size: {
      width: width * widthFlag,
      height: height * heightFlag
    }
  }
}

const cursorStartMap = { n: 0, ne: 1, e: 2, se: 3, s: 4, sw: 5, w: 6, nw: 7 }
const cursorDirectionArray = [ 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw' ]
const cursorMap = { 0: 0, 1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4, 7: 5, 8: 6, 9: 6, 10: 7, 11: 8 }
export const getCursor = (rotateAngle, d) => {
  const increment = cursorMap[ Math.floor(rotateAngle / 30) ]
  const index = cursorStartMap[ d ]
  const newIndex = (index + increment) % 8
  return cursorDirectionArray[ newIndex ]
}

export const centerToTL = ({ centerX, centerY, width, height, rotateAngle }) => ({
  top: centerY - height / 2,
  left: centerX - width / 2,
  width,
  height,
  rotateAngle
})

export const tLToCenter = ({ top, left, width, height, rotateAngle }) => ({
  position: {
    centerX: left + width / 2,
    centerY: top + height / 2
  },
  size: {
    width,
    height
  },
  transform: {
    rotateAngle
  }
})

export function isNum (num)  {
  return typeof num === 'number' && !isNaN(num);
}

export function int (a) {
  return parseInt(a, 10);
}
export function outerHeight (node) {
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetTop which is including margin. See getBoundPosition
  let height = node.clientHeight;
  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  height += int(computedStyle.borderTopWidth);
  height += int(computedStyle.borderBottomWidth);
  return height;
}

export function outerWidth (node ) {
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetLeft which is including margin. See getBoundPosition
  let width = node.clientWidth;
  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  width += int(computedStyle.borderLeftWidth);
  width += int(computedStyle.borderRightWidth);
  return width;
}
export function innerHeight (node ) {
  let height = node.clientHeight;
  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  height -= int(computedStyle.paddingTop);
  height -= int(computedStyle.paddingBottom);
  return height;
}

export function innerWidth (node ) {
  let width = node.clientWidth;
  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  width -= int(computedStyle.paddingLeft);
  width -= int(computedStyle.paddingRight);
  return width;
}
export const getBoundPosition = ( bounds, x, y, distanceX, distanceY) => {
  // If no bounds, short-circuit and move on
  if (!bounds) return [x, y]

  bounds = typeof bounds === 'string' ? bounds : bounds;
  const node = document.querySelector('.single-resizer');
  if (typeof bounds === 'string') {
    const { ownerDocument } = node;
    const ownerWindow = ownerDocument.defaultView;
    let boundNode;
    if (bounds === 'parent') {
      boundNode = node.parentNode;
    } else {
      boundNode = ownerDocument.querySelector(bounds);
    }
    if (!(boundNode instanceof ownerWindow.HTMLElement)) {
      throw new Error('Bounds selector "' + bounds + '" could not find an element.');
    }
    const boundNodeEl = boundNode; // for Flow, can't seem to refine correctly
    const nodeStyle = ownerWindow.getComputedStyle(node);
    const boundNodeStyle = ownerWindow.getComputedStyle(boundNodeEl);
    // Compute bounds. This is a pain with padding and offsets but this gets it exactly right.
    bounds = {
      left: boundNodeEl.offsetLeft + int(boundNodeStyle.paddingLeft) + int(nodeStyle.marginLeft),
      top: boundNodeEl.offsetTop + int(boundNodeStyle.paddingTop) + int(nodeStyle.marginTop),
      right: innerWidth(boundNodeEl) - outerWidth(node)  +
        int(boundNodeStyle.paddingRight) - int(nodeStyle.marginRight),
      bottom: innerHeight(boundNodeEl) + boundNodeEl.offsetTop - outerHeight(node)  +
        int(boundNodeStyle.paddingBottom) - int(nodeStyle.marginBottom)
    };
  }

  // Keep x and y below right and bottom limits...
  if (isNum(bounds.right)) x = Math.min(x, bounds.right+ distanceX);
  if (isNum(bounds.bottom)) y = Math.min(y, bounds.bottom + distanceY);

  // But above left and top limits.
  if (isNum(bounds.left)) x = Math.max(x, bounds.left+ distanceX);
  if (isNum(bounds.top)) y = Math.max(y, bounds.top+ distanceY);

  return [x, y];
}
