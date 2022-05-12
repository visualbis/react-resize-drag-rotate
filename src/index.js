import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Rect from './Rect'
import { centerToTL, tLToCenter, getNewStyle, degToRadian } from './utils'

export default class ResizableRect extends Component {
  static propTypes = {
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    rotatable: PropTypes.bool,
    rotateAngle: PropTypes.number,
    parentRotateAngle: PropTypes.number,
    zoomable: PropTypes.string,
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    maxWidth: PropTypes.number,
    maxHeight: PropTypes.number,
    aspectRatio: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.bool
    ]),
    onRotateStart: PropTypes.func,
    onRotate: PropTypes.func,
    onRotateEnd: PropTypes.func,
    onResizeStart: PropTypes.func,
    onResize: PropTypes.func,
    onResizeEnd: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    className: PropTypes.string,
    color: PropTypes.string,
    childClass: PropTypes.string,
    bounds: PropTypes.string,
    getNearestToTopBottom: PropTypes.func
  }

  static defaultProps = {
    parentRotateAngle: 0,
    rotateAngle: 0,
    rotatable: true,
    zoomable: '',
    minWidth: 10,
    minHeight: 10,
    maxHeight: 300,
    maxWidth: 300,
    className: '',
    color: '#333',
    bounds: '',
    childClass: ''
  }

  handleRotate = ({ angle, startAngle, event }) => {
    if (!this.props.onRotate) return
    let rotateAngle = Math.round(startAngle + angle)
    if (rotateAngle >= 360) {
      rotateAngle -= 360
    } else if (rotateAngle < 0) {
      rotateAngle += 360
    }
    if (rotateAngle > 356 || rotateAngle < 4) {
      rotateAngle = 0
    } else if (rotateAngle > 86 && rotateAngle < 94) {
      rotateAngle = 90
    } else if (rotateAngle > 176 && rotateAngle < 184) {
      rotateAngle = 180
    } else if (rotateAngle > 266 && rotateAngle < 274) {
      rotateAngle = 270
    }
    this.props.onRotate({ rotateAngle, event })
  }

  handleResize = ({ deltaL, alpha, rect, type, isShiftKey, event }) => {
    if (!this.props.onResize) return
    const { rotateAngle, aspectRatio, minWidth, minHeight, parentRotateAngle, maxWidth, maxHeight } = this.props
    const beta = alpha - degToRadian(rotateAngle + parentRotateAngle)
    const deltaW = deltaL * Math.cos(beta)
    const deltaH = deltaL * Math.sin(beta)
    const ratio = isShiftKey && !aspectRatio ? rect.width / rect.height : aspectRatio
    const {
      position: { centerX, centerY },
      size: { width, height }
    } = getNewStyle(type, { ...rect, rotateAngle }, deltaW, deltaH, ratio, minWidth, minHeight, maxWidth, maxHeight)

    const style = centerToTL({ centerX, centerY, width, height, rotateAngle })
    this.props.onResize({ style, isShiftKey, type, event })
  }

  handleDrag = (params) => {
    this.props.onDrag && this.props.onDrag(params)
  }

  render () {
    const {
      top, left, width, height, rotateAngle, parentRotateAngle, zoomable, rotatable,
      onRotate, onResizeStart, onResizeEnd, onRotateStart, onRotateEnd, onDragStart, onDragEnd,
      className, onClick, onDoubleClick, color, children, childClass, bounds, getNearestToTopBottom
    } = this.props

    const styles = tLToCenter({ top, left, width, height, rotateAngle })

    return (
      <Rect
        className={className}
        styles={styles}
        zoomable={zoomable}
        rotatable={Boolean(rotatable && onRotate)}
        parentRotateAngle={parentRotateAngle}

        onResizeStart={onResizeStart}
        onResize={this.handleResize}
        onResizeEnd={onResizeEnd}

        onRotateStart={onRotateStart}
        onRotate={this.handleRotate}
        onRotateEnd={onRotateEnd}

        onDragStart={onDragStart}
        onDrag={this.handleDrag}
        onDragEnd={onDragEnd}

        onClick={onClick}
        onDoubleClick={onDoubleClick}

        color={color}
        children={children}

        childClass={childClass}
        bounds={bounds}
        top={top}
        left={left}
        getNearestToTopBottom={getNearestToTopBottom}
      />
    )
  }
}
