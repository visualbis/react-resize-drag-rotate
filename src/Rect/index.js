import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { getLength, getAngle, getCursor, getBoundPosition } from '../utils'
import StyledRect from './StyledRect'

const zoomableMap = {
  'n': 't',
  's': 'b',
  'e': 'r',
  'w': 'l',
  'ne': 'tr',
  'nw': 'tl',
  'se': 'br',
  'sw': 'bl'
}

export default class Rect extends PureComponent {
  static propTypes = {
    styles: PropTypes.object,
    zoomable: PropTypes.string,
    rotatable: PropTypes.bool,
    isDraggable: PropTypes.bool,
    onResizeStart: PropTypes.func,
    onResize: PropTypes.func,
    onResizeEnd: PropTypes.func,
    onRotateStart: PropTypes.func,
    onRotate: PropTypes.func,
    onRotateEnd: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func,
    parentRotateAngle: PropTypes.number,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    className: PropTypes.string,
    color: PropTypes.string,
    childClass: PropTypes.string,
    bounds: PropTypes.string,
    top: PropTypes.number,
    left: PropTypes.number,
    getNearestToTopBottom: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.state = {
      unMount: false
    }
  }

  componentWillUnmount () {
    this.setState({ unMount: true })
  }

  setElementRef = (ref) => { this.$element = ref }

