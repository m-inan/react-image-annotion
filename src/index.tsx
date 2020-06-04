import React, { useRef } from "react";
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
  const _stage = useRef(null);

  const onMouseDown = ({ target }: Konva.KonvaEventObject<MouseEvent>) => {
    const { active, isDrawing } = store.getState();
    const stage = target.getStage();

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

  return (
    <Stage ref={_stage} width={width} height={height} onMouseDown={onMouseDown}>
      <Map source={source} />
      <Regions />
    </Stage>
  );
};
