import React, { Fragment } from "react";
import { Circle, Rect } from "react-konva";
import { KonvaEventObject } from "konva/types/Node";

import { ID, Point, Region } from "../types";
import { store } from "../store";
import { calcProportion } from "../utils";

interface Props {
  id: ID;
  points: Point[];
  closed: boolean;
}

const { min, max } = Math;

export const Points: React.FC<Props> = ({ id, closed, points }: Props) => {
  const rectSize = calcProportion(15);
  const rectOffset = rectSize / 2;

  // Press circle point and close plygon
  const onVertexMouseDown = (_e: KonvaEventObject<MouseEvent>, id: number) => {
    const { regions, setRegions, setActive, setDrawing } = store.getState();

    setRegions(
      regions.map((item: Region) => {
        if (item.id === id) {
          item.closed = true;
        }

        return item;
      })
    );

    setActive(null);
    setDrawing(false);
  };

  // Move Reactable Point
  const onDragMove = ({ target }: KonvaEventObject<MouseEvent>) => {
    const { width, height } = store.getState().dimension;

    const targetId = Number(target.attrs.id);
    const group = target.getParent();

    const Line = group.find(`#line-${id}`);
    const linePoints: number[] = [];

    for (const item of points) {
      if (item.id === targetId) {
        let x: number = target.x();
        let y: number = target.y();

        y = max(0, min(height, y));
        x = max(0, min(width, x));

        if (target.y() !== y) {
          target.y(y);
        }
        if (target.x() !== x) {
          target.x(x);
        }

        linePoints.push(x);
        linePoints.push(y);
      } else {
        linePoints.push(item.x);
        linePoints.push(item.y);
      }
    }

    Line.points(linePoints);
  };

  const onDragEnd = ({ target }: KonvaEventObject<MouseEvent>) => {
    const targetId = Number(target.attrs.id);

    const { regions, setRegions } = store.getState();

    setRegions(
      regions.map((item: Region) => {
        if (item.id === id) {
          item.points = points.map((point: Point) => {
            if (point.id === targetId) {
              const x: number = target.x();
              const y: number = target.y();

              point.x = x;
              point.y = y;
            }

            return point;
          });
        }

        return item;
      })
    );
  };

  const setStageCursor = (
    { target }: KonvaEventObject<MouseEvent>,
    type: string
  ) => {
    const stage = target.getStage();

    if (stage) {
      stage.container().style.cursor = type;
    }
  };

  return (
    <Fragment>
      {points.map(({ x, y, id: pointId }: Point, key: number) => {
        if (key !== 0 || closed) {
          return (
            <Rect
              x={x}
              y={y}
              key={key}
              width={rectSize}
              height={rectSize}
              offsetX={rectOffset}
              offsetY={rectOffset}
              opacity={0.8}
              draggable={closed}
              id={String(pointId)}
              /* scaleX={invertedScale} */
              /* scaleY={invertedScale} */
              name="region-rect"
              fill="rgb(68, 232, 145)"
              onDragMove={onDragMove}
              onDragEnd={onDragEnd}
              onMouseEnter={(e) => closed && setStageCursor(e, "move")}
              onMouseLeave={(e) => closed && setStageCursor(e, "default")}
            />
          );
        } else {
          return (
            <Circle
              x={x}
              y={y}
              key={key}
              opacity={0.8}
              strokeWidth={calcProportion(2)}
              radius={calcProportion(10)}
              /* scaleX={invertedScale} */
              /* scaleY={invertedScale} */
              name="region-circle"
              stroke="rgb(68, 232, 145)"
              onMouseEnter={(e) => setStageCursor(e, "pointer")}
              onMouseLeave={(e) => setStageCursor(e, "default")}
              onMouseDown={(e) => onVertexMouseDown(e, id)}
            />
          );
        }
      })}
    </Fragment>
  );
};
