import React, { PropsWithChildren, useCallback, useRef, useState } from 'react';
import clsx from 'clsx';

import CameraView from '../Camera/CameraView';
import { throttle } from 'lodash';
import CameraContext, {
  CameraContextType,
  CameraFocusOptions,
  CameraFocusScaleMode,
} from '../Camera/CameraContext';

import styles from './CameraControl.module.css';
import Button from '../Button/Button';

const getScale = (
  targetElement: HTMLElement,
  baseElement: HTMLElement,
  options: CameraFocusOptions = {}
) => {
  const { scaleMargin = 20, scaleMode = CameraFocusScaleMode.Contain } =
    options;
  if (scaleMode === CameraFocusScaleMode.NoScale) {
    return undefined;
  }
  const horizontalScale =
    (baseElement.offsetWidth - scaleMargin * 2) / targetElement.offsetWidth;
  const verticalScale =
    (baseElement.offsetHeight - scaleMargin * 2) / targetElement.offsetHeight;
  if (scaleMode === CameraFocusScaleMode.Contain) {
    return Math.min(horizontalScale, verticalScale);
  }
  if (scaleMode === CameraFocusScaleMode.Cover) {
    return Math.max(horizontalScale, verticalScale);
  }
  return undefined;
};

export type CameraControlProps = PropsWithChildren<{
  className?: string;
  minScalePercentage?: number;
  maxScalePercentage?: number;
  scaleStep?: number;
  panStep?: number;
}>;

const noDragOrigin = { x: undefined, y: undefined };

const onContextMenu = (event) => {
  event.preventDefault();
  return false;
};

