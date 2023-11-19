import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import {
  Engine,
  Render,
  Bodies,
  World,
  Events,
  Composite,
  Body,
} from "matter-js";

import multiplier0_4 from "../assets/multipliers/multiplier0_4.png";
import multiplier0_6 from "../assets/multipliers/multiplier0_6.png";
import multiplier0_9 from "../assets/multipliers/multiplier0_9.png";
import multiplier4_0 from "../assets/multipliers/multiplier4_0.png";
import multiplier20_5 from "../assets/multipliers/multiplier20_5.png";

const pinGap = 25;
const pinSize = 3;

const generateRouteWalls = (
  cw: number,
  ch: number,
  _randomNumber: number,
  colisionGroup: number
) => {
  // const randomNumber = Number(`0x${_randomNumber}`)
  const randomNumber = Math.floor(Math.random() * 255);
  const leastSignificant8Bits = randomNumber & 255;
  console.log("leastSignificant8Bits: ", leastSignificant8Bits);
  const binaryRepr = leastSignificant8Bits.toString(2);
  const count = binaryRepr.split("").filter((bit) => bit === "1").length;
  console.log("count: ", count);
  console.log("binaryRepr: ", binaryRepr.padStart(8, "0"));
  const trapWidth = pinGap * 6;
  const trapHeight = pinGap * 8;
  return [
    Bodies.trapezoid(
      cw / 2 - pinGap * 4.5 - trapWidth / 2 + count * pinGap - 5,
      ch / 8 + 9 * pinGap + 10 - trapHeight / 2,
      trapWidth,
      trapHeight,
      1.35,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
        collisionFilter: {
          category: colisionGroup,
          mask: colisionGroup,
        },
        friction: 0,
        slop: 0,
        restitution: 1,
        id: (colisionGroup + 1) ** 2,
      }
    ),
    Bodies.trapezoid(
      cw / 2 - pinGap * 4.5 + trapWidth / 2 + pinGap + 10 + count * pinGap - 5,
      ch / 8 + 9 * pinGap + 10 - trapHeight / 2,
      -trapWidth,
      trapHeight,
      1.35,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
        collisionFilter: {
          category: colisionGroup,
          mask: colisionGroup,
        },
        friction: 0,
        slop: 0,
        restitution: 1,
        id: (colisionGroup + 1) ** 2 + 1,
      }
    ),
    Bodies.rectangle(
      cw / 2 - pinGap * 4.5 - 5 + count * pinGap + 5,
      ch / 8 + 8 * pinGap + pinGap,
      10,
      2 * pinGap,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
        collisionFilter: {
          category: colisionGroup,
          mask: colisionGroup,
        },
        friction: 0,
        slop: 0,
        restitution: 1,
        id: (colisionGroup + 1) ** 2 + 2,
      }
    ),
    Bodies.rectangle(
      cw / 2 - pinGap * 4.5 + 5 + (count + 1) * pinGap - 5,
      ch / 8 + 8 * pinGap + pinGap,
      10,
      2 * pinGap,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
        collisionFilter: {
          category: colisionGroup,
          mask: colisionGroup,
        },
        friction: 0,
        slop: 0,
        restitution: 1,
        id: (colisionGroup + 1) ** 2 + 3,
      }
    ),
  ];
};

function generatePins(cw, ch) {
  const pins = [];
  for (let l = 0; l < 8; l++) {
    const linePins = 3 + l;
    const lineWidth = linePins * pinGap;
    for (let i = 0; i < linePins; i++) {
      const pinX = cw / 2 - lineWidth / 2 + i * pinGap + pinGap / 2;

      const pinY = ch / 8 + l * pinGap + pinGap;

      const pin = Bodies.circle(pinX, pinY, pinSize, {
        label: `pin-${i}`,
        render: {
          fillStyle: 'white',
        },
        isStatic: true,
        friction: 0,
        collisionFilter: {
          category: 2 ** 31 - 1,
          mask: 2 ** 31 - 1,
        },
        id: (2 ** 31 - 1) ** 2 + i,
      });
      pins.push(pin);
    }
  }
  return pins;
}

function generateMultipliers(cw, ch) {
  const multiplierBodies = [];
  const multipliers = [
    {
      label: "block",
      img: multiplier20_5,
    },
    {
      label: "block",
      img: multiplier4_0,
    },
    {
      label: "block",
      img: multiplier0_9,
    },
    {
      label: "block",
      img: multiplier0_6,
    },
    {
      label: "block",
      img: multiplier0_4,
    },
    {
      label: "block",
      img: multiplier0_6,
    },
    {
      label: "block",
      img: multiplier0_9,
    },
    {
      label: "block",
      img: multiplier4_0,
    },
    {
      label: "block",
      img: multiplier20_5,
    },
  ];

  let lastMultiplierX = cw / 2 - (pinGap / 2) * 8 - pinGap;
  multipliers.forEach((multiplier) => {
    const blockSize = 25; // height and width
    const multiplierBody = Bodies.rectangle(
      lastMultiplierX + 25,
      ch / 8 + 8 * pinGap + 40,
      blockSize,
      blockSize,
      {
        label: multiplier.label,
        isStatic: true,
        render: {
          sprite: {
            texture: multiplier.img,
            xScale: 0.08,
            yScale: 0.08,
          },
          // fillStyle: `#${Math.floor(
          //   (Math.random() * 16777215) / 2 + 16777215 / 4
          // ).toString(16)}`,
        },
        collisionFilter: {
          category: 2 ** 31 - 1,
          mask: 2 ** 31 - 1,
        },
      }
    );
    lastMultiplierX = multiplierBody.position.x;
    multiplierBodies.push(multiplierBody);
  });
  return multiplierBodies;
}