  // Drag
  startDrag = (e) => {
    const { isDraggable } = this.props;
    if(!isDraggable)  return ;
    const { unMount } = this.state
    let { clientX: startX, clientY: startY } = e.touches ? e.touches[0] : e
    this.props.onDragStart && this.props.onDragStart(e)
    this._isMouseDown = true
    const onMove = (e) => {
      e.preventDefault()
      if (!this._isMouseDown) return // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation()
      let { top, left, childClass, bounds, styles: { size: { width, height }, transform: { rotateAngle } }, getNearestToTopBottom } = this.props
      const { clientX, clientY } = e.touches ? e.touches[0] : e
      const nearestValue = getNearestToTopBottom ? getNearestToTopBottom({ startX: left, startY: top, size: [height, width] }, rotateAngle) : null
      if (nearestValue) {
        top = nearestValue.top
        left = nearestValue.left
      }
      const distanceX = startX - left
      const distanceY = startY - top
      const [x, y] = getBoundPosition(bounds, childClass, clientX, clientY, distanceX, distanceY, rotateAngle)
      const deltaX = x - startX
      const deltaY = y - startY
      !unMount && this.props.onDrag({ deltaX, deltaY, x, y, event: e })
      startX = x
      startY = y
    }
    const onUp = (e) => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onUp)
      if (!this._isMouseDown) return
      this._isMouseDown = false
      if (!unMount && this.props.onDragEnd) this.props.onDragEnd(e)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('touchmove', onMove)
    document.addEventListener('touchend', onUp)
  }

  // Rotate
  startRotate = (e) => {
    document.body.setAttribute('style', 'cursor: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElN RQfmBxoGNC7iPLteAAAAk0lEQVRIx+2TwQ6AIAxDO+L///LzgIYp4MCYeKHHhZZu3aSvATDzPtUl 04xEahVnJOxqvxSQ2aQAeEax8CyU7nTc/6bYxG0Gni4hjsZCgfx/Jp70MQ9bNRST4Ow7DqMRI5QY YwetRbLRCDsCUXAdgNDlDurKwBD9Eo/Z6G7iUQvb6d5CjjCeRvXAtfBmlAsLC79hBy1XOhMuG4vE AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTA3LTI2VDA2OjUyOjQ2KzAwOjAw3YJFeAAAACV0RVh0 ZGF0ZTptb2RpZnkAMjAyMi0wNy0yNlQwNjo1Mjo0NiswMDowMKzf/cQAAAAASUVORK5CYII="), default !important')
    if (e.button !== 0 && !e.touches) return
    const { clientX, clientY } = e.touches ? e.touches[0] : e
    const { styles: { transform: { rotateAngle: startAngle } } } = this.props
    const rect = this.$element.getBoundingClientRect()
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
    const startVector = {
      x: clientX - center.x,
      y: clientY - center.y
    }
    this.props.onRotateStart && this.props.onRotateStart(e)
    this._isMouseDown = true
    const onMove = (e) => {
      if (!this._isMouseDown) return // patch: fix windows press win key during mouseup issue
   
      e.stopImmediatePropagation()
      const { clientX, clientY } = e.touches ? e.touches[0] : e
      const rotateVector = {
        x: clientX - center.x,
        y: clientY - center.y
      }
      const angle = getAngle(startVector, rotateVector)
      this.props.onRotate({ angle, startAngle, event: e })
    }
    const onUp = (e) => {
      document.body.style.cursor = 'auto'
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onUp)
      if (!this._isMouseDown) return
      this._isMouseDown = false
      this.props.onRotateEnd && this.props.onRotateEnd(e)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('touchmove', onMove)
    document.addEventListener('touchend', onUp)
  }

  // Resize
  startResize = (e, cursor) => {
    if (e.button !== 0 && !e.touches) return
    document.body.style.cursor = cursor
    const { styles: { position: { centerX, centerY }, size: { width, height }, transform: { rotateAngle } } } = this.props
    const { clientX: startX, clientY: startY } = e.touches ? e.touches[0] : e
    const rect = { width, height, centerX, centerY, rotateAngle }
    const type = e.target.getAttribute('class').split(' ')[ 0 ]
    this.props.onResizeStart && this.props.onResizeStart(e)
    this._isMouseDown = true
    const onMove = (e) => {
      if (!this._isMouseDown) return // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation()
      const { clientX, clientY } = e.touches ? e.touches[0] : e
      const deltaX = clientX - startX
      const deltaY = clientY - startY
      const alpha = Math.atan2(deltaY, deltaX)
      const deltaL = getLength(deltaX, deltaY)
      const isShiftKey = e.shiftKey
      this.props.onResize({ deltaL, alpha, rect, type, isShiftKey, event: e })
    }

    const onUp = (e) => {
      document.body.style.cursor = 'auto'
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onUp)
      if (!this._isMouseDown) return
      this._isMouseDown = false
      this.props.onResizeEnd && this.props.onResizeEnd(e)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('touchmove', onMove)
    document.addEventListener('touchend', onUp)
  }

  render () {
    const {
      styles: {
        position: { centerX, centerY },
        size: { width, height },
        transform: { rotateAngle }
      },
      zoomable,
      rotatable,
      parentRotateAngle,
      onClick,
      onDoubleClick,
      className,
      color,
      children,
      isDraggable
    } = this.props
    const style = {
      width: Math.abs(width),
      height: Math.abs(height),
      transform: `rotate(${rotateAngle}deg)`,
      left: centerX - Math.abs(width) / 2,
      top: centerY - Math.abs(height) / 2
    }
    const direction = zoomable.split(',').map(d => d.trim()).filter(d => d) // TODO: may be speed up

    return (
      <StyledRect
        color={color}
        ref={this.setElementRef}
        onMouseDown={this.startDrag}
        onTouchStart={this.startDrag}
        className={`rect ${isDraggable ? "single-resizer" : "" } ${className || ''}`}
        style={style}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        { children}
        {
          rotatable &&
          <div className="rotate" onMouseDown={this.startRotate} onTouchStart={this.startRotate}>
            <svg viewBox="0 0 2048 2048" height="24" width="24" >
              <path d="M 1019 1579 q -115 0 -216 -43 q -101 -44 -176 -119 q -76 -76 -119 -177 q -44 -101 -44 -216 q 0 -115 44 -216 q 43 -101 119 -176 q 75 -76 176 -119 q 101 -44 216 -44 q 114 0 215 44 q 101 43 177 119 q 75 75 119 176 q 43 101 43 216 q -1 6 -1 11 v 16 l 78 -78 l 106 107 l -311 311 l -311 -311 l 107 -107 l 148 148 q 7 -28 11 -51 q 3 -24 3 -46 q 0 -79 -30 -149 q -31 -70 -83 -122 q -52 -53 -122 -83 q -70 -30 -149 -30 q -80 0 -149 30 q -70 30 -122 83 q -53 52 -83 122 q -30 70 -30 149 q 0 80 30 150 q 30 69 83 122 q 52 52 122 82 q 69 30 149 30 q 26 -1 53 -4 q 26 -3 52 -11 l 25 -8 l 129 130 l -60 24 q -50 20 -99 30 q -50 10 -100 10 z" className="SVGShapeRotateHandle" />
            </svg>
          </div>
        }

        {
          direction.map(d => {
            const cursor = `${getCursor(rotateAngle + parentRotateAngle, d)}-resize`
            return (
              <div key={d} style={{ cursor }} className={`${zoomableMap[ d ]} resizable-handler`} onMouseDown={(e) => this.startResize(e, cursor)} onTouchStart={(e) => this.startResize(e, cursor)} />
            )
          })
        }

        {
          direction.map(d => {
            return (
              <div key={d} className={`${zoomableMap[ d ]} square`} />
            )
          })
        }
      </StyledRect>
    )
  }
}
