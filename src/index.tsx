import React from "react";
import Konva from "konva";
import { Stage } from "react-konva";

import { Map } from "./Map";
import { Regions } from "./regions";

import { store } from "./store";
import { Region, Point } from "./types";
import { getRelativePointerPosition } from "./utils";

export { store, useStore } from "./store";

interface Props {
  width: number;
  height: number;
  source: string;
}

export const Annotation: React.FC<Props> = ({
  width,
  height,
  source,
}: Props) => {
  const onMouseDown = ({ target }: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = target.getStage();
    const { active, isDrawing } = store.getState();

    if (active && isDrawing && stage) {
      const { x, y } = getRelativePointerPosition(stage);

      const regions: Region[] = store.getState().regions;

      store.setState({
        regions: regions.map((item: Region) => {
          if (item.id === active) {
            const points = item.points;

            // increment point id
            const last: Point = points[points.length - 1];
            console.log(last);
            const increase = (last?.id ?? 0) + 1;

            item.points.push({
              x,
              y,
              id: increase,
            });
          }

          return item;
        }),
      });
    }
  };

  const onMouseMove = ({ target }: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = target.getStage();
    const { regions, active, isDrawing } = store.getState();

    let length =
      regions.find((item: Region) => item.id === active)?.points.length ?? 0;

    if (isDrawing && stage && length) {
      const { x, y } = getRelativePointerPosition(stage);
      const Line = stage.find(`#line-${active}`)[0] ?? null;
      // @ts-ignore
      const points = [...Line.points()];

      length *= 2;

      points[length] = x;
      points[length + 1] = y;

      // @ts-ignore
      Line.points([...points]);

      stage.batchDraw();
    }
  };

  return (
    <Stage
      width={width}
      height={height}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
    >
      <Map source={source} />
      <Regions />
    </Stage>
  );
};