const PlinkoGame = forwardRef((props, ref) => {
  const scene = useRef();
  const isPressed = useRef(false);
  const engine = useRef(Engine.create());

  async function onBodyCollision(event: IEventCollision<Engine>) {
    // console.log(event);
    const pairs = event.pairs;
    for (const pair of pairs) {
      const { bodyA, bodyB } = pair;
      if (bodyB.label.includes("ball") && bodyA.label.includes("block")) {
        setTimeout(() => {
          World.remove(
            engine.current.world,
            Composite.get(engine.current.world, (bodyB.id + 1) ** 2, "body")
          );
          World.remove(
            engine.current.world,
            Composite.get(engine.current.world, (bodyB.id + 1) ** 2 + 1, "body")
          );
          World.remove(
            engine.current.world,
            Composite.get(engine.current.world, (bodyB.id + 1) ** 2 + 2, "body")
          );
          World.remove(
            engine.current.world,
            Composite.get(engine.current.world, (bodyB.id + 1) ** 2 + 3, "body")
          );
          World.remove(engine.current.world, bodyB);
        }, 500);
        // console.log("collision detected ", event.pairs[0]);
      }
      if (bodyA.label.includes("ball") && bodyB.label.includes("block")) {
        setTimeout(() => {
          World.remove(
            engine.current.world,
            Composite.get(engine.current.world, (bodyA.id + 1) ** 2, "body")
          );
          World.remove(
            engine.current.world,
            Composite.get(engine.current.world, (bodyA.id + 1) ** 2 + 1, "body")
          );
          World.remove(
            engine.current.world,
            Composite.get(engine.current.world, (bodyA.id + 1) ** 2 + 2, "body")
          );
          World.remove(
            engine.current.world,
            Composite.get(engine.current.world, (bodyA.id + 1) ** 2 + 3, "body")
          );
          World.remove(engine.current.world, bodyA);
        }, 500);
        // console.log("collision detected ", event.pairs[0]);
      }
    }
  }

  Events.on(engine.current, "collisionActive", onBodyCollision);

  useEffect(() => {
    console.log("cw: ", scene.current.clientWidth);
    console.log("ch: ", scene.current.clientHeight);
    const cw = scene.current.clientWidth;
    const ch = scene.current.clientHeight;
    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: "transparent",
      },
    });
    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(-10, ch / 2, 20, ch, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, {
        isStatic: true,
        render: { visible: false },
      }),
    ]);
    World.add(engine.current.world, generatePins(cw, ch));
    World.add(engine.current.world, generateMultipliers(cw, ch));
    engine.current.gravity.y = 0.25;
    Engine.run(engine.current);
    Render.run(render);
    return () => {
      Render.stop(render);
      World.clear(engine.current.world);
      Engine.clear(engine.current);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

  const addBall = (x, y, random_number, numberOfBets) => {
    console.log("hello");
    let i = 0;
    for (
      let colisionGroup = 1;
      colisionGroup < 2 ** numberOfBets;
      colisionGroup *= 2
    ) {
      console.log("colisionGroup: ", colisionGroup);
      const ball = Bodies.circle(x, y, 4, {
        restitution: 0.54,
        friction: 0.1,
        frictionAir: 0.01,
        label: "ball",
        collisionFilter: {
          category: colisionGroup,
          mask: colisionGroup,
        },
        render: {
          fillStyle: "white",
        },
        id: colisionGroup,
        mass: 10,
      });
      console.log("generating route walls with rand: ", random_number[i]);
      World.add(
        engine.current.world,
        generateRouteWalls(
          scene.current.clientWidth,
          scene.current.clientHeight,
          random_number,
          colisionGroup
        )
      );
      // World.add(engine.current.world, generateRouteWalls(cw, ch, 0));
      World.add(engine.current.world, ball);
      Body.applyForce(ball, ball.position, {
        x: Math.random() * 0.05 - 0.0025,
        y: Math.random() * 0.05,
      });
      i++;
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      refAddBall,
    }),
    []
  );

  const refAddBall = (random_number, numberOfBets) => {
    if (Composite.get(engine.current.world, 222, "body")) return;
    console.log("adding ball with rand: ", random_number, numberOfBets);
    addBall(
      scene.current.clientWidth / 2 + Math.random() * 2,
      20 + Math.random() * 2,
      random_number,
      numberOfBets
    );
  };

  return (
    <div className="w-[500px] aspect-[5/4] rounded-xl bg-[#1a1a1a]">
      <div ref={scene} className="w-full h-full" />
    </div>
  );
});

export default PlinkoGame;