const CameraControl = ({
  className,
  minScalePercentage = 10,
  maxScalePercentage = 1000,
  scaleStep = 20,
  panStep = 50,
  children,
}: CameraControlProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOrigin, setDragOrigin] = useState(noDragOrigin);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotateZ, setRotateZ] = useState(0);
  const [scalePercentage, setScalePercentage] = useState(100);
  const [perspective, setPerspective] = useState(5000);

  const baseRef = useRef<HTMLDivElement>();
  const contentRef = useRef<HTMLDivElement>();

  const scale = Math.round(scalePercentage) / 100;
  const baseElement = baseRef.current || ({} as typeof baseRef.current);
  const baseSize = baseElement.offsetWidth;
  const contentElement =
    contentRef.current || ({} as typeof contentRef.current);
  const contentSize = contentElement.offsetWidth;
  const scaledContentSize = contentSize * scale;

  const debug = {
    x,
    baseSize,
    scale,
    contentSize,
    scaledContentSize,
  };

  const model = {
    x: Math.round(x),
    y: Math.round(y),
    z: Math.round(z),
    scale: scale,
    rotateX: rotateX,
    rotateY: rotateY,
    rotateZ: rotateZ,
    perspective: perspective,
  };

  const onMouseDown: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (event.button === 2) {
        event.preventDefault();
        setDragOrigin({ x: event.clientX - x, y: event.clientY - y });
        setIsDragging(true);
      }
    },
    [x, y]
  );
  const onMouseUp: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (event.button === 2) {
        event.preventDefault();
        setDragOrigin(noDragOrigin);
        setIsDragging(false);
      }
    },
    []
  );
  const onMouseMove: React.DragEventHandler<HTMLDivElement> = useCallback(
    throttle((event) => {
      if (isDragging && dragOrigin.x && dragOrigin.y) {
        setX(event.clientX - dragOrigin.x);
        setY(event.clientY - dragOrigin.y);
      }
    }, 50),
    [isDragging, dragOrigin.x, dragOrigin.y]
  );

  const onWheel: React.WheelEventHandler<HTMLDivElement> = useCallback(
    throttle(
      (event: React.WheelEvent<HTMLDivElement>) => {
        setScalePercentage((scalePercentage) => {
          const newScalePercentage = Math.max(
            Math.min(scalePercentage - event.deltaY, maxScalePercentage),
            minScalePercentage
          );

          const contentElement = contentRef.current;
          const baseElement = baseRef.current;
          if (contentElement && baseElement) {
            const cursorX = event.clientX;
            const cursorY = event.clientY;
            const scale = scalePercentage / 100;
            const newScale = newScalePercentage / 100;
            const { left: contentX, top: contentY } =
              contentElement.getBoundingClientRect();
            const { left: baseX, top: baseY } =
              baseElement.getBoundingClientRect();
            setX((currentX) => {
              const distanceToCursor = cursorX - baseX - contentX;
              const scaledDistanceToCursor =
                (distanceToCursor / scale) * newScale;
              const distanceDifference =
                scaledDistanceToCursor - distanceToCursor;
              const distanceDifferenceDescaled = distanceDifference / scale;
              const newX = currentX - distanceDifferenceDescaled;
              /*console.log('contentOffset', currentX);
              console.log('contentX', contentX);
              console.log('baseX', baseX);
              console.log('distanceToCursor', distanceToCursor);
              console.log('scaledDistanceToCursor', scaledDistanceToCursor);
              console.log('distanceDifference', distanceDifference);
              console.log(
                'distanceDifferenceDescaled',
                distanceDifferenceDescaled
              );
              console.log('newX', newX);*/
              return Math.round(newX);
            });
            setY((currentY) => {
              const distanceToCursor = cursorY - baseY - contentY;
              const scaledDistanceToCursor =
                (distanceToCursor / scale) * newScale;
              const distanceDifference =
                scaledDistanceToCursor - distanceToCursor;
              const distanceDifferenceDescaled = distanceDifference / scale;
              const newY = currentY - distanceDifferenceDescaled;
              return Math.round(newY);
            });
          }

          return newScalePercentage;
        });
      },
      100,
      { leading: true, trailing: false }
    ),
    []
  );

  const onScalePercentageIncrease = useCallback(() => {
    setScalePercentage((scalePercentage) =>
      Math.max(
        Math.min(scalePercentage + scaleStep, maxScalePercentage),
        minScalePercentage
      )
    );
  }, []);
  const onScalePercentageDecrease = useCallback(() => {
    setScalePercentage((scalePercentage) =>
      Math.max(
        Math.min(scalePercentage - scaleStep, maxScalePercentage),
        minScalePercentage
      )
    );
  }, []);
  const onScalePercentageChange = useCallback((event) => {
    setScalePercentage(
      Math.max(
        Math.min(event.target.value, maxScalePercentage),
        minScalePercentage
      )
    );
  }, []);
  const onPanUp = useCallback(() => {
    setY((y) => y + panStep * (scalePercentage / 100));
  }, [scalePercentage]);
  const onPanRight = useCallback(() => {
    setX((x) => x - panStep * (scalePercentage / 100));
  }, [scalePercentage]);
  const onPanDown = useCallback(() => {
    setY((y) => y - panStep * (scalePercentage / 100));
  }, [scalePercentage]);
  const onPanLeft = useCallback(() => {
    setX((x) => x + panStep * (scalePercentage / 100));
  }, [scalePercentage]);

  const onOneToOne = useCallback(() => {
    setScalePercentage(100);
  }, []);
  const onZoomOut = useCallback(() => {
    focus(contentRef.current);
  }, []);
  const onTest = useCallback(() => {
    setScalePercentage((scalePercentage) => {
      setX((x) => {
        return 0;
      });
      return 100;
    });
  }, []);
  const onTest2 = useCallback(() => {
    onWheel({
      deltaY: 10,
      clientX: 200,
      clientY: 200,
    } as any);
  }, []);

  const update: CameraContextType['update'] = useCallback((data) => {
    setX((x) => (data.x !== undefined ? data.x : x));
    setY((y) => (data.y !== undefined ? data.y : y));
    setZ((z) => (data.z !== undefined ? data.z : z));
    setScalePercentage((scalePercentage) =>
      data.scale !== undefined ? data.scale : scalePercentage
    );
    setRotateX((rotateX) =>
      data.rotateX !== undefined ? data.rotateX : rotateX
    );
    setRotateY((rotateY) =>
      data.rotateY !== undefined ? data.rotateY : rotateY
    );
    setRotateZ((rotateZ) =>
      data.rotateZ !== undefined ? data.rotateZ : rotateZ
    );
    setPerspective((perspective) =>
      data.perspective !== undefined ? data.perspective : perspective
    );
  }, []);

  const focus: CameraContextType['focus'] = (targetElement, options = {}) => {
    const { scaleMargin = 20, scaleMode = CameraFocusScaleMode.Contain } =
      options;
    const baseElement = baseRef.current;
    const contentElement = contentRef.current;
    if (targetElement && baseElement && contentElement) {
      const scale = scalePercentage / 100;
      const newScale =
        getScale(targetElement, baseElement, { scaleMargin, scaleMode }) ||
        scale;
      const {
        left: targetX,
        top: targetY,
        width: targetWidthCurrent,
        height: targetHeightCurrent,
      } = targetElement.getBoundingClientRect();
      const {
        left: baseX,
        top: baseY,
        width: baseWidth,
        height: baseHeight,
      } = baseElement.getBoundingClientRect();
      setX((x) => {
        const targetWidthScaled = (targetWidthCurrent / scale) * newScale;
        const offsetFromContentX = targetX - baseX;
        const xScaled = ((x - offsetFromContentX) / scale) * newScale;
        const xOffset = (baseWidth - targetWidthScaled) / 2;
        const xNew = xScaled + xOffset;
        return xNew;
      });
      setY((y) => {
        const targetHeightScaled = (targetHeightCurrent / scale) * newScale;
        const offsetFromContentY = targetY - baseY;
        const yScaled = ((y - offsetFromContentY) / scale) * newScale;
        const yOffset = (baseHeight - targetHeightScaled) / 2;
        const yNew = yScaled + yOffset;
        return yNew;
      });
      setScalePercentage(newScale * 100);
    }
  };

  const context: CameraContextType = {
    ...model,
    isDragging,
    update,
    focus,
  };

  return (
    <div
      className={clsx(
        styles.base,
        className,
        isDragging && styles.base__dragging
      )}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onWheel={onWheel}
      onContextMenu={onContextMenu}
      ref={baseRef}
    >
      <CameraContext.Provider value={context}>
        <CameraView
          className={styles.view}
          contentClassName={styles.viewContent}
          contentRef={contentRef}
          {...model}
        >
          {children}
        </CameraView>
        {true && (
          <div className={styles.debug}>
            <pre>{JSON.stringify(debug, null, 2)}</pre>
          </div>
        )}
        <div className={styles.controls}>
          <div className={styles.controls_scale}>
            <Button className={styles.controls_test} onClick={onTest}>
              Test
            </Button>
            <Button className={styles.controls_test2} onClick={onTest2}>
              Test2
            </Button>
            <Button
              className={styles.controls_scalePercentageIncrease}
              onClick={onScalePercentageIncrease}
            >
              +
            </Button>
            <Button
              className={styles.controls_scalePercentageDecrease}
              onClick={onScalePercentageDecrease}
            >
              &minus;
            </Button>
            <input
              type="number"
              value={Math.round(scalePercentage)}
              min={minScalePercentage}
              max={maxScalePercentage}
              onChange={onScalePercentageChange}
            />
            <Button className={styles.controls_oneToOne} onClick={onOneToOne}>
              1:1
            </Button>
            <Button className={styles.controls_zoomOut} onClick={onZoomOut}>
              ⤢
            </Button>
          </div>
          <Button className={styles.controls_panUp} onClick={onPanUp}>
            ▲
          </Button>
          <Button className={styles.controls_panRight} onClick={onPanRight}>
            ►
          </Button>
          <Button className={styles.controls_panDown} onClick={onPanDown}>
            ▼
          </Button>
          <Button className={styles.controls_panLeft} onClick={onPanLeft}>
            ◀
          </Button>
        </div>
      </CameraContext.Provider>
    </div>
  );
};
export default CameraControl;
